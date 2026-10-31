"use client";

const tools = [
  { id: "select", label: "Pilih", icon: "↖" },
  { id: "signature", label: "Tanda Tangan", icon: "✍" },
  { id: "stamp", label: "Stempel", icon: "▣" },
  { id: "paraf", label: "Paraf", icon: "✒" },
  { id: "text", label: "Teks", icon: "T" },
  { id: "date", label: "Tanggal", icon: "▦" },
];

export default function EditorToolbar({ activeTool, onToolChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface p-3">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id;

        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onToolChange(tool.id)}
            aria-pressed={isActive}
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition ${
              isActive
                ? "border-primary bg-primary text-white shadow-shadow-sm"
                : "border-border bg-surface text-text hover:border-primary"
            }`}
          >
            <span className="text-base">{tool.icon}</span>
            <span>{tool.label}</span>
          </button>
        );
      })}
    </div>
  );
}
