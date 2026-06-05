import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const { register, updateUserProfile, googleLogin, hasFirebase } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const v = {
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    len: form.password.length >= 6,
  };
  const pwOk = v.upper && v.lower && v.len;

  const submit = async (e) => {
    e.preventDefault();
    if (!pwOk) { toast.error("Password does not meet requirements"); return; }
    setBusy(true);
    try {
      await register(form.email, form.password);
      await updateUserProfile(form.name, form.photoURL);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.code === "auth/email-already-in-use" ? "Email already registered" : err.message || "Registration failed");
    } finally { setBusy(false); }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      toast.success("Account created!");
      navigate("/");
    } catch (err) { toast.error(err.message || "Google signup failed"); }
  };

  const VItem = ({ ok, text }) => (
    <li className={ok ? "v-ok" : "v-no"}>{ok ? "✓" : "✗"} {text}</li>
  );

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-brand"><span className="logo-mark">D</span><span>DriveFleet</span></Link>
        <h2 className="auth-tagline">Join thousands of drivers.</h2>
        <p className="auth-tagline-sub">Create an account to book cars or list your own vehicle and start earning.</p>
        <img src="https://images.unsplash.com/photo-1617814076229-45bf0d36cc05?w=560&q=80" alt="car" className="auth-img" onError={e => e.target.style.display="none"} />
      </div>
      <div className="auth-right">
        <div className="auth-box">
          <h1 className="auth-title">Create Account</h1>
          {!hasFirebase && <div className="demo-banner">⚡ Demo Mode — Firebase not configured yet</div>}
          <button className="google-btn" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.7 0 6.7 5.4 2.8 13.3l7.8 6C12.4 13.2 17.8 9.5 24 9.5z"/><path fill="#34A853" d="M46.9 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.9c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.3-10 7.3-17z"/><path fill="#4A90D9" d="M10.6 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l8-6.1z"/><path fill="#FBBC05" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.9l-8 6.1C6.7 42.6 14.7 48 24 48z"/></svg>
            {hasFirebase ? "Sign up with Google" : "Demo Google Signup"}
          </button>
          <div className="divider"><span>or register with email</span></div>
          <form onSubmit={submit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="form-input" placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label className="form-label">Photo URL (optional)</label>
              <input type="url" value={form.photoURL} onChange={e => setForm({...form, photoURL: e.target.value})} className="form-input" placeholder="https://i.ibb.co/your-photo" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="pw-wrap">
                <input type={showPw ? "text" : "password"} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="form-input" placeholder="Create a strong password" required />
                <button type="button" className="pw-eye" onClick={() => setShowPw(s => !s)}>{showPw ? "🙈" : "👁"}</button>
              </div>
              {form.password && (
                <ul className="pw-rules">
                  <VItem ok={v.upper} text="Uppercase letter" />
                  <VItem ok={v.lower} text="Lowercase letter" />
                  <VItem ok={v.len} text="At least 6 characters" />
                </ul>
              )}
            </div>
            <button type="submit" className="btn-primary btn-block" disabled={busy || !pwOk}>{busy ? "Creating…" : "Create Account"}</button>
          </form>
          <p className="auth-switch">Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};
export default Register;
