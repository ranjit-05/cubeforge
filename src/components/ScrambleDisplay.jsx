import { MdRefresh, MdContentCopy } from "react-icons/md";
import { useState } from "react";

const MOVE_COLORS = {
  R: "#ef4444", L: "#f97316",
  U: "#ffffff", D: "#facc15",
  F: "#22c55e", B: "#3b82f6",
};

const getMoveColor = (move) => {
  const face = move[0];
  return MOVE_COLORS[face] || "#94a3b8";
};

const ScrambleDisplay = ({ scramble, moves, onNewScramble }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scramble);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="scramble-display">
      <div className="scramble-header">
        <span className="scramble-label">SCRAMBLE</span>
        <div className="scramble-actions">
          <button onClick={handleCopy} className="btn-icon" title="Copy scramble">
            <MdContentCopy size={14} />
            {copied && <span className="copied-toast">Copied!</span>}
          </button>
          <button onClick={onNewScramble} className="btn-icon" title="New scramble">
            <MdRefresh size={14} />
          </button>
        </div>
      </div>

      <div className="scramble-moves">
        {moves.map((move, index) => (
          <span
            key={`${index}-${move}`}
            className="scramble-move"
            style={{ color: getMoveColor(move) }}
          >
            {move}
          </span>
        ))}
      </div>

      <div className="scramble-meta">
        <span>{moves.length} moves</span>
      </div>
    </div>
  );
};

export default ScrambleDisplay;
