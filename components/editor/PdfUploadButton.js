"use client";

export default function PdfUploadButton({ onFileSelect }) {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validasi ekstensi dan tipe file
    const isPdfExtension = file.name.toLowerCase().endsWith(".pdf");
    const isPdfType = file.type === "application/pdf";

    if (!isPdfExtension || !isPdfType) {
      alert("File yang dipilih harus berformat PDF.");

      // Reset input agar file yang sama bisa dipilih kembali
      event.target.value = "";
      return;
    }

    // Kirim file ke komponen induk
    onFileSelect(file);

    // Reset input setelah file dipilih
    event.target.value = "";
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border-strong bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover">
      <span>＋</span>
      <span>Upload PDF</span>

      <input
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );
}
