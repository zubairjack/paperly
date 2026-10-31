"use client";

import { useState } from "react";

export default function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState("document");

  return (
    <aside className="h-full bg-surface p-4">
      {/* Header */}
      <h2 className="text-sm font-bold text-text">Properti</h2>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Kategori properti"
        className="mt-5 grid grid-cols-2 border-b border-border"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "document"}
          onClick={() => setActiveTab("document")}
          className={`border-b-2 pb-3 text-xs font-semibold transition ${
            activeTab === "document"
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          Dokumen
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "object"}
          onClick={() => setActiveTab("object")}
          className={`border-b-2 pb-3 text-xs font-semibold transition ${
            activeTab === "object"
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-text"
          }`}
        >
          Objek
        </button>
      </div>

      {/* Content */}
      {activeTab === "document" ? (
        <div role="tabpanel" className="mt-5">
          <h3 className="text-xs font-bold text-text">Informasi Dokumen</h3>

          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs text-text-secondary">Nama File</p>

              <p className="mt-1 text-sm font-medium text-text">
                Belum ada dokumen
              </p>
            </div>

            <div>
              <p className="text-xs text-text-secondary">Jumlah Halaman</p>

              <p className="mt-1 text-sm font-medium text-text">-</p>
            </div>

            <div>
              <p className="text-xs text-text-secondary">Ukuran File</p>

              <p className="mt-1 text-sm font-medium text-text">-</p>
            </div>
          </div>
        </div>
      ) : (
        <div role="tabpanel" className="mt-5">
          <h3 className="text-xs font-bold text-text">Pengaturan Objek</h3>

          <p className="mt-3 text-xs leading-6 text-text-secondary">
            Pilih tanda tangan, stempel, paraf, atau teks pada dokumen untuk
            mengatur tampilannya.
          </p>
        </div>
      )}
    </aside>
  );
}
