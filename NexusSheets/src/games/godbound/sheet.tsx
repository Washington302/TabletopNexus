
// EquipmentNoteField: toggles between span and textarea for editing
type EquipmentNoteFieldProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

function EquipmentNoteField({ value, onChange, placeholder }: EquipmentNoteFieldProps) {
  const [editing, setEditing] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value);
  React.useEffect(() => { setInternalValue(value); }, [value]);
  return editing ? (
    <textarea
      value={internalValue}
      placeholder={placeholder}
      onChange={e => setInternalValue(e.target.value)}
      onBlur={() => { setEditing(false); onChange(internalValue); }}
      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { setEditing(false); onChange(internalValue); e.preventDefault(); } }}
      className="text-center"
  style={{ width: '100%', minHeight: 32, borderRadius: 4, padding: 4, marginBottom: 12 }}
      autoFocus
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
  style={{ cursor: "pointer", display: "inline-block", width: '100%', minHeight: 32, color: value ? undefined : '#888', fontStyle: value ? undefined : 'italic', border: '1px solid #444', borderRadius: 4, padding: 4, background: 'rgba(255,255,255,0.01)', whiteSpace: 'pre-line' }}
      className="text-center"
    >
      {value && value.trim() !== ""
        ? value.split('\n').map((line, idx, arr) => idx < arr.length - 1 ? [line, <br key={idx} />] : line)
        : (placeholder || "Click to add")}
    </span>
  );
}



import React from "react";
import EditableField from "../../components/EditableField";
import ListObjectField from "../../components/ListObjectField";
import type { GameDefinition, ObjectField } from "../../types/game";
import "./godbound.css";


type Word = { title: string; intrinsic: string };
type Gift = { title: string; actionCost: string; effortCost?: string; description: string };
type AttributeFields = { score: number; modifier: number; check: number };
type Props = {
  gameDef: GameDefinition;
  data: any;
  setData: (data: any) => void;
};

export default function GodboundSheet({ gameDef, data, setData }: Props) {
  // Collapsed state for Words section (UI only)
  const [wordsCollapsed, setWordsCollapsed] = React.useState(false);

  // Helper: get or set a field in data
  const get = (key: string, fallback: any) => (data && data[key] !== undefined ? data[key] : fallback);
  const set = (key: string, value: any) => setData({ ...data, [key]: value });

  // Defaults for new sheets
  const defaultWords: Word[] = [
    { title: "Sun", intrinsic: "Radiance: You are immune to harm from natural or magical light, heat, or fire." },
    { title: "Might", intrinsic: "Unbreakable: You cannot be physically restrained or bound by mundane means." },
    { title: "Endurance", intrinsic: "Tireless: You do not need to eat, drink, or sleep, and are immune to fatigue." }
  ];
  const defaultGifts: Gift[] = [
    { title: "Corona of Glory", actionCost: "On Turn", effortCost: "1", description: "You blaze with celestial radiance, blinding foes and inspiring allies." },
    { title: "Heavenly Stride", actionCost: "Instant", description: "You move instantly to any visible location within sight." }
  ];

  // Attribute schema helper
  function getInitialAttributes() {
    const attrSchema = gameDef.characterSchema.attributes as any;
    if (attrSchema && attrSchema.type === "object" && Array.isArray(attrSchema.fields)) {
      return Object.fromEntries(
        attrSchema.fields.map((f: any) => [f.name, { score: f.score ?? 10, modifier: f.modifier ?? 0, check: f.check ?? 0 }])
      );
    }
    return {};
  }

  // All fields now use data/setData
  const characterName = get("characterName", "");
  const level = get("level", 1);
  const attributes = get("attributes", getInitialAttributes());
  const savingThrows = get("savingThrows", (gameDef.characterSchema.savingThrows as ObjectField)?.default || {});
  const hitPoints = get("hitPoints", (gameDef.characterSchema.hitPoints as ObjectField)?.default || {});
  const combat = get("combat", (gameDef.characterSchema.combat as ObjectField)?.default || {});
  const resources = get("resources", (gameDef.characterSchema.resources as ObjectField)?.default || {});
  const facts = get("facts", Array.isArray((gameDef.characterSchema.facts as any)?.default) ? (gameDef.characterSchema.facts as any).default : []);
  const career = get("career", (gameDef.characterSchema.career as ObjectField)?.default || {});
  const words = get("words", defaultWords);
  const gifts = get("gifts", defaultGifts);
  const equipment = get("equipment", Array.isArray((gameDef.characterSchema.equipment as any)?.default) ? (gameDef.characterSchema.equipment as any).default : []);
  const notes = get("notes", Array.isArray((gameDef.characterSchema.notes as any)?.default) ? (gameDef.characterSchema.notes as any).default : []);

  return (

    <div 
      className="sheet-container"
      style={{ 
        minHeight: '85vh',
        width: '85vw',
        maxWidth: '1200px',
        margin: '2rem auto 0 auto',
        padding: '1rem 2rem',
        boxSizing: 'border-box',
        overflow: 'auto',
        fontSize: '0.95rem',
        lineHeight: 1.3,
        borderRadius: '1.5rem',
        background: '#23272f',
        color: '#f3f4f6',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)'
      }}
    >
      {/* Header */}
      <div className="sheet-header">
        <h2
          className="text-2xl font-bold text-center"
          style={{ margin: '0.5rem auto', minHeight: '2.5rem' }}
        >
          <EditableField
            value={characterName}
            onChange={val => set("characterName", String(val))}
            placeholder="Character Name"
            className="inline-block w-60 p-2 rounded text-2xl font-bold text-center"
            style={{ display: 'block', margin: '0 auto' }}
            minWidth="12rem"
            maxWidth="20rem"
          />
        </h2>
        <p>
          <strong>Level:</strong> <EditableField
            value={level}
            onChange={val => set("level", Number(val) || 1)}
            type="number"
            minWidth="3rem"
            maxWidth="3rem"
            className="inline-block w-12 rounded text-center"
            inputProps={{ min: 1, style: { padding: '0.1rem 0.2rem', fontSize: '1rem' } }}
          />
          {" | "}
          <strong>Dominion:</strong> {resources["Dominion"] ?? 0}
          {" | "}
          <strong>Effort:</strong> {resources["Effort"] ?? 0}
          {" | "}
          <strong>Effort Committed:</strong> {resources["Effort Committed"] ?? 0}
        </p>
      </div>

      {/* Attributes & Resources side by side */}
      <div className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Attributes (left) */}
          <div>
            <h2 className="section-title">Attributes</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Attribute</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Score</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Modifier</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Check</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(attributes).map(([name, fields]) => {
                  const f = fields as AttributeFields;
                  return (
                    <tr key={name}>
                      <td style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', padding: '0.5rem' }}>{name}</td>
                      <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                        <EditableField
                          value={f.score}
                          onChange={val => set("attributes", { ...attributes, [name]: { ...f, score: Number(val) } })}
                          type="number"
                          minWidth="3.5rem"
                          maxWidth="3.5rem"
                          className="text-center"
                        />
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                        <EditableField
                          value={f.modifier}
                          onChange={val => set("attributes", { ...attributes, [name]: { ...f, modifier: Number(val) } })}
                          type="number"
                          minWidth="3.5rem"
                          maxWidth="3.5rem"
                          className="text-center"
                        />
                      </td>
                      <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                        <EditableField
                          value={f.check}
                          onChange={val => set("attributes", { ...attributes, [name]: { ...f, check: Number(val) } })}
                          type="number"
                          minWidth="3.5rem"
                          maxWidth="3.5rem"
                          className="text-center"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Resources (right) */}
          <div>
            <h2 className="section-title">Resources</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Resource</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(resources).map(([name, value]) => (
                  <tr key={name}>
                    <td style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', padding: '0.5rem' }}>{name}</td>
                    <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                      <EditableField
                        value={value as number}
                        onChange={val => set("resources", { ...resources, [name]: Number(val) })}
                        type="number"
                        minWidth="3.5rem"
                        maxWidth="3.5rem"
                        className="text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Saving Throws + Hit Points & Combat side by side (as tables) */}
      <div className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Saving Throws (left, as table) */}
          <div>
            <h2 className="section-title">Saving Throws</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Save</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(savingThrows).map(([name, value]) => (
                  <tr key={name}>
                    <td style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', padding: '0.5rem' }}>{name}</td>
                    <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                      <EditableField
                        value={value as number}
                        onChange={val => set("savingThrows", { ...savingThrows, [name]: Number(val) })}
                        type="number"
                        minWidth="3.5rem"
                        maxWidth="3.5rem"
                        className="text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Hit Points (single line, current/max) & Combat (table) */}
          <div>
            <h2 className="section-title">Hit Points & Combat</h2>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>Hit Points:</span>
              <EditableField
                value={hitPoints.current ?? 0}
                onChange={val => {
                  let newValue = hitPoints.current ?? 0;
                  if (typeof val === 'string') {
                    const trimmed = val.trim();
                    if (/^[-+][0-9]+$/.test(trimmed)) {
                      newValue = Number(hitPoints.current ?? 0) + Number(trimmed);
                    } else if (/^[0-9]+$/.test(trimmed)) {
                      newValue = Number(trimmed);
                    } else {
                      try {
                        if (/^[0-9+\-*/ ().]+$/.test(trimmed)) {
                          // eslint-disable-next-line no-eval
                          newValue = eval(trimmed);
                        }
                      } catch {}
                    }
                  } else if (typeof val === 'number' && !isNaN(val)) {
                    newValue = val;
                  }
                  set("hitPoints", { ...hitPoints, current: newValue });
                }}
                type="text"
                minWidth="3.5rem"
                maxWidth="3.5rem"
                className="text-center"
                inputProps={{ pattern: '[-+*/ 0-9.()]*' }}
              />
              <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>/</span>
              <EditableField
                value={hitPoints.max ?? 0}
                onChange={val => set("hitPoints", { ...hitPoints, max: Number(val) })}
                type="number"
                minWidth="3.5rem"
                maxWidth="3.5rem"
                className="text-center"
              />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Stat</th>
                  <th style={{ textAlign: 'center', padding: '0.5rem', fontWeight: 600, fontSize: '0.95rem' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(combat).map(([name, value]) => (
                  <tr key={name}>
                    <td style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', padding: '0.5rem' }}>{name}</td>
                    <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                      <EditableField
                        value={value as number | string}
                        onChange={val => set("combat", { ...combat, [name]: typeof value === 'number' ? Number(val) : val })}
                        type={typeof value === 'number' ? 'number' : 'text'}
                        minWidth="3.5rem"
                        maxWidth="3.5rem"
                        className="text-center"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Career & Facts */}
      <div className="section">
        <ListObjectField
          label="Career"
          items={(() => {
            const keys = Object.keys(career);
            if (keys.length === 0) {
              return [
                "Sample Past",
                "Sample Origin",
                "Sample Relationships"
              ];
            }
            return Object.values(career);
          })()}
          onChange={vals => {
            let keys = Object.keys(career);
            if (keys.length === 0) {
              keys = ["Past", "Origin", "Relationships"];
            }
            const updated: { [k: string]: string } = {};
            keys.forEach((k, i) => { updated[k] = vals[i] ?? ""; });
            set("career", updated);
          }}
          minWidth="8rem"
          maxWidth="12rem"
          addLabel=""
          itemLabel={i => {
            const keys = Object.keys(career);
            if (keys.length === 0) {
              return ["Past", "Origin", "Relationships"][i] || "Career";
            }
            return keys[i] || "Career";
          }}
        />
        <ListObjectField
          label="Facts"
          items={facts}
          onChange={vals => set("facts", vals)}
          minWidth="8rem"
          maxWidth="12rem"
          className="mb-4"
          addLabel="Add Fact"
          itemLabel={() => "Fact"}
        />
      </div>

      {/* Words */}
      <div className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Words of Creation</h2>
          <button
            type="button"
            aria-label={wordsCollapsed ? `Expand Words of Creation` : `Collapse Words of Creation`}
            onClick={() => setWordsCollapsed(c => !c)}
            style={{ fontSize: '1.1em', background: 'none', border: 'none', cursor: 'pointer', color: '#38bdf8', marginLeft: 4 }}
          >
            {wordsCollapsed ? '▸' : '▾'}
          </button>
        </div>
        {!wordsCollapsed && (
          <div className="powers-list">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {words.map((word: Word, i: number) => (
                <li key={word.title + i} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: 4, alignItems: 'flex-start' }}>
                    <EditableField
                      value={word.title}
                      onChange={val => {
                        const updated = [...words];
                        updated[i] = { ...updated[i], title: String(val) };
                        set("words", updated);
                      }}
                      type="text"
                      minWidth="8rem"
                      maxWidth="12rem"
                      className="text-center"
                      placeholder="Word Name"
                    />
                    <button
                      type="button"
                      aria-label="Remove Word"
                      onClick={() => {
                        const updated = [...words];
                        updated.splice(i, 1);
                        set("words", updated);
                      }}
                      style={{
                        fontSize: '1.5em',
                        color: '#f87171',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 900,
                        lineHeight: 1,
                        padding: 0,
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: 8
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <EditableField
                      value={word.intrinsic}
                      onChange={val => {
                        const updated = [...words];
                        updated[i] = { ...updated[i], intrinsic: String(val) };
                        set("words", updated);
                      }}
                      type="text"
                      minWidth="100%"
                      maxWidth="100%"
                      className="text-center"
                      placeholder="Intrinsic Ability"
                      style={{ width: '100%' }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => set("words", [...words, { title: '', intrinsic: '' }])}
              style={{
                marginTop: 8,
                color: '#22d3ee',
                background: 'none',
                border: '1px solid #22d3ee',
                borderRadius: 4,
                padding: '0.2rem 0.8rem',
                fontSize: '1em',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              Add Word
            </button>
          </div>
        )}
      </div>


      {/* Divine Gifts */}
      <div className="section">
        <h2 className="section-title">Divine Gifts</h2>
        <div className="powers-list">
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {gifts.map((gift: Gift, i: number) => (
              <li key={gift.title + i} style={{ marginBottom: '1.5rem', position: 'relative', border: '1px solid #444', borderRadius: 8, padding: '0.75rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: 6 }}>
                  <EditableField
                    value={gift.title}
                    onChange={val => {
                      const updated = [...gifts];
                      updated[i] = { ...updated[i], title: String(val) };
                      set("gifts", updated);
                    }}
                    type="text"
                    minWidth="10rem"
                    maxWidth="18rem"
                    className="text-center font-bold"
                    placeholder="Gift Title"
                  />
                  <EditableField
                    value={gift.actionCost}
                    onChange={val => {
                      const updated = [...gifts];
                      updated[i] = { ...updated[i], actionCost: String(val) };
                      set("gifts", updated);
                    }}
                    type="text"
                    minWidth="7rem"
                    maxWidth="10rem"
                    className="text-center"
                    placeholder="Action Cost"
                  />
                  <EditableField
                    value={gift.effortCost ?? ''}
                    onChange={val => {
                      const updated = [...gifts];
                      updated[i] = { ...updated[i], effortCost: String(val) };
                      set("gifts", updated);
                    }}
                    type="text"
                    minWidth="6rem"
                    maxWidth="8rem"
                    className="text-center"
                    placeholder="Effort Cost"
                  />
                  <button
                    type="button"
                    aria-label="Remove Gift"
                    onClick={() => {
                      const updated = [...gifts];
                      updated.splice(i, 1);
                      set("gifts", updated);
                    }}
                    style={{
                      fontSize: '1.5em',
                      color: '#f87171',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 900,
                      lineHeight: 1,
                      padding: 0,
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 8
                    }}
                  >
                    ×
                  </button>
                </div>
                <EditableField
                  value={gift.description}
                  onChange={val => {
                    const updated = [...gifts];
                    updated[i] = { ...updated[i], description: String(val) };
                    set("gifts", updated);
                  }}
                  type="text"
                  minWidth="100%"
                  maxWidth="100%"
                  className="text-center"
                  placeholder="Description"
                  style={{ width: '100%' }}
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => set("gifts", [...gifts, { title: '', actionCost: '', effortCost: '', description: '' }])}
            style={{
              marginTop: 8,
              color: '#22d3ee',
              background: 'none',
              border: '1px solid #22d3ee',
              borderRadius: 4,
              padding: '0.2rem 0.8rem',
              fontSize: '1em',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Add Gift
          </button>
        </div>
      </div>

      {/* Equipment */}
      <div className="section">
        <h2 className="section-title">Equipment</h2>
        <div className="powers-list">
          <ul>
            {equipment.map((item: string, i: number) => (
              <li key={item + i}>
                <EquipmentNoteField
                  value={item}
                  onChange={val => {
                    const updated = [...equipment];
                    updated[i] = String(val);
                    set("equipment", updated);
                  }}
                  placeholder="Equipment item"
                />
              </li>
            ))}
            {equipment.length === 0 && (
              <li>
                <span
                  style={{ color: '#888', cursor: 'pointer', fontStyle: 'italic' }}
                  onClick={() => set("equipment", [""])}
                >
                  Click to add equipment
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Notes */}
      <div className="section">
        <h2 className="section-title">Notes</h2>
        <div className="powers-list">
          <ul>
            {notes.map((note: string, i: number) => (
              <li key={"note-" + i}>
                <EquipmentNoteField
                  value={note}
                  onChange={val => {
                    const updated = [...notes];
                    updated[i] = String(val);
                    set("notes", updated);
                  }}
                  placeholder="Note"
                />
              </li>
            ))}
            {notes.length === 0 && (
              <li>
                <span
                  style={{ color: '#888', cursor: 'pointer', fontStyle: 'italic' }}
                  onClick={() => set("notes", [""])}
                >
                  Click to add note
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
