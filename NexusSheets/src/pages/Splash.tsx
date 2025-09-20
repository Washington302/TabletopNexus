import React from "react";
import { Link } from "react-router-dom";

const Splash: React.FC = () => (
  <div style={{
    maxWidth: 700,
    margin: '2rem auto',
    padding: '2rem',
    background: 'var(--color-bg-dark)',
    borderRadius: 16,
    boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
    color: 'var(--color-text-main)'
  }}>
    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, color: 'var(--color-primary)' }}>NexusSheets</h1>
    <p style={{ marginBottom: 32, color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
      The all-in-one tabletop RPG character and campaign manager. Effortlessly track, edit, and manage your games and characters.
    </p>
    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: 16, justifyContent: 'center' }}>
      <Link to="/dashboard" style={{ color: 'var(--color-text-link)', fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', padding: '0.75rem 2rem', borderRadius: 8, background: 'var(--color-bg-mid)', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)' }}>
        Go to Account Dashboard
      </Link>
      <Link to="/games" style={{ color: 'var(--color-text-link)', fontWeight: 700, fontSize: '1.2rem', textDecoration: 'none', padding: '0.75rem 2rem', borderRadius: 8, background: 'var(--color-bg-mid)', boxShadow: '0 1px 4px 0 rgba(0,0,0,0.08)' }}>
        Explore Games
      </Link>
    </div>
    <div style={{ marginTop: 32, color: 'var(--color-text-muted)', fontSize: '1rem', textAlign: 'center' }}>
      <p>Sign in to access your saved characters and campaigns, or browse supported games to get started.</p>
    </div>
  </div>
);

export default Splash;
