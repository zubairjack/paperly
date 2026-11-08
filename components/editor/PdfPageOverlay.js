"use client";

import { useRef } from "react";

const generateId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `object-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export default function PdfPageOverlay({
  pageNumber,
  objects = [],
  activeTool,
  selectedObjectId,
  onSelectObject,
  onAddObject,
  onUpdateObject,
  selectedStamp,
}) {
  const dragRef = useRef(null);

  const handleOverlayClick = (event) => {
    if (event.target.closest("[data-editor-object]")) return;

    if (activeTool !== "text" && activeTool !== "stamp") return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    // Menambahkan objek teks
    if (activeTool === "text") {
      onAddObject({
        id: generateId(),
        type: "text",
        pageNumber,
        x,
        y,
        width: 25,
        height: 6,
        content: "Teks baru",
      });

      return;
    }

    // Menambahkan objek stempel
    if (activeTool === "stamp" && selectedStamp) {
      onAddObject({
        id: generateId(),
        type: "stamp",
        pageNumber,
        x: Math.max(0, Math.min(100 - 30, x - 15)),
        y: Math.max(0, Math.min(100 - 10, y - 5)),
        width: 30,
        height: 10,
        content: selectedStamp.label,
        stampLabel: selectedStamp.label,
        stampColor: selectedStamp.color,
        stampShape: selectedStamp.shape,
        stampDescription: selectedStamp.description,
      });

      onSelectObject(null);

      return;
    }
  };

  const handlePointerDown = (event) => {
    if (activeTool !== "select") return;
    if (event.button !== 0) return;

    const resizeHandle = event.target.closest("[data-resize-handle]");
    const objectElement = event.target.closest("[data-editor-object]");

    // Klik area kosong untuk membatalkan seleksi.
    if (!objectElement) {
      onSelectObject(null);
      return;
    }

    const objectId = objectElement.dataset.editorObject;
    const object = objects.find((item) => item.id === objectId);

    if (!object) return;

    event.preventDefault();
    event.stopPropagation();

    onSelectObject(object.id);

    const overlay = event.currentTarget;
    const rect = overlay.getBoundingClientRect();

    dragRef.current = {
      mode: resizeHandle ? "resize" : "move",
      objectId: object.id,
      isSignature: object.type === "signature",
      startX: event.clientX,
      startY: event.clientY,
      originalX: object.x,
      originalY: object.y,
      originalWidth: object.width,
      originalHeight: object.height,
      pageWidth: rect.width,
      pageHeight: rect.height,
      aspectRatio: (object.width * rect.width) / (object.height * rect.height),
    };

    overlay.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;

    if (!drag) return;

    const deltaX = ((event.clientX - drag.startX) / drag.pageWidth) * 100;

    const deltaY = ((event.clientY - drag.startY) / drag.pageHeight) * 100;

    if (drag.mode === "move") {
      const maxX = Math.max(0, 100 - drag.originalWidth);
      const maxY = Math.max(0, 100 - drag.originalHeight);

      onUpdateObject(drag.objectId, {
        x: Math.max(0, Math.min(maxX, drag.originalX + deltaX)),
        y: Math.max(0, Math.min(maxY, drag.originalY + deltaY)),
      });

      return;
    }

    if (drag.mode === "resize") {
      let newWidth = drag.originalWidth + deltaX;
      let newHeight = drag.originalHeight + deltaY;

      if (drag.isSignature) {
        // Tanda tangan tetap mempertahankan rasio gambar.
        const ratio = drag.aspectRatio;

        const maxWidthByPage = 100 - drag.originalX;

        const maxWidthByHeight =
          ((100 - drag.originalY) * drag.pageHeight * ratio) / drag.pageWidth;

        const maxWidth = Math.min(maxWidthByPage, maxWidthByHeight);

        newWidth = Math.max(2, Math.min(maxWidth, newWidth));

        newHeight = (newWidth * drag.pageWidth) / (ratio * drag.pageHeight);
      } else {
        // Objek teks bebas diubah lebar dan tingginya.
        newWidth = Math.max(2, Math.min(100 - drag.originalX, newWidth));

        newHeight = Math.max(2, Math.min(100 - drag.originalY, newHeight));
      }

      onUpdateObject(drag.objectId, {
        width: newWidth,
        height: newHeight,
      });
    }
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleSignatureLoad = (event, object) => {
    if (object.aspectRatioAdjusted) return;

    const image = event.currentTarget;
    const overlay = image.parentElement.parentElement;
    const rect = overlay.getBoundingClientRect();

    if (!image.naturalWidth || !image.naturalHeight) return;

    // Menghitung rasio gambar tanda tangan
    const imageRatio = image.naturalWidth / image.naturalHeight;

    // Menghitung lebar objek dalam pixel
    const objectWidthPx = (object.width / 100) * rect.width;

    // Menghitung tinggi berdasarkan rasio gambar
    const objectHeightPx = objectWidthPx / imageRatio;

    // Mengubah tinggi pixel menjadi persentase halaman
    const newHeight = (objectHeightPx / rect.height) * 100;

    onUpdateObject(object.id, {
      height: newHeight,
      aspectRatioAdjusted: true,
    });
  };

  return (
    <div
      className={`absolute inset-0 ${
        activeTool === "text" ? "cursor-text" : ""
      }`}
      onClick={handleOverlayClick}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {objects
        .filter((object) => object.pageNumber === pageNumber)
        .map((object) => {
          const isSelected = selectedObjectId === object.id;
          const isSignature = object.type === "signature";

          return (
            <div
              key={object.id}
              data-editor-object={object.id}
              className={`absolute ${
                activeTool === "select" ||
                (activeTool === "text" && object.type === "text")
                  ? "cursor-move"
                  : "cursor-default"
              } ${
                isSelected &&
                (activeTool === "select" ||
                  (activeTool === "text" && object.type === "text"))
                  ? "border-2 border-primary bg-blue-50/30"
                  : "border border-transparent"
              }`}
              style={{
                left: `${object.x}%`,
                top: `${object.y}%`,
                width: `${object.width}%`,
                height: `${object.height}%`,
                pointerEvents: "auto",
              }}
            >
              {isSignature ? (
                <img
                  src={object.content}
                  alt="Tanda tangan"
                  draggable="false"
                  onLoad={(event) => handleSignatureLoad(event, object)}
                  className="h-full w-full select-none object-fill"
                />
              ) : object.type === "stamp" ? (
                <div
                  className={`flex h-full w-full items-center justify-center border-[3px] px-2 text-center font-extrabold tracking-wider ${
                    object.stampShape === "round"
                      ? "rounded-full"
                      : "rounded-sm"
                  }`}
                  style={{
                    color: object.stampColor,
                    borderColor: object.stampColor,
                    opacity: object.opacity ?? 1,
                    transform: `rotate(${object.rotation ?? 0}deg)`,
                    fontSize: "clamp(8px, 1.2vw, 16px)",
                  }}
                >
                  {object.stampLabel}
                </div>
              ) : (
                <textarea
                  value={object.content}
                  readOnly={activeTool !== "text"}
                  onChange={(event) =>
                    onUpdateObject(object.id, {
                      content: event.target.value,
                    })
                  }
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                  aria-label="Edit teks PDF"
                  className="h-full min-h-8 w-full resize-none border-0 bg-transparent p-1 outline-none"
                  style={{
                    fontSize: `${object.fontSize ?? 14}px`,
                    color: object.color ?? "#000000",
                    fontWeight: object.fontWeight ?? "normal",
                    fontStyle: object.fontStyle ?? "normal",
                    textAlign: object.textAlign ?? "left",
                  }}
                />
              )}

              {isSelected && activeTool === "select" && (
                <div
                  data-resize-handle="true"
                  className="absolute -bottom-2 -right-2 z-10 h-4 w-4 cursor-nwse-resize rounded-sm border-2 border-white bg-primary shadow-md touch-none"
                  title="Tarik untuk mengubah ukuran"
                />
              )}
            </div>
          );
        })}
    </div>
  );
}
