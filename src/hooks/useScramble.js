import { useState, useCallback } from "react";
import { generateScramble } from "../data/algorithms";

export const useScramble = (length = 20) => {
  const [scramble, setScramble] = useState(() => generateScramble(length));

  const newScramble = useCallback(() => {
    setScramble(generateScramble(length));
  }, [length]);

  const moves = scramble.split(" ");

  return { scramble, moves, newScramble };
};
