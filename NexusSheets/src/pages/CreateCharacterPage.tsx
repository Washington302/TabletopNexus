import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CreateCharacterPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameId) return;
    import(`../games/${gameId}/game.json`).then((mod) => {
      setSchema(mod.default || mod);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [gameId]);

  const handleCreate = () => {
    if (!schema) return;
    const email = localStorage.getItem('nexus_auth_email');
    if (!email) {
      alert('You must be signed in to create a character.');
      return;
    }
    const id = 'char_' + Math.random().toString(36).substr(2, 9);
    // Build character data from schema, using defaults
    const data: any = {};
    for (const key in schema.characterSchema) {
      const field = schema.characterSchema[key];
      if (field && typeof field === 'object' && 'default' in field) {
        // Use the default value if present
        data[key] = JSON.parse(JSON.stringify(field.default));
      } else if (field && typeof field === 'object' && field.type === 'object') {
        data[key] = {};
      } else if (field && typeof field === 'object' && field.type === 'list') {
        data[key] = [];
      } else if (field && typeof field === 'object' && field.type === 'number') {
        data[key] = 0;
      } else if (field && typeof field === 'object' && field.type === 'string') {
        data[key] = '';
      } else {
        data[key] = '';
      }
    }
    const newChar = {
      id,
      name: 'New Character',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      game: gameId,
      data,
      owner: email,
    };
    const chars = JSON.parse(localStorage.getItem(`nexus_chars_${email}`) || '[]');
    chars.push(newChar);
    localStorage.setItem(`nexus_chars_${email}`, JSON.stringify(chars));
    // Try to create on backend as well
    import('../utils/api').then(({ default: api }) => {
      api.createCharacter(newChar).catch(() => {
        // ignore backend failure and continue with local storage
      });
    }).catch(() => {});
+
+
+    navigate(`/character/${gameId}?charId=${id}`);
  };

  if (loading) return <div style={{ color: 'var(--color-text-main)', textAlign: 'center', marginTop: 40 }}>Loading game schema...</div>;
  if (!schema) return <div style={{ color: 'var(--color-error, #e57373)', textAlign: 'center', marginTop: 40 }}>Game not found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: '3rem auto', padding: '2rem', background: 'var(--color-bg-dark)', borderRadius: 16, color: 'var(--color-text-main)', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}>
      <h1 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: 24, color: 'var(--color-primary)' }}>Create Character</h1>
      <p style={{ marginBottom: 24 }}>This will create a new character for <strong>{gameId}</strong> with an empty sheet based on the game schema.</p>
      <button onClick={handleCreate} style={{ width: '100%', padding: '0.7em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>
        Create Character
      </button>
    </div>
  );
};

export default CreateCharacterPage;
