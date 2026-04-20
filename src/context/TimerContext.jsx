import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { addSolve, deleteSolve, getSolvesQuery } from "../services/firestoreService";
import { onSnapshot } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const TimerContext = createContext(null);

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error("useTimerContext must be inside TimerProvider");
  return context;
};

export const TimerProvider = ({ children }) => {
  const { user } = useAuth();

  const [solves, setSolves] = useState([]);
  const [solvesLoading, setSolvesLoading] = useState(true);
  const [solvesError, setSolvesError] = useState(null);

  useEffect(() => {
    if (!user) {
      setSolves([]);
      setSolvesLoading(false);
      return;
    }
    setSolvesLoading(true);
    const q = getSolvesQuery(user.uid);
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSolves(data);
        setSolvesLoading(false);
      },
      (err) => {
        setSolvesError(err.message);
        setSolvesLoading(false);
      }
    );
    return () => unsubscribe();
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
        setSolvesError(err.message);
      }
    },
    [user]
  );

  const removeSolve = useCallback(async (solveId) => {
    try {
      await deleteSolve(solveId);
      setSolves((prev) => prev.filter((s) => s.id !== solveId));
    } catch (err) {
      setSolvesError(err.message);
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

    return { pb, avg, ao5, ao12, total: solves.length, dailyAverages };
  }, [solves]);

  const [sessionSolves, setSessionSolves] = useState([]);
  const [inspectionTime, setInspectionTime] = useState(15);

  const addSessionSolve = useCallback((solve) => {
    setSessionSolves((prev) => [solve, ...prev]);
  }, []);

  const removeSessionSolve = useCallback((index) => {
    setSessionSolves((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearSession = useCallback(() => {
    setSessionSolves([]);
  }, []);

  const sessionStats = (() => {
    if (sessionSolves.length === 0) return null;
    const times = sessionSolves.map((s) => s.time);
    const best = Math.min(...times);
    const worst = Math.max(...times);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;

    let ao5 = null;
    if (times.length >= 5) {
      const last5 = times.slice(0, 5);
      const sorted = [...last5].sort((a, b) => a - b);
      ao5 = sorted.slice(1, 4).reduce((a, b) => a + b, 0) / 3;
    }

    let ao12 = null;
    if (times.length >= 12) {
      const last12 = times.slice(0, 12);
      const sorted = [...last12].sort((a, b) => a - b);
      ao12 = sorted.slice(1, 11).reduce((a, b) => a + b, 0) / 10;
    }

    return { best, worst, avg, ao5, ao12, count: times.length };
  })();

  const value = {
    solves,
    stats,
    solvesLoading,
    solvesError,
    saveSolve,
    removeSolve,
    sessionSolves,
    inspectionTime,
    setInspectionTime,
    addSessionSolve,
    removeSessionSolve,
    clearSession,
    sessionStats,
  };

  return (
    <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
  );
};
