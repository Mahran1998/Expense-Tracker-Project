import React, { useState } from "react";
import { login } from "../api";

export default function Login({ onLoggedIn, showToast }) {
  const [email, setEmail] = useState("manager@demo.local");
  const [password, setPassword] = useState("Demo123!");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      onLoggedIn(res.user);
      showToast("Logged in", "success");
    } catch (e) {
      showToast(e.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="card-title">Login</div>
      <form onSubmit={submit}>
        <div className="grid grid-2">
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>
        <div className="actions">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>
        <div className="muted" style={{ marginTop: 10, fontSize: 13 }}>
          Demo users: employee@demo.local / manager@demo.local / accountant@demo.local (password: Demo123!)
        </div>
      </form>
    </div>
  );
}
