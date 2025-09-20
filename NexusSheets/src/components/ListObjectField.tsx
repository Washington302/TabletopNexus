import React, { useState } from "react";
import EditableField from "./EditableField";

interface ListObjectFieldProps {
  label?: string;
  items: string[];
  onChange: (items: string[]) => void;
  itemLabel?: (index: number) => string;
  minWidth?: string | number;
  maxWidth?: string | number;
  className?: string;
  addLabel?: string;
}

const ListObjectField: React.FC<ListObjectFieldProps> = ({
  label,
  items,
  onChange,
  itemLabel,
  minWidth = "8rem",
  maxWidth = "12rem",
  className = "",
  addLabel = "Add",
}) => {
  const handleChange = (idx: number, value: string) => {
    const updated = [...items];
    updated[idx] = value;
    onChange(updated);
  };
  const handleAdd = () => {
    // Provide sample text for new entries
    let sample = "";
    if (label?.toLowerCase().includes("fact")) sample = "Sample Fact";
    else if (label?.toLowerCase().includes("career")) sample = "Sample Career";
    else sample = "Sample Item";
    onChange([...items, sample]);
  };
  const handleRemove = (idx: number) => {
    const updated = items.slice();
    updated.splice(idx, 1);
    onChange(updated);
  };
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={className}>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 4 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>{label}</h2>
          <button
            type="button"
            aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
            onClick={() => setCollapsed(c => !c)}
            style={{ fontSize: '1.1em', background: 'none', border: 'none', cursor: 'pointer', color: '#38bdf8', marginLeft: 4 }}
          >
            {collapsed ? '▸' : '▾'}
          </button>
        </div>
      )}
      {!collapsed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {items.map((item, i) => (
            <div
              className="stat-block"
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                position: "relative",
                minHeight: 40,
              }}
            >
              {itemLabel && (
                <span style={{ minWidth: 90, fontWeight: 600, color: '#a3a3a3', textAlign: 'right' }}>{itemLabel(i)}:</span>
              )}
              <EditableField
                value={item}
                onChange={val => handleChange(i, String(val))}
                type="text"
                minWidth={minWidth}
                maxWidth={maxWidth}
                className="text-center"
                placeholder="input here"
              />
              <button
                type="button"
                aria-label="Remove"
                onClick={() => handleRemove(i)}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "1.7em",
                  color: "#f87171",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 900,
                  lineHeight: 1,
                  padding: 0,
                  width: 32,
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                ×
              </button>
            </div>
          ))}
          {addLabel && (
            <button
              type="button"
              onClick={handleAdd}
              style={{ marginTop: 4, color: "#22d3ee", background: "none", border: "1px solid #22d3ee", borderRadius: 4, padding: "0.1rem 0.4rem", fontSize: '0.9em', cursor: "pointer", fontWeight: 700 }}
            >
              {addLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ListObjectField;
