"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import PdfUploadButton from "@/components/editor/PdfUploadButton";

export default function EditorHeader({ selectedFile, onFileSelect }) {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <header className="w-full shrink-0 border-b border-border bg-surface text-text transition-colors duration-200">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand */}
        <a href="/" className="flex shrink-0 items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-strong bg-secondary text-text shadow-shadow-sm">
            <span className="text-lg font-extrabold">P</span>
          </div>

          <span className="text-xl font-extrabold tracking-tight">
            Paperly<span className="text-secondary">.</span>
          </span>
        </a>

        {/* Document Information */}
        <div className="hidden min-w-0 flex-1 text-center sm:block">
          <p className="truncate text-sm font-semibold">
            {selectedFile ? selectedFile.name : "Dokumen PDF"}
          </p>

          <p className="text-xs text-text-secondary">
            {selectedFile
              ? formatFileSize(selectedFile.size)
              : "Belum ada dokumen"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <PdfUploadButton onFileSelect={onFileSelect} />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Ganti ke mode ${isDark ? "light" : "dark"}`}
            className="flex items-center gap-2 rounded-md border border-border-strong bg-background px-3 py-2 text-xs font-semibold text-text transition-colors hover:bg-border"
          >
            <span>{isDark ? "☀" : "☾"}</span>

            <span className="hidden sm:inline">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
