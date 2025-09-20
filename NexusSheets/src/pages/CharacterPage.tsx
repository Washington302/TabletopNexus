
import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, Suspense, useRef } from "react";
import DynamicCharacterSheet from "../components/DynamicCharacterSheet";
import type { GameDefinition, UIDefinition } from "../types/game";


export default function CharacterPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const location = useLocation();
  const [gameDef, setGameDef] = useState<GameDefinition | null>(null);
  const [uiDef, setUiDef] = useState<UIDefinition | null>(null);
  const [CustomSheet, setCustomSheet] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [charData, setCharData] = useState<any>(null);
  const [charId, setCharId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const sheetRef = useRef<any>(null);

  // Get charId from query string and always reload character data when charId changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cid = params.get("charId");
    setCharId(cid);
    if (!gameId) return;
    // Dynamic import for game and ui json
    Promise.all([
      import(`../games/${gameId}/game.json`),
      import(`../games/${gameId}/ui.json`)
    ])
      .then(async ([game, ui]) => {
        setGameDef(game as GameDefinition);
        setUiDef(ui as UIDefinition);
        setError(null);
        // Try to import custom sheet
        try {
          const sheetModule = await import(`../games/${gameId}/sheet.tsx`);
          setCustomSheet(() => sheetModule.default);
        } catch {
          setCustomSheet(null);
        }
      })
      .catch(() => {
        setError("Game not found or invalid game files.");
        setGameDef(null);
        setUiDef(null);
        setCustomSheet(null);
      });
  }, [gameId, location.search]);

  // Always reload character data from localStorage when charId changes
  useEffect(() => {
    const email = localStorage.getItem('nexus_auth_email');
    if (email && charId) {
      const chars = JSON.parse(localStorage.getItem(`nexus_chars_${email}`) || '[]');
      const found = chars.find((c: any) => c.id === charId);
      if (found) setCharData(found.data);
      else {
        // try backend
        import('../utils/api').then(({ default: api }) => {
          api.getCharacter(charId as string).then((res: any) => {
            setCharData(res.data || res);
          }).catch(() => setCharData(null));
        }).catch(() => setCharData(null));
      }
    } else {
      setCharData(null);
    }
  }, [charId]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (!gameDef || !uiDef) {
    return <div>Loading...</div>;
  }

  // Save handler
  const handleSave = () => {
    const email = localStorage.getItem('nexus_auth_email');
    if (!email) {
      setSaveStatus("Not signed in.");
      return;
    }
    const latestData = sheetRef.current?.getData ? sheetRef.current.getData() : charData;
    let chars = JSON.parse(localStorage.getItem(`nexus_chars_${email}`) || '[]');
    if (charId) {
      // Update existing character
      const idx = chars.findIndex((c: any) => c.id === charId);
      if (idx !== -1) {
        chars[idx].data = latestData;
        chars[idx].updated = new Date().toISOString();
        localStorage.setItem(`nexus_chars_${email}`, JSON.stringify(chars));
        setSaveStatus("Saved!");
        setTimeout(() => setSaveStatus(""), 1500);
      } else {
        setSaveStatus("Character not found.");
      }
    } else {
      // Create new character
      const newId = 'char_' + Math.random().toString(36).substr(2, 9);
      const newChar = {
        id: newId,
        name: 'New Character',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        game: gameId,
        data: latestData,
      };
      chars.push(newChar);
      localStorage.setItem(`nexus_chars_${email}`, JSON.stringify(chars));
      setCharId(newId);
      setSaveStatus("Character created and saved!");
      setTimeout(() => setSaveStatus(""), 1500);
      // Optionally update URL with new charId
      window.history.replaceState({}, '', `/character/${gameId}?charId=${newId}`);
    }
  };

  return (
    <div>
      {/* Save button outside main card */}
      <div style={{ maxWidth: 900, margin: '2rem auto 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          style={{ padding: '0.6em 1.5em', borderRadius: 6, background: 'var(--color-primary)', color: 'var(--color-bg-mid)', fontWeight: 700, border: 'none', fontSize: '1.1rem', cursor: 'pointer', marginRight: 8 }}
        >
          Save
        </button>
        {saveStatus && <span style={{ color: 'var(--color-success, #43a047)', alignSelf: 'center', fontWeight: 600 }}>{saveStatus}</span>}
      </div>
      {/* Main card */}
      {CustomSheet ? (
        <Suspense fallback={<div>Loading custom sheet...</div>}>
          <CustomSheet ref={sheetRef} gameDef={gameDef} uiDef={uiDef} data={charData} setData={setCharData} />
        </Suspense>
      ) : (
        <DynamicCharacterSheet ref={sheetRef} gameDef={gameDef} uiDef={uiDef} data={charData} setData={setCharData} />
      )}
    </div>
  );
}