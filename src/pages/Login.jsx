import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdEmail, MdLock, MdWarning } from "react-icons/md";

const FACE_TILES = [
  "#BA0C2F","#BA0C2F","#BA0C2F",
  "#BA0C2F","#BA0C2F","#BA0C2F",
  "#BA0C2F","#BA0C2F","#BA0C2F",
];
const LOGO_TILES = ["#BA0C2F","#FFD500","#0051A2","#009B48","#FF5800","#F0EFE0","#FFD500","#0051A2","#BA0C2F"];

const BigCubeFace = ({ tiles, size = 72 }) => (
  <div style={{ display:"grid", gridTemplateColumns:`repeat(3, ${size}px)`, gap:6, padding:8, background:"#111", borderRadius:12, border:"3px solid #333" }}>
    {tiles.map((c, i) => (
      <div key={i} style={{ width:size, height:size, background:c, borderRadius:7, border:"2px solid rgba(0,0,0,0.4)", boxShadow:"inset 0 2px 5px rgba(255,255,255,0.12)" }} />
    ))}
  </div>
);

const SCRAMBLE_FACE = ["#BA0C2F","#FFD500","#009B48","#0051A2","#FF5800","#BA0C2F","#F0EFE0","#009B48","#FFD500"];
const SCRAMBLE_FACE2 = ["#009B48","#BA0C2F","#FFD500","#FF5800","#F0EFE0","#0051A2","#FFD500","#009B48","#BA0C2F"];
const SCRAMBLE_FACE3 = ["#FFD500","#0051A2","#FF5800","#009B48","#BA0C2F","#FFD500","#0051A2","#F0EFE0","#009B48"];

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try { await login(email, password); navigate("/dashboard"); }
    catch (err) { setError(err.code === "auth/invalid-credential" ? "Invalid email or password" : err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ display:"flex", gap:12, marginBottom:32, animation:"float 3s ease-in-out infinite" }}>
          <BigCubeFace tiles={SCRAMBLE_FACE} size={60} />
          <BigCubeFace tiles={SCRAMBLE_FACE2} size={60} />
        </div>
        <h1 className="auth-left-h1" style={{fontFamily:"'Nunito',sans-serif", fontSize:38, fontWeight:900, color:"#f0f0f8", marginBottom:8}}>
          Cube<em style={{fontStyle:"normal", color:"#FFD500"}}>rick</em>
        </h1>
        <p style={{color:"#909090", fontSize:15, textAlign:"center", maxWidth:280, marginBottom:32}}>
          Track your solves, learn algorithms, and master the cube.
        </p>
        <div className="auth-left-features">
          {[
            {color:"#BA0C2F", text:"WCA-standard solve timer"},
            {color:"#FFD500", text:"30+ OLL, PLL, F2L algorithms"},
            {color:"#009B48", text:"Progress charts & analytics"},
            {color:"#0051A2", text:"Guided training modules"},
          ].map(f => (
            <div key={f.text} className="auth-feature">
              <div className="auth-feature-dot" style={{background:f.color}} />
              {f.text}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-brand-face">
              {LOGO_TILES.map((c,i) => <span key={i} style={{background:c}} />)}
            </div>
            <h2><em>Cube</em>rick</h2>
          </div>
          <h3>Welcome back</h3>
          <p>Sign in to continue training</p>

          {error && <div className="auth-error"><MdWarning size={16}/><span>{error}</span></div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrap">
                <MdEmail className="input-icon" size={16}/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" required autoComplete="email"/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <MdLock className="input-icon" size={16}/>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password"/>
              </div>
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <span className="btn-spinner"/> : "Sign In →"}
            </button>
          </form>
          <p className="auth-switch">No account? <Link to="/register">Create one free</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Login;
