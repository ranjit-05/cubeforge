import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdEmail, MdLock, MdPerson, MdWarning, MdCheckCircle } from "react-icons/md";

const LOGO_TILES = ["#BA0C2F","#FFD500","#0051A2","#009B48","#FF5800","#F0EFE0","#FFD500","#0051A2","#BA0C2F"];
const SOLVED_FACE = Array(9).fill("#009B48");
const SCRAMBLE_1 = ["#009B48","#BA0C2F","#FFD500","#FF5800","#F0EFE0","#0051A2","#FFD500","#009B48","#BA0C2F"];
const SCRAMBLE_2 = ["#FFD500","#0051A2","#FF5800","#009B48","#BA0C2F","#FFD500","#0051A2","#F0EFE0","#009B48"];

const BigCubeFace = ({ tiles, size = 60 }) => (
  <div style={{display:"grid",gridTemplateColumns:`repeat(3,${size}px)`,gap:5,padding:6,background:"#111",borderRadius:10,border:"2.5px solid #333"}}>
    {tiles.map((c,i)=>(<div key={i} style={{width:size,height:size,background:c,borderRadius:6,border:"2px solid rgba(0,0,0,0.4)",boxShadow:"inset 0 2px 5px rgba(255,255,255,0.12)"}}/>))}
  </div>
);

const Register = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);

  const strength = (() => {
    if (!password) return 0; let s = 0;
    if (password.length >= 8) s++; if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++; if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ["","Weak","Fair","Strong","Very Strong"][strength];
  const strengthColor = ["","#BA0C2F","#FF5800","#009B48","#FFD500"][strength];

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (password !== confirm) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try { await register(email, password, displayName); navigate("/dashboard"); }
    catch (err) { setError(err.code === "auth/email-already-in-use" ? "Email already in use" : err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{display:"flex",gap:12,marginBottom:28,animation:"float 3s ease-in-out infinite"}}>
          <BigCubeFace tiles={SOLVED_FACE} size={60}/>
          <BigCubeFace tiles={SCRAMBLE_1} size={60}/>
          <BigCubeFace tiles={SCRAMBLE_2} size={60}/>
        </div>
        <h1 style={{fontFamily:"'Nunito',sans-serif",fontSize:34,fontWeight:900,color:"#f0f0f8",marginBottom:8}}>
          Start Your Journey
        </h1>
        <p style={{color:"#909090",fontSize:15,textAlign:"center",maxWidth:280,marginBottom:28}}>
          Join thousands of cubers improving their times with Cuberick.
        </p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4,padding:6,background:"#111",borderRadius:10,border:"2px solid #333",width:120}}>
          {["#BA0C2F","#FFD500","#0051A2","#009B48","#FF5800","#F0EFE0","#FFD500","#0051A2","#BA0C2F"].map((c,i)=>(
            <div key={i} style={{height:28,background:c,borderRadius:3,border:"1px solid rgba(0,0,0,0.3)"}}/>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-brand-face">
              {LOGO_TILES.map((c,i)=><span key={i} style={{background:c}}/>)}
            </div>
            <h2><em>Cube</em>rick</h2>
          </div>
          <h3>Create account</h3>
          <p>Free forever — no credit card needed</p>

          {error && <div className="auth-error"><MdWarning size={16}/><span>{error}</span></div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <div className="input-wrap">
                <MdPerson className="input-icon" size={16}/>
                <input type="text" value={displayName} onChange={e=>setDisplayName(e.target.value)} placeholder="SpeedCuber99" required/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrap">
                <MdEmail className="input-icon" size={16}/>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com" required/>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <MdLock className="input-icon" size={16}/>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/>
              </div>
              {password && (
                <div className="password-strength" style={{marginTop:8}}>
                  <div className="strength-bar">
                    {[1,2,3,4].map(n=>(<div key={n} className="strength-segment" style={{background:n<=strength?strengthColor:"#2e2e3e"}}/>))}
                  </div>
                  <span style={{color:strengthColor}}>{strengthLabel}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap">
                <MdLock className="input-icon" size={16}/>
                <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="••••••••" required/>
                {confirm && confirm===password && <MdCheckCircle className="input-check" size={18} style={{color:"#4CAF50"}}/>}
              </div>
            </div>
            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? <span className="btn-spinner"/> : "Create Account →"}
            </button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Register;
