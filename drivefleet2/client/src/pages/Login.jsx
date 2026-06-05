import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const { login, googleLogin, hasFirebase } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      const code = err?.code || "";
      toast.error(
        code.includes("invalid-credential") || code.includes("user-not-found") ? "Invalid email or password" :
        code.includes("wrong-password") ? "Wrong password" : err.message || "Login failed"
      );
    } finally { setBusy(false); }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Welcome!");
      navigate("/", { replace: true });
    } catch (err) { toast.error(err.message || "Google login failed"); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-brand"><span className="logo-mark">D</span><span>DriveFleet</span></Link>
        <h2 className="auth-tagline">Drive the future, today.</h2>
        <p className="auth-tagline-sub">Access your account to manage bookings and listings.</p>
        <img src="https://images.unsplash.com/photo-1542362567-b07e54358753?w=560&q=80" alt="car" className="auth-img" onError={e => e.target.style.display="none"} />
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h1 className="auth-title">Sign In</h1>
          {!hasFirebase && <div className="demo-banner">⚡ Demo Mode — any email &amp; password works</div>}
          <button className="google-btn" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.8 13.3l7.8 6C12.4 13.2 17.8 9.5 24 9.5z"/><path fill="#34A853" d="M46.9 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.9c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.3-10 7.3-17z"/><path fill="#4A90D9" d="M10.6 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l8-6.1z"/><path fill="#FBBC05" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.9l-8 6.1C6.7 42.6 14.7 48 24 48z"/></svg>
            {hasFirebase ? "Continue with Google" : "Demo Google Login"}
          </button>
          <div className="divider"><span>or sign in with email</span></div>
          <form onSubmit={submit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="form-input" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pw-wrap">
                <input type={showPw ? "text" : "password"} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="form-input" placeholder="Your password" required />
                <button type="button" className="pw-eye" onClick={() => setShowPw(s => !s)}>{showPw ? "🙈" : "👁"}</button>
              </div>
            </div>
            <button type="submit" className="btn-primary btn-block" disabled={busy}>{busy ? "Signing in…" : "Sign In"}</button>
          </form>
          <p className="auth-switch">Don't have an account? <Link to="/register" className="auth-link">Create one</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Login;
