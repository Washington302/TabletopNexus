import React from "react";
import { Link } from "react-router-dom";

const games = [
  { name: "Godbound", path: "/character/godbound" },
  { name: "Ars Magica", path: "/character/ars-magica" }
];

const GamesPage: React.FC = () => (
  <div style={{ maxWidth: 700, margin: '2rem auto', padding: '2rem', background: 'var(--color-bg-dark)', borderRadius: 16, boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)', color: 'var(--color-text-main)' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16, color: 'var(--color-primary)' }}>Supported Games</h1>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {games.map(game => (
        <li key={game.name} style={{ marginBottom: 16 }}>
          <Link to={game.path} style={{ color: 'var(--color-text-link)', fontWeight: 600, fontSize: '1.2rem', textDecoration: 'none' }}>{game.name}</Link>
        </li>
      ))}
    </ul>
    <div style={{ marginTop: 32, color: 'var(--color-text-muted)', fontSize: '1rem' }}>
      <p>More games coming soon!</p>
    </div>
  </div>
);

export default GamesPage;
