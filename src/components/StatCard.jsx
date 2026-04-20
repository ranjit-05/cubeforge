import { formatTime } from "../hooks/useTimer";

const StatCard = ({ label, value, isTime = true, highlight = false, sub = null }) => {
  const displayValue = (() => {
    if (value === null || value === undefined) return "–";
    if (isTime) return formatTime(value);
    if (typeof value === "number") return value.toLocaleString();
    return value;
  })();

  return (
    <div className={`stat-card ${highlight ? "stat-highlight" : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{displayValue}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
};

export default StatCard;
