import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTimerContext } from "../context/TimerContext";
import StatCard from "../components/StatCard";
import CubeViewer from "../components/CubeViewer";
import { MdEmojiEvents, MdTrendingUp } from "react-icons/md";
import { formatTime } from "../hooks/useTimer";


const MiniCubeFace = ({ colors, size = 40 }) => (
  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2, padding:3,
    background:"#111", borderRadius:6, border:"2px solid #2e2e3e", width:size, height:size, flexShrink:0 }}>
    {colors.map((c,i)=>(
      <div key={i} style={{background:c, borderRadius:2, border:"1px solid rgba(0,0,0,0.3)"}}/>
    ))}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { solves, stats, solvesLoading: loading } = useTimerContext();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h<12?"Good morning":h<18?"Good afternoon":"Good evening";
  }, []);

  const recentSolves = useMemo(() => solves.slice(0,5), [solves]);
  const pbTime = stats?.pb ? formatTime(stats.pb) : null;

  const heroFace = ["#BA0C2F","#FFD500","#0051A2","#009B48","#FF5800","#F0EFE0","#FFD500","#0051A2","#BA0C2F"];

  return (
    <div className="page dashboard-page">

      <div className="dashboard-hero">
        <div className="hero-text">
          <div className="hero-eyebrow">{greeting}</div>
          <div className="hero-name">{user?.displayName || "Cuber"} 👋</div>
          <div className="hero-sub">
            {stats ? `${stats.total} solves logged` : "No solves yet — let's fix that!"}
          </div>
          {pbTime && (
            <div className="hero-pb">
              <MdEmojiEvents size={18} color="#FFD500"/>
              Personal Best: <strong>{pbTime}</strong>
            </div>
          )}
          <div style={{marginTop:20,display:"flex",gap:10,flexWrap:"wrap"}}>
            <Link to="/timer" className="btn-primary">Start Timer →</Link>
            <Link to="/training" className="btn-outline">View Training</Link>
          </div>
        </div>
        <div className="hero-cube-widget">
          <div className="hero-cube-live">
            <CubeViewer alg="R U R' U'" controlPanel="none" hintFacelets="none" style={{height:160,width:160}}/>
          </div>
          <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:8}}>
            {["#BA0C2F","#FFD500","#009B48","#0051A2","#FF5800","#F0EFE0"].map(c=>(
              <div key={c} style={{width:14,height:14,borderRadius:3,background:c,border:"1.5px solid rgba(0,0,0,0.4)"}}/>
            ))}
          </div>
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-label">Your statistics</div>
        <div className="stats-grid">
          <StatCard label="Personal Best" value={stats?.pb} highlight/>
          <StatCard label="Average" value={stats?.avg}/>
          <StatCard label="Ao5" value={stats?.ao5}/>
          <StatCard label="Ao12" value={stats?.ao12}/>
          <StatCard label="Total Solves" value={stats?.total} isTime={false}/>
        </div>
      </section>


      <section className="dashboard-section">
        <div className="section-header">
          <div className="section-label" style={{margin:0}}>Recent solves</div>
          <Link to="/progress" className="see-all">See all →</Link>
        </div>

        {loading ? (
          <div className="loading-row">Loading solves...</div>
        ) : recentSolves.length === 0 ? (
          <div className="empty-state">
            <MiniCubeFace colors={["#BA0C2F","#FFD500","#0051A2","#009B48","#FF5800","#F0EFE0","#FFD500","#0051A2","#BA0C2F"]} size={64}/>
            <p>No solves yet. <Link to="/timer">Start the timer!</Link></p>
          </div>
        ) : (
          <div className="recent-solves-table">
            <div className="table-header">
              <span>#</span><span>Time</span><span>Date</span><span>Scramble</span>
            </div>
            {recentSolves.map((solve,i)=>{
              const isPB = stats && solve.time===stats.pb;
              return (
                <div key={solve.id} className={`table-row ${isPB?"row-pb":""}`}>
                  <span className="row-index">#{i+1}</span>
                  <span className="row-time" style={{color:isPB?"#FFD500":undefined}}>
                    {formatTime(solve.time)}{isPB&&<span className="inline-pb">PB</span>}
                  </span>
                  <span className="row-date">{solve.createdAt?.toDate?solve.createdAt.toDate().toLocaleDateString():"–"}</span>
                  <span className="row-scramble">{solve.scramble||"–"}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="tip-banner">
        <MdTrendingUp size={18} color="#5ba3f5"/>
        <strong>Pro Tip:</strong> Practice F2L intuitively — don't memorize cases, understand them. Aim for fluid pair-building.
      </div>
    </div>
  );
};
export default Dashboard;
