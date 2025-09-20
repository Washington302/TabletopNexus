import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const games = [
  { id: "godbound", name: "Godbound" },
  { id: "ars-magica", name: "Ars Magica" }
];

const ChooseGamePage: React.FC = () => {
  const [selected, setSelected] = useState<string>("");
  const navigate = useNavigate();

  const handleChoose = () => {
    if (!selected) return;
    navigate(`/create-character/${selected}`);
  };

  return (
    <div style={{ maxWidth: 500, margin: '3rem auto', padding: '2rem', background: 'var(--color-bg-dark)', borderRadius: 16, color: 'var(--color-text-main)', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
      <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: 24, color: 'var(--color-primary)' }}>Choose Game</h1>
      <div style={{ marginBottom: 24 }}>
        <select value={selected} onChange={e => setSelected(e.target.value)} style={{ width: '100%', padding: '0.7em', borderRadius: 6, fontSize: '1.1rem' }}>
          <option value="">Select a game...</option>
          {games.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>
      <button onClick={handleChoose} disabled={!selected} style={{ width: '100%', padding: '0.7em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1.1rem', cursor: selected ? 'pointer' : 'not-allowed' }}>
        Next
      </button>
    </div>
  );
};

export default ChooseGamePage;
