"use client";

import { useState } from "react";

import EditorHeader from "@/components/editor/EditorHeader";
import EditorWorkspace from "@/components/editor/EditorWorkspace";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function EditorPage() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <ThemeProvider>
      <main className="flex h-dvh flex-col overflow-hidden">
        {/* Header */}
        <div className="z-20 shrink-0">
          <EditorHeader
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
        </div>

        {/* Workspace */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <EditorWorkspace selectedFile={selectedFile} />
        </div>
      </main>
    </ThemeProvider>
  );
}
