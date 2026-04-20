import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export const addSolve = async (userId, solveData) => {
  const ref = collection(db, "solves");
  return await addDoc(ref, {
    userId,
    ...solveData,
    createdAt: serverTimestamp(),
  });
};

export const getSolvesQuery = (userId) =>
  query(
    collection(db, "solves"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(100)
  );

export const getUserSolves = async (userId) => {
  const q = getSolvesQuery(userId);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteSolve = async (solveId) => {
  await deleteDoc(doc(db, "solves", solveId));
};

export const updateUserProfile = async (userId, data) => {
  const ref = doc(db, "users", userId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
};

export const saveAlgorithm = async (userId, algo) => {
  const ref = collection(db, "savedAlgos");
  return await addDoc(ref, { userId, ...algo, savedAt: serverTimestamp() });
};

export const getSavedAlgorithms = async (userId) => {
  const q = query(
    collection(db, "savedAlgos"),
    where("userId", "==", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteSavedAlgorithm = async (algoId) => {
  await deleteDoc(doc(db, "savedAlgos", algoId));
};
