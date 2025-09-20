import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useCookies, setUseCookies] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    try {
      if (isSignIn) {
        await api.login({ credFieldOne: email, credFieldTwo: password }, useCookies);
      } else {
        await api.register({ username: email, password, email }, useCookies);
      }
      localStorage.setItem('nexus_auth_email', email);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: '3rem auto',
      padding: '2rem',
      background: 'var(--color-bg-dark)',
      borderRadius: 16,
      boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
      color: 'var(--color-text-main)'
    }}>
      <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: 24, color: 'var(--color-primary)' }}>
        {isSignIn ? 'Sign In' : 'Create Account'}
      </h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 6 }}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5em', borderRadius: 6, border: '1px solid var(--color-bg-mid)', background: 'var(--color-bg-mid)', color: 'var(--color-text-main)' }}
            autoComplete="email"
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 6 }}>Password</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ flex: 1, padding: '0.5em', borderRadius: 6, border: '1px solid var(--color-bg-mid)', background: 'var(--color-bg-mid)', color: 'var(--color-text-main)' }}
              autoComplete={isSignIn ? "current-password" : "new-password"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-link)',
                cursor: 'pointer',
                fontSize: '1.3rem',
                padding: '0 0.5em',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        {error && <div style={{ color: 'var(--color-error, #e57373)', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: '0.7em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1.1rem', marginBottom: 12 }}>
          {isSignIn ? 'Sign In' : 'Create Account'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <input type="checkbox" checked={useCookies} onChange={e => setUseCookies(e.target.checked)} />
          {' '}Use cookies for auth (backend will set cookie)
        </label>
        <button
          style={{ background: 'none', border: 'none', color: 'var(--color-text-link)', cursor: 'pointer', textDecoration: 'underline', fontSize: '1rem' }}
          onClick={() => { setIsSignIn(v => !v); setError(""); }}
        >
          {isSignIn ? "Don't have an account? Create one" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
