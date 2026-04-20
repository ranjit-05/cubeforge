import { useState, useEffect, useRef, useCallback } from "react";

export const TIMER_STATES = {
  IDLE: "IDLE",
  INSPECTION: "INSPECTION",
  READY: "READY",
  RUNNING: "RUNNING",
  STOPPED: "STOPPED",
};

const formatTime = (ms) => {
  if (ms < 0) return "0.00";
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${seconds}.${centiseconds.toString().padStart(2, "0")}`;
};

export const useTimer = (inspectionTime = 15) => {
  const [timerState, setTimerState] = useState(TIMER_STATES.IDLE);
  const [displayTime, setDisplayTime] = useState("0.00");
  const [finalTime, setFinalTime] = useState(null);
  const [inspectionLeft, setInspectionLeft] = useState(inspectionTime);

  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const inspectionRef = useRef(null);
  const elapsedRef = useRef(0);
  const startSolveRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(inspectionRef.current);
    };
  }, []);

  const clearAllTimers = useCallback(() => {
    clearInterval(intervalRef.current);
    clearInterval(inspectionRef.current);
  }, []);

  const startInspection = useCallback(() => {
    clearAllTimers();
    setTimerState(TIMER_STATES.INSPECTION);
    setInspectionLeft(inspectionTime);
    setFinalTime(null);
    let countdown = inspectionTime;

    inspectionRef.current = setInterval(() => {
      countdown -= 1;
      setInspectionLeft(countdown);
      if (countdown <= 0) {
        clearInterval(inspectionRef.current);
        startSolveRef.current?.();
      }
    }, 1000);
  }, [inspectionTime, clearAllTimers]);

  const startSolve = useCallback(() => {
    clearAllTimers();
    startTimeRef.current = Date.now();
    setTimerState(TIMER_STATES.RUNNING);

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      elapsedRef.current = elapsed;
      setDisplayTime(formatTime(elapsed));
    }, 10);
  }, [clearAllTimers]);

  startSolveRef.current = startSolve;

  const stopTimer = useCallback(() => {
    if (timerState !== TIMER_STATES.RUNNING) return null;
    clearAllTimers();
    const elapsed = Date.now() - startTimeRef.current;
    const timeString = formatTime(elapsed);
    setDisplayTime(timeString);
    setFinalTime(elapsed);
    setTimerState(TIMER_STATES.STOPPED);
    return elapsed;
  }, [timerState]);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setTimerState(TIMER_STATES.IDLE);
    setDisplayTime("0.00");
    setFinalTime(null);
    setInspectionLeft(inspectionTime);
    elapsedRef.current = 0;
  }, [inspectionTime]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (timerState === TIMER_STATES.IDLE || timerState === TIMER_STATES.STOPPED) {
        startInspection();
      } else if (timerState === TIMER_STATES.INSPECTION) {
        clearAllTimers();
        startSolve();
      } else if (timerState === TIMER_STATES.RUNNING) {
        stopTimer();
      }
    },
    [timerState, startInspection, startSolve, stopTimer]
  );

  return {
    timerState,
    displayTime,
    finalTime,
    inspectionLeft,
    startInspection,
    startSolve,
    stopTimer,
    resetTimer,
    handleKeyDown,
    formatTime,
  };
};

export { formatTime };
