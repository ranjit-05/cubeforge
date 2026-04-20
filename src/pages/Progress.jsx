import { useState, useMemo } from "react";
import { useTimerContext } from "../context/TimerContext";
import StatCard from "../components/StatCard";
import SolveCard from "../components/SolveCard";
import { formatTime } from "../hooks/useTimer";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar,
} from "recharts";
import { MdTrendingDown, MdEmojiEvents, MdDelete } from "react-icons/md";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">{payload[0].value?.toFixed(2)}s</p>
      </div>
    );
  }
  return null;
};

const Progress = () => {
  const { solves, stats, solvesLoading: loading, removeSolve } = useTimerContext();
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState(50);

  const chartData = useMemo(() => {
    return [...solves]
      .slice(0, timeRange)
      .reverse()
      .map((s, i) => ({
        index: i + 1,
        time: +(s.time / 1000).toFixed(2),
        label: `#${i + 1}`,
      }));
  }, [solves, timeRange]);

  const pbLine = stats?.pb ? +(stats.pb / 1000).toFixed(2) : null;

  const distribution = useMemo(() => {
    if (!solves.length) return [];
    const buckets = {};
    solves.forEach((s) => {
      const bucket = Math.floor(s.time / 5000) * 5;
      const label = `${bucket}s`;
      buckets[label] = (buckets[label] || 0) + 1;
    });
    return Object.entries(buckets)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([label, count]) => ({ label, count }));
  }, [solves]);

  if (loading) {
    return (
      <div className="page">
        <div className="loading-row">Loading your progress...</div>
      </div>
    );
  }

  return (
    <div className="page progress-page">
      <div className="page-header">
        <h1>My Progress</h1>
        <p>{stats?.total || 0} lifetime solves tracked</p>
      </div>

      <section className="dashboard-section">
        <h2 className="section-title">All-time Stats</h2>
        <div className="stats-grid">
          <StatCard label="Personal Best" value={stats?.pb} highlight />
          <StatCard label="Overall Average" value={stats?.avg} />
          <StatCard label="Best Ao5" value={stats?.ao5} />
          <StatCard label="Best Ao12" value={stats?.ao12} />
          <StatCard label="Total Solves" value={stats?.total} isTime={false} />
        </div>
      </section>

      {solves.length > 1 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Time Trend</h2>
            <div className="chart-controls">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(Number(e.target.value))}
                className="setting-select"
              >
                <option value={20}>Last 20</option>
                <option value={50}>Last 50</option>
                <option value={100}>Last 100</option>
              </select>
              <div className="pill-group">
                {["line", "area", "bar"].map((t) => (
                  <button
                    key={t}
                    className={`pill ${chartType === t ? "active" : ""}`}
                    onClick={() => setChartType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={280}>
              {chartType === "bar" ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3a" />
                  <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} unit="s" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="time" fill="#22d3ee" radius={[3, 3, 0, 0]} />
                </BarChart>
              ) : chartType === "area" ? (
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="timeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3a" />
                  <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} unit="s" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="time" stroke="#22d3ee" fill="url(#timeGrad)" strokeWidth={2} />
                </AreaChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3a" />
                  <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} unit="s" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="time"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "#22d3ee" }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {distribution.length > 0 && (
        <section className="dashboard-section">
          <h2 className="section-title">Solve Distribution</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3a" />
                <XAxis dataKey="label" stroke="#6b7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#a78bfa" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      <section className="dashboard-section">
        <h2 className="section-title">Solve History</h2>

        {solves.length === 0 ? (
          <div className="empty-state">
            <MdTrendingDown size={40} opacity={0.3} />
            <p>No solves yet. Head to the Timer to start!</p>
          </div>
        ) : (
          <div className="solves-list">
            {solves.map((solve, i) => (
              <SolveCard
                key={solve.id}
                solve={solve}
                index={i}
                onDelete={removeSolve}
                isPB={stats && solve.time === stats.pb}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Progress;
