"use client";

import { useEffect, useState, useReducer } from "react";

import PageSidebar from "@/components/editor/PageSidebar";
import EditorToolbar from "@/components/editor/EditorToolbar";
import PropertiesPanel from "@/components/editor/PropertiesPanel";
import PdfViewer from "@/components/editor/PdfViewer";

import {
  editorReducer,
  initialEditorState,
} from "@/components/editor/reducers/editorReducer";

export default function EditorWorkspace({ selectedFile }) {
  const [activePanel, setActivePanel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [editorState, dispatch] = useReducer(editorReducer, initialEditorState);

  useEffect(() => {
    setCurrentPage(1);
    dispatch({ type: "RESET_EDITOR" });
  }, [selectedFile]);

  const closePanel = () => setActivePanel(null);

  const handlePageSelect = (pageNumber) => {
    setCurrentPage(pageNumber);
    setActivePanel(null);
  };

  const handleToolChange = (toolId) => {
    dispatch({
      type: "SET_ACTIVE_TOOL",
      payload: toolId,
    });
  };

  const handleAddObject = (newObject) => {
    dispatch({
      type: "ADD_OBJECT",
      payload: newObject,
    });
  };

  const handleSelectObject = (id) => {
    dispatch({
      type: "SELECT_OBJECT",
      payload: id,
    });
  };

  const handleUpdateObject = (id, changes) => {
    dispatch({
      type: "UPDATE_OBJECT",
      payload: { id, changes },
    });
  };

  return (
    <section className="relative grid h-full min-h-0 grid-cols-1 overflow-hidden lg:grid-cols-[220px_minmax(0,1fr)_260px]">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden min-h-0 overflow-y-auto border-r border-border bg-surface lg:block">
        <PageSidebar
          file={selectedFile}
          currentPage={currentPage}
          onPageSelect={handlePageSelect}
        />
      </aside>

      {/* AREA UTAMA EDITOR */}
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden bg-workspace p-3 sm:p-5">
        {/* NAVIGASI TABLET DAN HP */}
        <div className="mb-3 flex shrink-0 gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setActivePanel("pages")}
            className="flex-1 rounded-md border border-border-strong bg-surface px-3 py-2 text-sm font-semibold text-text transition hover:border-primary"
          >
            ☰ Halaman
          </button>

          <button
            type="button"
            onClick={() => setActivePanel("properties")}
            className="flex-1 rounded-md border border-border-strong bg-surface px-3 py-2 text-sm font-semibold text-text transition hover:border-primary"
          >
            ⚙ Properti
          </button>
        </div>

        {/* EDITOR TOOLBAR */}
        <div className="shrink-0">
          <EditorToolbar
            activeTool={editorState.activeTool}
            onToolChange={handleToolChange}
          />
        </div>

        {/* PDF VIEWPORT */}
        <div className="mt-4 min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain rounded-lg">
          {selectedFile ? (
            <PdfViewer
              file={selectedFile}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              activeTool={editorState.activeTool}
              objects={editorState.objects}
              selectedObjectId={editorState.selectedObjectId}
              onSelectObject={handleSelectObject}
              onAddObject={handleAddObject}
              onUpdateObject={handleUpdateObject}
            />
          ) : (
            <div className="flex min-h-[650px] min-w-full items-center justify-center rounded-lg border border-dashed border-border-strong bg-surface p-4">
              <div className="max-w-sm text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-background text-3xl">
                  📄
                </div>

                <h2 className="mt-5 text-lg font-bold text-text">
                  Belum ada dokumen PDF
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Upload dokumen PDF untuk mulai mengedit.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PROPERTIES PANEL DESKTOP */}
      <aside className="hidden min-h-0 overflow-y-auto border-l border-border bg-surface lg:block">
        <PropertiesPanel />
      </aside>

      {/* DRAWER TABLET DAN HP */}
      {activePanel && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Tutup panel"
            onClick={closePanel}
            className="absolute inset-0 h-full w-full bg-black/40"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              activePanel === "pages" ? "Daftar Halaman" : "Pengaturan Properti"
            }
            className={`absolute bottom-0 left-0 right-0 flex max-h-[75dvh] flex-col overflow-hidden rounded-t-xl border border-border bg-surface shadow-shadow-md md:bottom-0 md:top-0 md:max-h-none md:w-80 md:rounded-none ${
              activePanel === "properties"
                ? "md:left-auto md:right-0 md:border-y-0 md:border-l"
                : "md:left-0 md:right-auto md:border-y-0 md:border-r"
            }`}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border p-4">
              <h2 className="text-sm font-bold text-text">
                {activePanel === "pages"
                  ? "Daftar Halaman"
                  : "Pengaturan Properti"}
              </h2>

              <button
                type="button"
                onClick={closePanel}
                className="rounded-md border border-border px-3 py-1 text-sm font-semibold text-text transition hover:border-primary"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {activePanel === "pages" ? (
                <PageSidebar
                  file={selectedFile}
                  currentPage={currentPage}
                  onPageSelect={handlePageSelect}
                />
              ) : (
                <PropertiesPanel />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
