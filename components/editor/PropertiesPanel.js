"use client";

import { useEffect, useState } from "react";

export default function PropertiesPanel({
  selectedObject,
  onDeleteObject,
  onUpdateObject,
}) {
  const [activeTab, setActiveTab] = useState("document");

  useEffect(() => {
    if (selectedObject) {
      setActiveTab("object");
    }
  }, [selectedObject]);

  const handleDelete = () => {
    if (!selectedObject) return;
    onDeleteObject(selectedObject.id);
  };

  const updateTextStyle = (changes) => {
    if (!selectedObject || selectedObject.type !== "text") return;

    onUpdateObject(selectedObject.id, changes);
  };

  const isSignature = selectedObject?.type === "signature";
  const isText = selectedObject?.type === "text";

  const fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

  const textColors = [
    { label: "Hitam", value: "#000000" },
    { label: "Abu-abu", value: "#555555" },
    { label: "Merah", value: "#D32F2F" },
    { label: "Biru", value: "#3157D5" },
    { label: "Hijau", value: "#32805E" },
    { label: "Oranye", value: "#F0784B" },
  ];

  const currentFontSize = selectedObject?.fontSize ?? 14;
  const currentColor = selectedObject?.color ?? "#000000";
  const currentAlignment = selectedObject?.textAlign ?? "left";
  const isBold = selectedObject?.fontWeight === "bold";
  const isItalic = selectedObject?.fontStyle === "italic";

  const formatButtonClass = (isActive) =>
    `flex h-9 flex-1 items-center justify-center rounded-md border text-sm font-semibold transition ${
      isActive
        ? "border-primary bg-primary text-white"
        : "border-border bg-background text-text hover:border-primary"
    }`;

  return (
    <aside className="h-full bg-surface p-4">
      <h2 className="text-sm font-bold text-text">Properti</h2>

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

          {selectedObject ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-text-secondary">Jenis Objek</p>
                <p className="mt-1 text-sm font-semibold capitalize text-text">
                  {selectedObject.type}
                </p>
              </div>

              {isText && (
                <div className="space-y-4 border-b border-border pb-4">
                  <h4 className="text-xs font-bold text-text">Format Teks</h4>

                  <div>
                    <label
                      htmlFor="text-font-size"
                      className="text-xs text-text-secondary"
                    >
                      Ukuran Font
                    </label>

                    <select
                      id="text-font-size"
                      value={currentFontSize}
                      onChange={(event) =>
                        updateTextStyle({
                          fontSize: Number(event.target.value),
                        })
                      }
                      className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text outline-none focus:border-primary"
                    >
                      {fontSizes.map((size) => (
                        <option key={size} value={size}>
                          {size} px
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">Warna Teks</p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {textColors.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          title={color.label}
                          aria-label={`Warna ${color.label}`}
                          aria-pressed={currentColor === color.value}
                          onClick={() =>
                            updateTextStyle({ color: color.value })
                          }
                          className={`h-8 w-8 rounded-full border-2 transition ${
                            currentColor === color.value
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-border"
                          }`}
                          style={{ backgroundColor: color.value }}
                        />
                      ))}
                    </div>

                    <label
                      htmlFor="custom-text-color"
                      className="mt-3 block text-xs text-text-secondary"
                    >
                      Pilih warna lainnya
                    </label>

                    <input
                      id="custom-text-color"
                      type="color"
                      value={currentColor}
                      onChange={(event) =>
                        updateTextStyle({ color: event.target.value })
                      }
                      className="mt-2 h-10 w-full cursor-pointer rounded-md border border-border bg-background p-1"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">Gaya Teks</p>

                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        aria-label="Bold"
                        aria-pressed={isBold}
                        onClick={() =>
                          updateTextStyle({
                            fontWeight: isBold ? "normal" : "bold",
                          })
                        }
                        className={formatButtonClass(isBold)}
                      >
                        <span className="font-black">B</span>
                      </button>

                      <button
                        type="button"
                        aria-label="Italic"
                        aria-pressed={isItalic}
                        onClick={() =>
                          updateTextStyle({
                            fontStyle: isItalic ? "normal" : "italic",
                          })
                        }
                        className={formatButtonClass(isItalic)}
                      >
                        <span className="italic">I</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-text-secondary">Perataan Teks</p>

                    <div className="mt-2 flex gap-2">
                      {[
                        { value: "left", label: "Kiri", icon: "☰" },
                        { value: "center", label: "Tengah", icon: "☷" },
                        { value: "right", label: "Kanan", icon: "☰" },
                      ].map((alignment) => (
                        <button
                          key={alignment.value}
                          type="button"
                          title={`Rata ${alignment.label}`}
                          aria-label={`Rata ${alignment.label}`}
                          aria-pressed={currentAlignment === alignment.value}
                          onClick={() =>
                            updateTextStyle({
                              textAlign: alignment.value,
                            })
                          }
                          className={formatButtonClass(
                            currentAlignment === alignment.value,
                          )}
                        >
                          {alignment.icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs text-text-secondary">
                  {isSignature ? "Preview Tanda Tangan" : "Konten"}
                </p>

                {isSignature ? (
                  <div className="mt-2 flex min-h-24 items-center justify-center overflow-hidden rounded-lg border border-border bg-white p-3">
                    <img
                      src={selectedObject.content}
                      alt="Preview tanda tangan"
                      className="max-h-24 max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <p className="mt-1 break-words text-sm text-text">
                    {selectedObject.content || "Tidak ada konten"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs text-text-secondary">Posisi</p>
                <p className="mt-1 text-sm text-text">
                  X: {selectedObject.x.toFixed(1)}% · Y:{" "}
                  {selectedObject.y.toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="text-xs text-text-secondary">Ukuran</p>
                <p className="mt-1 text-sm text-text">
                  Lebar: {selectedObject.width.toFixed(1)}% · Tinggi:{" "}
                  {selectedObject.height.toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="text-xs text-text-secondary">Halaman</p>
                <p className="mt-1 text-sm text-text">
                  {selectedObject.pageNumber}
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-red-500 bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  <span>🗑</span>
                  Hapus Objek
                </button>

                <p className="mt-2 text-center text-xs text-text-secondary">
                  Objek yang dipilih akan dihapus dari editor.
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-3 text-xs leading-6 text-text-secondary">
              Belum ada objek yang dipilih. Pilih teks atau objek pada halaman
              PDF untuk melihat pengaturannya.
            </p>
          )}
        </div>
      )}
    </aside>
  );
}
