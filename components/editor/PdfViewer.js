"use client";

import { useEffect, useRef, useReducer, useState } from "react";

import {
  pdfViewerReducer,
  initialPdfViewerState,
} from "@/components/editor/reducers/pdfViewerReducer";

import PdfPageOverlay from "@/components/editor/PdfPageOverlay";

function PdfPage({
  pdfDocument,
  pageNumber,
  zoom,
  activeTool,
  objects,
  selectedObjectId,
  onSelectObject,
  onAddObject,
  onUpdateObject,
}) {
  const canvasRef = useRef(null);
  const [pageSize, setPageSize] = useState(null);

  useEffect(() => {
    let renderTask = null;
    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDocument.getPage(pageNumber);

        if (isCancelled) return;

        const viewport = page.getViewport({
          scale: zoom / 100,
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");

        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);

        setPageSize({
          width: viewport.width,
          height: viewport.height,
        });

        renderTask = page.render({
          canvasContext: context,
          viewport,
        });

        await renderTask.promise;
      } catch (error) {
        if (!isCancelled) {
          console.error("Gagal merender halaman PDF:", error);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;

      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {
          // Render sudah selesai
        }
      }
    };
  }, [pdfDocument, pageNumber, zoom]);

  return (
    <div
      data-page-number={pageNumber}
      className="relative mb-6 shrink-0 bg-white shadow-shadow-md"
      style={{
        width: pageSize?.width,
        height: pageSize?.height,
      }}
    >
      <canvas
        ref={canvasRef}
        className="block"
        aria-label={`Halaman PDF ${pageNumber}`}
      />

      {pageSize && (
        <PdfPageOverlay
          pageNumber={pageNumber}
          objects={objects}
          activeTool={activeTool}
          selectedObjectId={selectedObjectId}
          onSelectObject={onSelectObject}
          onAddObject={onAddObject}
          onUpdateObject={onUpdateObject}
        />
      )}
    </div>
  );
}

export default function PdfViewer({
  file,
  currentPage: selectedPage,
  onPageChange,
  activeTool,
  objects = [],
  selectedObjectId,
  onSelectObject,
  onAddObject,
  onUpdateObject,
}) {
  const containerRef = useRef(null);

  const [viewerState, dispatch] = useReducer(
    pdfViewerReducer,
    initialPdfViewerState,
  );

  const [pdfDocument, setPdfDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch({ type: "RESET_VIEWER" });
    setPdfDocument(null);
  }, [file]);

  useEffect(() => {
    if (selectedPage !== undefined) {
      dispatch({
        type: "SET_CURRENT_PAGE",
        payload: selectedPage,
      });
    }
  }, [selectedPage]);

  useEffect(() => {
    onPageChange?.(viewerState.currentPage);
  }, [viewerState.currentPage, onPageChange]);

  useEffect(() => {
    if (!file) return;

    let loadingTask = null;
    let isCancelled = false;

    const loadPdf = async () => {
      try {
        setLoading(true);

        const pdfjsLib = await import("pdfjs-dist");

        if (isCancelled) return;

        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const arrayBuffer = await file.arrayBuffer();

        if (isCancelled) return;

        loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
        });

        const document = await loadingTask.promise;

        if (isCancelled) {
          await loadingTask.destroy();
          return;
        }

        setPdfDocument(document);

        dispatch({
          type: "SET_TOTAL_PAGES",
          payload: document.numPages,
        });
      } catch (error) {
        if (!isCancelled) {
          console.error("Gagal membuka PDF:", error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;

      if (loadingTask && typeof loadingTask.destroy === "function") {
        Promise.resolve(loadingTask.destroy()).catch(() => {});
      }
    };
  }, [file]);

  useEffect(() => {
    const targetPage = containerRef.current?.querySelector(
      `[data-page-number="${viewerState.currentPage}"]`,
    );

    targetPage?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [viewerState.currentPage, pdfDocument]);

  if (!file) return null;

  return (
    <div className="relative flex min-w-0 items-start">
      <div
        ref={containerRef}
        className="flex min-w-0 flex-1 flex-col items-center p-4"
      >
        {loading && (
          <p className="py-6 text-sm text-text-secondary">
            Memuat dokumen PDF...
          </p>
        )}

        {pdfDocument &&
          Array.from({ length: pdfDocument.numPages }, (_, index) => (
            <PdfPage
              key={`${file.name}-${index + 1}`}
              pdfDocument={pdfDocument}
              pageNumber={index + 1}
              zoom={viewerState.zoom}
              activeTool={activeTool}
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectObject={onSelectObject}
              onAddObject={onAddObject}
              onUpdateObject={onUpdateObject}
            />
          ))}
      </div>

      <div className="sticky top-4 z-30 mr-3 mt-4 flex w-12 shrink-0 flex-col items-center gap-1 rounded-lg border border-border bg-surface p-1.5 shadow-shadow-md">
        <button
          type="button"
          onClick={() => dispatch({ type: "PREVIOUS_PAGE" })}
          disabled={viewerState.currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="flex h-8 w-8 items-center justify-center rounded-md text-text transition hover:bg-border disabled:opacity-30"
        >
          ↑
        </button>

        <span className="text-xs font-semibold text-text">
          {viewerState.currentPage}
        </span>

        <span className="text-[10px] text-text-secondary">
          / {viewerState.totalPages}
        </span>

        <button
          type="button"
          onClick={() => dispatch({ type: "NEXT_PAGE" })}
          disabled={viewerState.currentPage >= viewerState.totalPages}
          aria-label="Halaman berikutnya"
          className="flex h-8 w-8 items-center justify-center rounded-md text-text transition hover:bg-border disabled:opacity-30"
        >
          ↓
        </button>

        <div className="my-1 h-px w-full bg-border" />

        <button
          type="button"
          onClick={() => dispatch({ type: "ZOOM_IN" })}
          disabled={viewerState.zoom >= 200}
          aria-label="Perbesar PDF"
          className="flex h-8 w-8 items-center justify-center rounded-md text-text transition hover:bg-border disabled:opacity-30"
        >
          +
        </button>

        <span className="text-[10px] font-semibold text-text">
          {viewerState.zoom}%
        </span>

        <button
          type="button"
          onClick={() => dispatch({ type: "ZOOM_OUT" })}
          disabled={viewerState.zoom <= 50}
          aria-label="Perkecil PDF"
          className="flex h-8 w-8 items-center justify-center rounded-md text-text transition hover:bg-border disabled:opacity-30"
        >
          −
        </button>
      </div>
    </div>
  );
}
