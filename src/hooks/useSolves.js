import { useState, useEffect, useMemo, useCallback } from "react";
import { getUserSolves, addSolve, deleteSolve } from "../services/firestoreService";
import { useAuth } from "../context/AuthContext";

export const useSolves = () => {
  const { user } = useAuth();
  const [solves, setSolves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setSolves([]);
      setLoading(false);
      return;
    }

    const fetchSolves = async () => {
      try {
        setLoading(true);
        const data = await getUserSolves(user.uid);
        setSolves(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolves();
  }, [user]);

  const saveSolve = useCallback(
    async (solveData) => {
      if (!user) return;
      try {
        const docRef = await addSolve(user.uid, solveData);
        const newSolve = { id: docRef.id, userId: user.uid, ...solveData };
        setSolves((prev) => [newSolve, ...prev]);
        return newSolve;
      } catch (err) {
        setError(err.message);
      }
    },
    [user]
  );

  const removeSolve = useCallback(async (solveId) => {
    try {
      await deleteSolve(solveId);
      setSolves((prev) => prev.filter((s) => s.id !== solveId));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const stats = useMemo(() => {
    if (solves.length === 0) return null;
    const times = solves.map((s) => s.time);
    const pb = Math.min(...times);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;

    const ao5 = (() => {
      if (times.length < 5) return null;
      const last5 = [...times].slice(0, 5).sort((a, b) => a - b);
      return last5.slice(1, 4).reduce((a, b) => a + b, 0) / 3;
    })();

    const ao12 = (() => {
      if (times.length < 12) return null;
      const last12 = [...times].slice(0, 12).sort((a, b) => a - b);
      return last12.slice(1, 11).reduce((a, b) => a + b, 0) / 10;
    })();

    const byDay = solves.reduce((acc, solve) => {
      const date = solve.createdAt?.toDate?.()
        ? solve.createdAt.toDate().toLocaleDateString()
        : new Date().toLocaleDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(solve.time);
      return acc;
    }, {});

    const dailyAverages = Object.entries(byDay)
      .map(([date, times]) => ({
        date,
        avg: times.reduce((a, b) => a + b, 0) / times.length / 1000,
        count: times.length,
      }))
      .reverse();

    return {
      pb,
      avg,
      ao5,
      ao12,
      total: solves.length,
      dailyAverages,
    };
  }, [solves]);

  return { solves, stats, loading, error, saveSolve, removeSolve };
};
