"use client";

import { useEffect, useRef, useReducer, useState } from "react";

import {
  pdfViewerReducer,
  initialPdfViewerState,
} from "@/components/editor/reducers/pdfViewerReducer";

import PdfPageOverlay from "@/components/editor/PdfPageOverlay";

// ======================================================
// PDF PAGE
// ======================================================

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
  selectedStamp,
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
          selectedStamp={selectedStamp}
        />
      )}
    </div>
  );
}

// ======================================================
// PDF VIEWER
// ======================================================

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
  selectedStamp,
}) {
  const containerRef = useRef(null);

  // Menyimpan halaman terakhir agar scroll listener
  // tidak menggunakan nilai state yang sudah kedaluwarsa.
  const currentPageRef = useRef(1);

  // Menyimpan target navigasi saat scroll berlangsung.
  const pendingPageRef = useRef(null);

  const [viewerState, dispatch] = useReducer(
    pdfViewerReducer,
    initialPdfViewerState,
  );

  const [pdfDocument, setPdfDocument] = useState(null);
  const [loading, setLoading] = useState(false);

  // ====================================================
  // RESET VIEWER KETIKA FILE BERUBAH
  // ====================================================

  useEffect(() => {
    dispatch({ type: "RESET_VIEWER" });
    setPdfDocument(null);

    currentPageRef.current = 1;
    pendingPageRef.current = null;
  }, [file]);

  // ====================================================
  // MEMUAT PDF
  // ====================================================

  useEffect(() => {
    if (!file) {
      setPdfDocument(null);
      return;
    }

    let isCancelled = false;
    let loadingTask = null;

    const loadPdf = async () => {
      try {
        setLoading(true);

        const pdfjsLib = await import("pdfjs-dist");

        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const arrayBuffer = await file.arrayBuffer();

        if (isCancelled) return;

        loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
        });

        const pdf = await loadingTask.promise;

        if (isCancelled) {
          await pdf.destroy();
          return;
        }

        setPdfDocument(pdf);

        dispatch({
          type: "SET_TOTAL_PAGES",
          payload: pdf.numPages,
        });
      } catch (error) {
        if (!isCancelled) {
          console.error("Gagal memuat dokumen PDF:", error);
          setPdfDocument(null);
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

      if (loadingTask) {
        loadingTask.destroy();
      }
    };
  }, [file]);

  // ====================================================
  // FUNGSI NAVIGASI HALAMAN
  // ====================================================

  const goToPage = (pageNumber) => {
    if (!pdfDocument) return;

    const nextPage = Math.min(Math.max(pageNumber, 1), pdfDocument.numPages);

    currentPageRef.current = nextPage;
    pendingPageRef.current = nextPage;

    dispatch({
      type: "SET_CURRENT_PAGE",
      payload: nextPage,
    });

    // Beri tahu EditorWorkspace agar sidebar ikut berubah.
    onPageChange?.(nextPage);

    // Tunggu elemen halaman tersedia sebelum scroll.
    requestAnimationFrame(() => {
      const targetPage = containerRef.current?.querySelector(
        `[data-page-number="${nextPage}"]`,
      );

      if (targetPage) {
        targetPage.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  };

  // ====================================================
  // SINKRONISASI PILIHAN HALAMAN DARI SIDEBAR
  // ====================================================

  useEffect(() => {
    if (!pdfDocument || selectedPage === undefined) {
      return;
    }

    const nextPage = Math.min(Math.max(selectedPage, 1), pdfDocument.numPages);

    // Jika halaman sama, tidak perlu melakukan apa pun.
    if (nextPage === currentPageRef.current) {
      return;
    }

    currentPageRef.current = nextPage;
    pendingPageRef.current = nextPage;

    dispatch({
      type: "SET_CURRENT_PAGE",
      payload: nextPage,
    });

    const targetPage = containerRef.current?.querySelector(
      `[data-page-number="${nextPage}"]`,
    );

    targetPage?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [selectedPage, pdfDocument]);

  // ====================================================
  // DETEKSI HALAMAN AKTIF SAAT PDF DI-SCROLL MANUAL
  // ====================================================

  useEffect(() => {
    if (!pdfDocument) return;

    const viewerElement = containerRef.current;

    if (!viewerElement) return;

    // Cari elemen yang benar-benar memiliki overflow scroll.
    let scrollContainer = viewerElement.parentElement;

    while (scrollContainer && scrollContainer !== document.documentElement) {
      const style = window.getComputedStyle(scrollContainer);

      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        break;
      }

      scrollContainer = scrollContainer.parentElement;
    }

    if (!scrollContainer || scrollContainer === document.documentElement) {
      return;
    }

    let animationFrame = null;

    const detectActivePage = () => {
      const containerRect = scrollContainer.getBoundingClientRect();

      const activationLine =
        containerRect.top + Math.min(containerRect.height * 0.35, 180);

      const pages = Array.from(
        viewerElement.querySelectorAll("[data-page-number]"),
      );

      if (pages.length === 0) return;

      let activePage = pages.find((page) => {
        const rect = page.getBoundingClientRect();

        return rect.top <= activationLine && rect.bottom > activationLine;
      });

      if (!activePage) {
        activePage = pages.reduce((nearest, page) => {
          const distance = Math.abs(
            page.getBoundingClientRect().top - activationLine,
          );

          const nearestDistance = Math.abs(
            nearest.getBoundingClientRect().top - activationLine,
          );

          return distance < nearestDistance ? page : nearest;
        });
      }

      const pageNumber = Number(activePage.dataset.pageNumber);

      if (pageNumber <= 0) return;

      // Saat navigasi programatik sedang berlangsung,
      // abaikan halaman perantara selama animasi scroll.
      if (pendingPageRef.current !== null) {
        if (pageNumber !== pendingPageRef.current) {
          return;
        }

        // Target navigasi sudah terlihat.
        pendingPageRef.current = null;
      }

      if (pageNumber !== currentPageRef.current) {
        currentPageRef.current = pageNumber;

        dispatch({
          type: "SET_CURRENT_PAGE",
          payload: pageNumber,
        });

        onPageChange?.(pageNumber);
      }
    };

    const handleScroll = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(detectActivePage);
    };

    scrollContainer.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    detectActivePage();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [pdfDocument, onPageChange]);

  // ====================================================
  // TAMPILAN
  // ====================================================

  if (!file) return null;

  return (
    <div className="relative flex min-w-0 items-start">
      {/* AREA HALAMAN PDF */}

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
              selectedStamp={selectedStamp}
            />
          ))}
      </div>

      {/* PANEL NAVIGASI */}

      <div className="sticky top-4 z-30 mr-3 mt-4 flex w-12 shrink-0 flex-col items-center gap-1 rounded-lg border border-border bg-surface p-1.5 shadow-shadow-md">
        {/* HALAMAN SEBELUMNYA */}

        <button
          type="button"
          onClick={() => goToPage(viewerState.currentPage - 1)}
          disabled={!pdfDocument || viewerState.currentPage <= 1}
          aria-label="Halaman sebelumnya"
          className="flex h-8 w-8 items-center justify-center rounded-md text-text transition hover:bg-border disabled:opacity-30"
        >
          ↑
        </button>

        {/* NOMOR HALAMAN */}

        <span className="text-xs font-semibold text-text">
          {viewerState.currentPage}
        </span>

        <span className="text-[10px] text-text-secondary">
          / {viewerState.totalPages}
        </span>

        {/* HALAMAN BERIKUTNYA */}

        <button
          type="button"
          onClick={() => goToPage(viewerState.currentPage + 1)}
          disabled={
            !pdfDocument || viewerState.currentPage >= viewerState.totalPages
          }
          aria-label="Halaman berikutnya"
          className="flex h-8 w-8 items-center justify-center rounded-md text-text transition hover:bg-border disabled:opacity-30"
        >
          ↓
        </button>

        <div className="my-1 h-px w-full bg-border" />

        {/* ZOOM IN */}

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

        {/* ZOOM OUT */}

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
