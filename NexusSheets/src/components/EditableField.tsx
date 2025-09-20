import React, { useState } from "react";

type EditableFieldProps = {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: "text" | "number";
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  minWidth?: string | number;
  maxWidth?: string | number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
  style = {},
  minWidth = "3.5rem",
  maxWidth = "3.5rem",
  inputProps = {},
}) => {
  const [editing, setEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return editing ? (
    <input
      type={type}
      value={internalValue}
      placeholder={placeholder}
      onChange={e => {
        const val = type === "number" ? Number(e.target.value) : e.target.value;
        setInternalValue(val);
      }}
      onBlur={() => {
        setEditing(false);
        onChange(String(internalValue)); // always pass string for math parsing
      }}
      onKeyDown={e => {
        if (e.key === "Enter") {
          setEditing(false);
          onChange(String(internalValue));
        }
      }}
      autoFocus
      className={className}
      style={{ width: minWidth, minWidth, maxWidth, textAlign: "center", ...style }}
      {...inputProps}
    />
  ) : (
    <span
      onClick={() => setEditing(true)}
      style={{ cursor: "pointer", display: "inline-block", width: minWidth, minWidth, maxWidth, textAlign: "center", ...style }}
      className={className}
    >
      {value === "" || value === undefined ? <span style={{ color: "#888" }}>{placeholder}</span> : value}
    </span>
  );
};

export default EditableField;