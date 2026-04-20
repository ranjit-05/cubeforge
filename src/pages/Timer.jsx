import { useEffect, useCallback, useState, useRef } from "react";
import { useTimer, TIMER_STATES, formatTime } from "../hooks/useTimer";
import { useScramble } from "../hooks/useScramble";
import { useTimerContext } from "../context/TimerContext";
import ScrambleDisplay from "../components/ScrambleDisplay";
import CubeViewer from "../components/CubeViewer";
import StatCard from "../components/StatCard";
import SolveCard from "../components/SolveCard";
import { FiTrash2, FiSettings, FiX } from "react-icons/fi";

const Timer = () => {
  const {
    sessionSolves, addSessionSolve, removeSessionSolve,
    clearSession, sessionStats, inspectionTime, setInspectionTime,
    saveSolve,
  } = useTimerContext();

  const { scramble, moves, newScramble } = useScramble(20);
  const [showSettings, setShowSettings] = useState(false);
  const [showCubePreview, setShowCubePreview] = useState(false);
  const [saveToCloud, setSaveToCloud] = useState(true);

  const scrambleRef = useRef(scramble);
  scrambleRef.current = scramble;

  const processedFinalTimeRef = useRef(null);

  const {
    timerState, displayTime, finalTime, inspectionLeft,
    stopTimer, resetTimer, handleKeyDown, startInspection,
  } = useTimer(inspectionTime);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (timerState !== TIMER_STATES.STOPPED || !finalTime) return;
    if (processedFinalTimeRef.current === finalTime) return;
    processedFinalTimeRef.current = finalTime;

    const solveData = {
      time: finalTime,
      scramble: scrambleRef.current,
      dnf: false,
      plusTwo: false,
    };

    addSessionSolve(solveData);
    if (saveToCloud) saveSolve(solveData);
    newScramble();
  }, [timerState, finalTime]);

  const handleTouch = useCallback(() => {
    if (timerState === TIMER_STATES.IDLE || timerState === TIMER_STATES.STOPPED) {
      startInspection();
    } else if (timerState === TIMER_STATES.RUNNING) {
      stopTimer();
    }
  }, [timerState, startInspection, stopTimer]);

  const timerColor = (() => {
    if (timerState === TIMER_STATES.INSPECTION) return "#fbbf24";
    if (timerState === TIMER_STATES.RUNNING) return "#22d3ee";
    if (timerState === TIMER_STATES.STOPPED) return "#4ade80";
    return "#ffffff";
  })();

  const pbTime = sessionStats?.best;
  const latestSolve = sessionSolves[0];

  return (
    <div className="page timer-page">
      <div className="timer-top">
        <ScrambleDisplay scramble={scramble} moves={moves} onNewScramble={() => { newScramble(); resetTimer(); }} />
        <div className="timer-top-actions">
          <button
            className={`btn-icon ${showCubePreview ? "active" : ""}`}
            onClick={() => setShowCubePreview((v) => !v)}
            title="Toggle cube preview"
          >
            🎲
          </button>
          <button
            className={`btn-icon ${showSettings ? "active" : ""}`}
            onClick={() => setShowSettings((v) => !v)}
            title="Settings"
          >
            <FiSettings size={16} />
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <div className="settings-header">
            <h3>Timer Settings</h3>
            <button className="btn-icon" onClick={() => setShowSettings(false)}><FiX /></button>
          </div>
          <div className="setting-row">
            <label>Inspection Time</label>
            <select
              value={inspectionTime}
              onChange={(e) => setInspectionTime(Number(e.target.value))}
              className="setting-select"
            >
              <option value={0}>No Inspection</option>
              <option value={8}>8 seconds</option>
              <option value={15}>15 seconds (WCA)</option>
              <option value={30}>30 seconds</option>
            </select>
          </div>
          <div className="setting-row">
            <label>Save to Cloud</label>
            <button
              className={`toggle-btn ${saveToCloud ? "on" : "off"}`}
              onClick={() => setSaveToCloud((v) => !v)}
            >
              {saveToCloud ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      )}

      {showCubePreview && (
        <div className="cube-preview-area">
          <CubeViewer
            alg={scramble}
            controlPanel="none"
            hintFacelets="floating"
            style={{ height: 200 }}
          />
        </div>
      )}

      {timerState === TIMER_STATES.INSPECTION && (
        <div className="inspection-banner">
          <span>INSPECTION</span>
          <span
            className="inspection-count"
            style={{ color: inspectionLeft <= 3 ? "#ef4444" : "#fbbf24" }}
          >
            {inspectionLeft}s
          </span>
        </div>
      )}

      <div
        className="timer-display-area"
        onClick={handleTouch}
        onTouchStart={handleTouch}
        role="button"
        tabIndex={0}
      >
        <div className="timer-hint">
          {timerState === TIMER_STATES.IDLE && "Press SPACE or tap to begin inspection"}
          {timerState === TIMER_STATES.INSPECTION && "Press SPACE or tap to start solving!"}
          {timerState === TIMER_STATES.RUNNING && "Press SPACE or tap to stop"}
          {timerState === TIMER_STATES.STOPPED && "Press SPACE or tap for next solve"}
        </div>

        <div
          className="timer-display"
          style={{ color: timerColor }}
        >
          {timerState === TIMER_STATES.INSPECTION
            ? inspectionLeft
            : displayTime}
        </div>

        {timerState === TIMER_STATES.STOPPED && latestSolve && (
          <div className="last-solve-info">
            <span>Solved!</span>
            {pbTime && latestSolve.time === pbTime && (
              <span className="new-pb-banner">🏆 New Session PB!</span>
            )}
          </div>
        )}
      </div>

      {sessionStats && (
        <div className="session-stats">
          <StatCard label="Best" value={sessionStats.best} highlight />
          <StatCard label="Worst" value={sessionStats.worst} />
          <StatCard label="Mean" value={sessionStats.avg} />
          <StatCard label="Ao5" value={sessionStats.ao5} />
          <StatCard label="Ao12" value={sessionStats.ao12} />
          <StatCard label="Count" value={sessionStats.count} isTime={false} />
        </div>
      )}

      {sessionSolves.length > 0 && (
        <div className="session-list">
          <div className="session-list-header">
            <h3>Session ({sessionSolves.length})</h3>
            <button className="btn-danger-sm" onClick={clearSession}>
              <FiTrash2 size={14} /> Clear
            </button>
          </div>
          <div className="session-solves">
            {sessionSolves.map((solve, i) => (
              <SolveCard
                key={`${solve.time}-${i}`}
                solve={solve}
                index={i}
                onDelete={() => removeSessionSolve(i)}
                isPB={sessionStats && solve.time === sessionStats.best}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
