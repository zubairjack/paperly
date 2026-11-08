"use client";

import { useEffect, useState, useReducer } from "react";

import PageSidebar from "@/components/editor/PageSidebar";
import EditorToolbar from "@/components/editor/EditorToolbar";
import PropertiesPanel from "@/components/editor/PropertiesPanel";
import PdfViewer from "@/components/editor/PdfViewer";
import SignatureModal from "@/components/editor/SignatureModal";
import StampPickerModal from "@/components/editor/StampPickerModal";

import {
  editorReducer,
  initialEditorState,
} from "@/components/editor/reducers/editorReducer";

const generateId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `object-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// Menghilangkan area transparan di sekitar tanda tangan
const trimTransparentImage = (imageData) => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      const { data, width, height } = imageData;

      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const alpha = data[(y * width + x) * 4 + 3];

          if (alpha > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      // Jika gambar kosong, gunakan gambar asli
      if (maxX === -1) {
        resolve(imageDataToResult(imageData, canvas));
        return;
      }

      const cropWidth = maxX - minX + 1;
      const cropHeight = maxY - minY + 1;

      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      const croppedContext = croppedCanvas.getContext("2d");

      croppedContext.drawImage(
        canvas,
        minX,
        minY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight,
      );

      resolve({
        content: croppedCanvas.toDataURL("image/png"),
        width: cropWidth,
        height: cropHeight,
      });
    };

    image.onerror = reject;
    image.src = imageData;
  });
};

const imageDataToResult = (imageData, canvas) => ({
  content: canvas.toDataURL("image/png"),
  width: canvas.width,
  height: canvas.height,
});

export default function EditorWorkspace({ selectedFile }) {
  const [activePanel, setActivePanel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  const [isStampPickerOpen, setIsStampPickerOpen] = useState(false);
  const [selectedStamp, setSelectedStamp] = useState(null);

  const [editorState, dispatch] = useReducer(editorReducer, initialEditorState);

  const selectedObject =
    editorState.objects.find(
      (object) => object.id === editorState.selectedObjectId,
    ) || null;

  // Menangani tombol Delete dan Backspace
  useEffect(() => {
    const handleKeyDown = (event) => {
      const isDeleteKey = event.key === "Delete" || event.key === "Backspace";

      if (!isDeleteKey) return;

      const target = event.target;

      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (isTyping) return;

      if (!editorState.selectedObjectId) return;

      event.preventDefault();

      dispatch({
        type: "DELETE_OBJECT",
        payload: editorState.selectedObjectId,
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [editorState.selectedObjectId]);

  const closePanel = () => setActivePanel(null);

  const handlePageSelect = (pageNumber) => {
    setCurrentPage(pageNumber);
    setActivePanel(null);
  };

  const handleToolChange = (toolId) => {
    if (toolId === "signature") {
      setIsSignatureModalOpen(true);
      return;
    }

    if (toolId === "stamp") {
      setIsStampPickerOpen(true);
      return;
    }

    dispatch({
      type: "SET_ACTIVE_TOOL",
      payload: toolId,
    });
  };

  const handleStampSelect = (stamp) => {
    setSelectedStamp(stamp);
    setIsStampPickerOpen(false);

    dispatch({
      type: "SET_ACTIVE_TOOL",
      payload: "stamp",
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

  const handleDeleteObject = (id) => {
    dispatch({
      type: "DELETE_OBJECT",
      payload: id,
    });
  };

  // Menyimpan tanda tangan ke halaman PDF aktif
  const handleSaveSignature = async (imageData) => {
    try {
      const trimmedImage = await trimTransparentImage(imageData);

      const initialWidth = 18;

      handleAddObject({
        id: generateId(),
        type: "signature",
        pageNumber: currentPage,
        x: 35,
        y: 40,
        width: initialWidth,
        height: 1,
        content: trimmedImage.content,
        imageWidth: trimmedImage.width,
        imageHeight: trimmedImage.height,
        aspectRatioAdjusted: false,
      });

      dispatch({
        type: "SET_ACTIVE_TOOL",
        payload: "select",
      });

      setIsSignatureModalOpen(false);
    } catch (error) {
      console.error("Gagal memproses tanda tangan:", error);
    }
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
              selectedStamp={selectedStamp}
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
        <PropertiesPanel
          selectedObject={selectedObject}
          onDeleteObject={handleDeleteObject}
          onUpdateObject={handleUpdateObject}
        />
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
                <PropertiesPanel
                  selectedObject={selectedObject}
                  onDeleteObject={handleDeleteObject}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* SIGNATURE MODAL */}
      {isSignatureModalOpen && (
        <SignatureModal
          onClose={() => setIsSignatureModalOpen(false)}
          onSave={handleSaveSignature}
        />
      )}

      {/* STAMP PICKER MODAL */}
      {isStampPickerOpen && (
        <StampPickerModal
          onClose={() => setIsStampPickerOpen(false)}
          onSelect={handleStampSelect}
        />
      )}
    </section>
  );
}
