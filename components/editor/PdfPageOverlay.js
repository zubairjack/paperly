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
}) {
  const dragRef = useRef(null);

  // Menambahkan objek teks
  const handleOverlayClick = (event) => {
    if (activeTool !== "text") return;

    if (event.target.closest("[data-editor-object]")) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

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
  };

  // Memulai Move atau Resize
  const handlePointerDown = (event) => {
    if (activeTool !== "select") return;
    if (event.button !== 0) return;

    const resizeHandle = event.target.closest("[data-resize-handle]");

    const objectElement = event.target.closest("[data-editor-object]");

    if (!objectElement) return;

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
      startX: event.clientX,
      startY: event.clientY,
      originalX: object.x,
      originalY: object.y,
      originalWidth: object.width,
      originalHeight: object.height,
      pageWidth: rect.width,
      pageHeight: rect.height,
    };

    overlay.setPointerCapture(event.pointerId);
  };

  // Memproses gerakan mouse
  const handlePointerMove = (event) => {
    const drag = dragRef.current;

    if (!drag) return;

    const deltaX = ((event.clientX - drag.startX) / drag.pageWidth) * 100;

    const deltaY = ((event.clientY - drag.startY) / drag.pageHeight) * 100;

    if (drag.mode === "move") {
      const maxX = Math.max(0, 100 - drag.originalWidth);
      const maxY = Math.max(0, 100 - drag.originalHeight);

      const newX = Math.max(0, Math.min(maxX, drag.originalX + deltaX));

      const newY = Math.max(0, Math.min(maxY, drag.originalY + deltaY));

      onUpdateObject(drag.objectId, {
        x: newX,
        y: newY,
      });

      return;
    }

    if (drag.mode === "resize") {
      const maxWidth = 100 - drag.originalX;
      const maxHeight = 100 - drag.originalY;

      const newWidth = Math.max(
        5,
        Math.min(maxWidth, drag.originalWidth + deltaX),
      );

      const newHeight = Math.max(
        3,
        Math.min(maxHeight, drag.originalHeight + deltaY),
      );

      onUpdateObject(drag.objectId, {
        width: newWidth,
        height: newHeight,
      });
    }
  };

  // Mengakhiri Move atau Resize
  const handlePointerUp = () => {
    dragRef.current = null;
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

          return (
            <div
              key={object.id}
              data-editor-object={object.id}
              className={`absolute p-1 text-sm text-black ${
                activeTool === "select" ? "cursor-move" : "cursor-text"
              } ${
                isSelected
                  ? "border-2 border-primary bg-blue-50/90"
                  : "border border-dashed border-primary bg-white/90"
              }`}
              style={{
                left: `${object.x}%`,
                top: `${object.y}%`,
                width: `${object.width}%`,
                height: `${object.height}%`,
                pointerEvents: "auto",
              }}
            >
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
                className="h-full min-h-8 w-full resize-none border-0 bg-transparent p-0 text-sm text-black outline-none"
              />

              {/* Handle Resize */}
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
