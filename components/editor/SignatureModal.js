"use client";

import { useEffect, useRef, useState } from "react";

export default function SignatureModal({ onClose, onSave }) {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const isDrawingRef = useRef(false);
  const cropActionRef = useRef(null);
  const lastPositionRef = useRef(null);

  const [hasDrawing, setHasDrawing] = useState(false);
  const [sourceImage, setSourceImage] = useState(null);
  const [crop, setCrop] = useState(null);
  const [error, setError] = useState("");

  const [displaySize, setDisplaySize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    context.lineWidth = 4.5;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#222222";
  }, []);

  const getPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handlePointerDown = (event) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);

    const position = getPosition(event);

    isDrawingRef.current = true;
    setHasDrawing(true);
    setError("");

    context.beginPath();
    context.moveTo(position.x, position.y);
    context.lineTo(position.x + 0.1, position.y + 0.1);
    context.stroke();
  };

  const handlePointerMove = (event) => {
    if (!isDrawingRef.current) return;

    const context = canvasRef.current.getContext("2d");
    const position = getPosition(event);

    context.lineTo(position.x, position.y);
    context.stroke();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
    setError("");
  };

  const createCropPreview = (imageData) => {
    const image = new Image();

    image.onload = () => {
      imageRef.current = image;

      const maxWidth = 480;
      const maxHeight = 260;
      const scale = Math.min(
        maxWidth / image.width,
        maxHeight / image.height,
        1,
      );

      const width = Math.round(image.width * scale);
      const height = Math.round(image.height * scale);

      setDisplaySize({ width, height });

      setCrop({
        x: 0,
        y: 0,
        width,
        height,
      });

      setSourceImage(imageData);
      setError("");
    };

    image.onerror = () => {
      setError("Gambar tidak dapat dibaca.");
    };

    image.src = imageData;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (
      file.type !== "image/png" ||
      !file.name.toLowerCase().endsWith(".png")
    ) {
      setError("File harus menggunakan format PNG.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        createCropPreview(reader.result);
      }
    };

    reader.onerror = () => {
      setError("Gagal membaca file.");
    };

    reader.readAsDataURL(file);
  };

  const handleUseDrawing = () => {
    if (!hasDrawing) return;

    const imageData = canvasRef.current.toDataURL("image/png");
    createCropPreview(imageData);
  };

  const getCropPosition = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: Math.max(0, Math.min(displaySize.width, event.clientX - rect.left)),
      y: Math.max(0, Math.min(displaySize.height, event.clientY - rect.top)),
    };
  };

  const handleCropPointerDown = (event, action) => {
    event.preventDefault();
    event.stopPropagation();

    event.currentTarget.setPointerCapture(event.pointerId);

    cropActionRef.current = action;
    lastPositionRef.current = getCropPosition(event);
  };

  const handleCropPointerMove = (event) => {
    if (!cropActionRef.current || !crop) return;

    const position = getCropPosition(event);
    const last = lastPositionRef.current;

    const dx = position.x - last.x;
    const dy = position.y - last.y;

    setCrop((current) => {
      if (!current) return current;

      if (cropActionRef.current === "move") {
        return {
          ...current,
          x: Math.max(
            0,
            Math.min(displaySize.width - current.width, current.x + dx),
          ),
          y: Math.max(
            0,
            Math.min(displaySize.height - current.height, current.y + dy),
          ),
        };
      }

      const maxWidth = displaySize.width - current.x;
      const maxHeight = displaySize.height - current.y;

      return {
        ...current,
        width: Math.max(30, Math.min(maxWidth, current.width + dx)),
        height: Math.max(30, Math.min(maxHeight, current.height + dy)),
      };
    });

    lastPositionRef.current = position;
  };

  const handleCropPointerUp = () => {
    cropActionRef.current = null;
    lastPositionRef.current = null;
  };

  const handleResetCrop = () => {
    setCrop({
      x: 0,
      y: 0,
      width: displaySize.width,
      height: displaySize.height,
    });
  };

  const handleSaveCrop = () => {
    const image = imageRef.current;

    if (!image || !crop) return;

    const scaleX = image.width / displaySize.width;
    const scaleY = image.height / displaySize.height;

    const canvas = document.createElement("canvas");

    canvas.width = Math.max(1, Math.round(crop.width * scaleX));
    canvas.height = Math.max(1, Math.round(crop.height * scaleY));

    const context = canvas.getContext("2d");

    context.drawImage(
      image,
      Math.round(crop.x * scaleX),
      Math.round(crop.y * scaleY),
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    onSave(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-auto w-full max-w-xl rounded-xl border border-border-strong bg-surface p-5 shadow-shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-text">
              Tambahkan Tanda Tangan
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Gambar atau upload tanda tangan PNG.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-3 py-2 text-text hover:bg-border"
          >
            ✕
          </button>
        </div>

        {!sourceImage ? (
          <>
            <div className="mt-5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,image/png"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-md border-2 border-dashed border-primary bg-primary/5 px-4 py-4 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                ↑ Upload Tanda Tangan PNG
              </button>

              <p className="mt-2 text-center text-xs text-text-secondary">
                PNG · Maksimal 5 MB
              </p>
            </div>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-text-secondary">
                ATAU GAMBAR LANGSUNG
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="overflow-hidden rounded-lg border border-border-strong bg-white">
              <canvas
                ref={canvasRef}
                width={900}
                height={300}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="block h-auto w-full touch-none cursor-crosshair"
              />
            </div>

            <p className="mt-2 text-xs text-text-secondary">
              Gunakan mouse, trackpad, atau layar sentuh.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClear}
                disabled={!hasDrawing}
                className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-text disabled:opacity-40"
              >
                Hapus
              </button>

              <button
                type="button"
                onClick={handleUseDrawing}
                disabled={!hasDrawing}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                Lanjut ke Crop
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-5">
              <h3 className="text-sm font-bold text-text">Atur Area Crop</h3>
              <p className="mt-1 text-xs text-text-secondary">
                Geser kotak untuk memindahkan area crop. Tarik handle kanan
                bawah untuk mengubah ukurannya.
              </p>
            </div>

            <div
              className="relative mx-auto mt-4 touch-none select-none overflow-hidden bg-[linear-gradient(45deg,#e5e5e5_25%,transparent_25%),linear-gradient(-45deg,#e5e5e5_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e5e5e5_75%),linear-gradient(-45deg,transparent_75%,#e5e5e5_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
              style={{
                width: displaySize.width,
                height: displaySize.height,
              }}
              onPointerMove={handleCropPointerMove}
              onPointerUp={handleCropPointerUp}
              onPointerCancel={handleCropPointerUp}
            >
              <img
                src={sourceImage}
                alt="Tanda tangan untuk crop"
                draggable="false"
                className="pointer-events-none absolute inset-0 h-full w-full"
              />

              {crop && (
                <div
                  onPointerDown={(event) =>
                    handleCropPointerDown(event, "move")
                  }
                  className="absolute cursor-move border-2 border-primary bg-primary/10"
                  style={{
                    left: crop.x,
                    top: crop.y,
                    width: crop.width,
                    height: crop.height,
                  }}
                >
                  <div className="absolute inset-0 border border-white/80" />

                  <div
                    onPointerDown={(event) =>
                      handleCropPointerDown(event, "resize")
                    }
                    className="absolute -bottom-2 -right-2 h-5 w-5 cursor-nwse-resize rounded-full border-2 border-white bg-primary shadow"
                  />
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setSourceImage(null);
                  setCrop(null);
                  setError("");
                }}
                className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-text"
              >
                Kembali
              </button>

              <button
                type="button"
                onClick={handleResetCrop}
                className="rounded-md border border-border px-3 py-2 text-xs font-semibold text-text"
              >
                Reset Crop
              </button>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-text"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSaveCrop}
                disabled={!crop}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                Crop & Gunakan
              </button>
            </div>
          </>
        )}

        {error && (
          <p role="alert" className="mt-3 text-xs font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
