import { useState, useEffect } from "react";
import type { GameDefinition, UIDefinition } from "../types/game";


import { forwardRef, useImperativeHandle } from "react";
type Props = {
  gameDef: GameDefinition;
  uiDef: UIDefinition;
  data?: Record<string, any>;
  setData?: (data: Record<string, any>) => void;
};



const DynamicCharacterSheet = forwardRef<any, Props>(({ gameDef, uiDef, data: propData, setData: propSetData }, ref) => {
  const [activeTab, setActiveTab] = useState(uiDef.tabs[0].id);
  // Use controlled data if provided, else internal state
  const [internalData, internalSetData] = useState<Record<string, any>>(() => {
    const init: Record<string, any> = {};
    for (const key in gameDef.characterSchema) {
      const schema = gameDef.characterSchema[key];
      if (Array.isArray(schema)) {
        init[key] = schema.reduce((acc, f) => ({ ...acc, [f]: 0 }), {});
      } else if (schema.type === "list") {
        init[key] = [...(schema.default || [])];
      } else if (schema.type === "object") {
        init[key] = { ...(schema.default || {}) };
      }
    }
    return init;
  });

  // Sync internal state with propData when it changes (for editing different characters)
  useEffect(() => {
    if (propData !== undefined && propSetData === undefined) {
      // Only update internal state if using internal state (not controlled)
      internalSetData(propData);
    }
  }, [propData]);

  const data = propData !== undefined ? propData : internalData;
  const setData = propSetData !== undefined ? propSetData : internalSetData;

  useImperativeHandle(ref, () => ({
    getData: () => data
  }), [data]);

  const handleChange = (category: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const renderField = (field: string, category: string) => {
    const value = data[category]?.[field] ?? "";
    return (
      <div key={field} className="mb-4">
        <label className="block font-semibold text-gray-700 mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
        <input
          type={typeof value === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => handleChange(category, field, e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>
    );
  };

  const renderCategory = (category: string) => {
    const schema = gameDef.characterSchema[category];
    if (!schema) return <div className="text-red-500">Unknown schema for {category}</div>;

    if (Array.isArray(schema)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(data[category] || {}).map((f) => renderField(f, category))}
        </div>
      );
    }

    if (schema.type === "list") {
      return (
        <div>
          <label className="block font-semibold text-gray-700 mb-2 capitalize">{category.replace(/_/g, ' ')}</label>
          {(data[category] || []).map((item: string, i: number) => (
            <input
              key={i}
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...(data[category] || [])];
                updated[i] = e.target.value;
                setData({ ...data, [category]: updated });
              }}
              className="border border-gray-300 rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          ))}
        </div>
      );
    }

    if (schema.type === "object") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(schema.default || {}).map((f) => renderField(f, category))}
        </div>
      );
    }

    return <div className="text-red-500">Unsupported schema type</div>;
  };

  const currentTab = uiDef.tabs.find((t) => t.id === activeTab)!;

  return (
    <div style={{ background: 'var(--color-bg-mid)', color: 'var(--color-text-main)' }} className="border rounded-xl p-6 shadow-lg max-w-3xl mx-auto mt-8">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {uiDef.tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 text-base font-semibold transition border-b-2 -mb-px focus:outline-none ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-transparent text-gray-500 hover:text-blue-500 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">{currentTab.label}</h2>
        {renderCategory(currentTab.fields as string)}
      </div>
    </div>
  );
});

export default DynamicCharacterSheet;
