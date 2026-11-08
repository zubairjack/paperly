"use client";

import { useEffect, useRef, useState } from "react";

export default function PageSidebar({ file, currentPage, onPageSelect }) {
  const [thumbnails, setThumbnails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Referensi thumbnail halaman yang sedang aktif
  const activeThumbnailRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setThumbnails([]);
      setError("");
      return;
    }

    let loadingTask = null;
    let isCancelled = false;

    const generateThumbnails = async () => {
      setIsLoading(true);
      setError("");
      setThumbnails([]);

      try {
        const pdfjsLib = await import("pdfjs-dist");

        if (isCancelled) return;

        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const arrayBuffer = await file.arrayBuffer();

        if (isCancelled) return;

        loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
        });

        const pdfDocument = await loadingTask.promise;

        if (isCancelled) return;

        const generatedThumbnails = [];

        for (
          let pageNumber = 1;
          pageNumber <= pdfDocument.numPages;
          pageNumber++
        ) {
          if (isCancelled) return;

          const page = await pdfDocument.getPage(pageNumber);

          if (isCancelled) return;

          const originalViewport = page.getViewport({ scale: 1 });
          const thumbnailWidth = 120;
          const scale = thumbnailWidth / originalViewport.width;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          await page.render({
            canvasContext: context,
            viewport,
          }).promise;

          if (isCancelled) return;

          generatedThumbnails.push({
            pageNumber,
            src: canvas.toDataURL("image/png"),
          });

          setThumbnails([...generatedThumbnails]);

          canvas.width = 0;
          canvas.height = 0;
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Gagal membuat thumbnail:", err);
          setError("Gagal memuat thumbnail PDF.");
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    generateThumbnails();

    return () => {
      isCancelled = true;

      if (loadingTask && typeof loadingTask.destroy === "function") {
        Promise.resolve(loadingTask.destroy()).catch(() => {});
      }
    };
  }, [file]);

  // Otomatis mengikuti thumbnail halaman aktif
  useEffect(() => {
    if (!activeThumbnailRef.current) return;

    activeThumbnailRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [currentPage, thumbnails]);

  return (
    <aside className="h-full bg-surface p-4">
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-text">Halaman</h2>

        <span className="text-xs text-text-secondary">
          {thumbnails.length} halaman
        </span>
      </div>

      {/* LOADING */}
      {isLoading && thumbnails.length === 0 && (
        <p className="mt-5 text-center text-xs text-text-secondary">
          Membuat thumbnail PDF...
        </p>
      )}

      {/* ERROR */}
      {error && (
        <p className="mt-5 text-center text-xs text-red-500">{error}</p>
      )}

      {/* EMPTY STATE */}
      {!file && (
        <p className="mt-5 text-center text-xs text-text-secondary">
          Upload PDF untuk melihat halaman.
        </p>
      )}

      {/* PAGE LIST */}
      <div className="mt-5 space-y-4">
        {thumbnails.map((thumbnail) => {
          const isActive = currentPage === thumbnail.pageNumber;

          return (
            <button
              key={thumbnail.pageNumber}
              ref={isActive ? activeThumbnailRef : null}
              type="button"
              onClick={() => onPageSelect(thumbnail.pageNumber)}
              aria-pressed={isActive}
              className={`w-full rounded-md border p-2 transition ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border bg-surface hover:border-primary"
              }`}
            >
              {/* THUMBNAIL PDF */}
              <div className="mx-auto flex justify-center overflow-hidden bg-white shadow-shadow-sm">
                <img
                  src={thumbnail.src}
                  alt={`Thumbnail halaman ${thumbnail.pageNumber}`}
                  className="block h-auto w-full max-w-32 object-contain"
                />
              </div>

              {/* PAGE NUMBER */}
              <p className="mt-2 text-xs font-semibold text-text">
                Halaman {thumbnail.pageNumber}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
