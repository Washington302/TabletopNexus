import React, { useState } from "react";

interface WordOfCreationProps {
  title: string;
  intrinsic: string;
}

const WordOfCreation: React.FC<WordOfCreationProps> = ({ title, intrinsic }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-2 border rounded shadow-sm bg-white">
      <button
        className="w-full text-left px-4 py-2 font-bold text-lg flex justify-between items-center hover:bg-gray-100 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className="ml-2 text-gray-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 py-3 border-t bg-gray-50 text-gray-700">
          <div className="font-semibold mb-1">Intrinsic Ability</div>
          <div>{intrinsic}</div>
        </div>
      )}
    </div>
  );
};

export default WordOfCreation;
