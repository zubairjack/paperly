"use client";

const stampTemplates = [
  {
    id: "approved",
    label: "APPROVED",
    description: "Disetujui",
    color: "#C65353",
    shape: "round",
  },
  {
    id: "rejected",
    label: "REJECTED",
    description: "Ditolak",
    color: "#C65353",
    shape: "round",
  },
  {
    id: "received",
    label: "RECEIVED",
    description: "Diterima",
    color: "#3157D5",
    shape: "rectangle",
  },
  {
    id: "paid",
    label: "PAID",
    description: "Lunas",
    color: "#32805E",
    shape: "round",
  },
  {
    id: "draft",
    label: "DRAFT",
    description: "Konsep",
    color: "#C28A42",
    shape: "rectangle",
  },
  {
    id: "confidential",
    label: "CONFIDENTIAL",
    description: "Rahasia",
    color: "#3157D5",
    shape: "rectangle",
  },
];

export default function StampPickerModal({ onClose, onSelect }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="stamp-modal-title"
        className="w-full max-w-lg rounded-xl border border-border bg-surface p-5 shadow-shadow-lg"
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 id="stamp-modal-title" className="text-lg font-bold text-text">
              Pilih Stempel
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Pilih template untuk ditambahkan ke dokumen.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md border border-border px-3 py-1 text-text hover:border-primary"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {stampTemplates.map((stamp) => (
            <button
              key={stamp.id}
              type="button"
              onClick={() => onSelect(stamp)}
              className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background p-3 transition hover:border-primary hover:bg-primary/5"
            >
              <span
                className={`flex min-h-10 w-full items-center justify-center border-2 px-2 text-center text-xs font-extrabold tracking-wide ${
                  stamp.shape === "round" ? "rounded-full" : "rounded-sm"
                }`}
                style={{
                  color: stamp.color,
                  borderColor: stamp.color,
                }}
              >
                {stamp.label}
              </span>

              <span className="text-xs font-medium text-text-secondary">
                {stamp.description}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-text hover:border-primary"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
