import { MdDelete, MdFlag } from "react-icons/md";
import { formatTime } from "../hooks/useTimer";

const SolveCard = ({ solve, index, onDelete, isPB = false }) => {
  const date = solve.createdAt?.toDate
    ? solve.createdAt.toDate().toLocaleTimeString()
    : new Date().toLocaleTimeString();

  return (
    <div className={`solve-card ${isPB ? "solve-pb" : ""}`}>
      <div className="solve-index">#{index + 1}</div>
      <div className="solve-time">{formatTime(solve.time)}</div>
      <div className="solve-meta">
        <span className="solve-date">{date}</span>
        {isPB && (
          <span className="pb-badge">
            <MdFlag size={10} /> PB
          </span>
        )}
      </div>
      <button
        onClick={() => onDelete(solve.id)}
        className="btn-icon btn-danger"
        title="Delete solve"
      >
        <MdDelete size={13} />
      </button>
    </div>
  );
};

export default SolveCard;
