import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import type { CanvasImageProps, CanvasImageRef, PixelColor, PixelCoords } from "../interfaceOrType/interfaceOrType";

export const CanvasImage = forwardRef<CanvasImageRef, CanvasImageProps>(
  ({ src, width, height, useOriginalCoords = true, onClickPixel, onHoverPixel, onCanvasReady }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imageSrc, setImageSrc] = useState<string>("");
    const [imgMeta, setImgMeta] = useState<{
      naturalWidth: number;
      naturalHeight: number;
      finalWidth: number;
      finalHeight: number;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getContext: () => canvasRef.current?.getContext("2d") ?? null,
    }));

    useEffect(() => {
      if (!src) return;

      if (src instanceof File) {
        const objectUrl = URL.createObjectURL(src);
        setImageSrc(objectUrl);

        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } else {
        setImageSrc(src);
        return undefined;
      }
    }, [src]);

    const getPixelColor = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number
    ): PixelColor => {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      const hex = `#${(
        (1 << 24) +
        (pixel[0] << 16) +
        (pixel[1] << 8) +
        pixel[2]
      )
        .toString(16)
        .slice(1)}`;
      return { rgb, hex };
    };

    useEffect(() => {
      if (!imageSrc || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.src = imageSrc;

      img.onload = () => {
        let finalWidth = width ?? img.naturalWidth;
        let finalHeight = height ?? img.naturalHeight;

        if (width && !height) {
          finalHeight = Math.floor(
            (img.naturalHeight / img.naturalWidth) * width
          );
        }
        if (!width && height) {
          finalWidth = Math.floor(
            (img.naturalWidth / img.naturalHeight) * height
          );
        }

        canvasRef.current!.width = finalWidth;
        canvasRef.current!.height = finalHeight;

        ctx.clearRect(0, 0, finalWidth, finalHeight);
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

        setImgMeta({
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          finalWidth,
          finalHeight,
        });

        onCanvasReady?.(ctx, canvasRef.current!);
      };
    }, [imageSrc, width, height, onCanvasReady]);

    const mapToOriginalCoords = (x: number, y: number): PixelCoords => {
      if (!imgMeta) return { x, y };
      const scaleX = imgMeta.naturalWidth / imgMeta.finalWidth;
      const scaleY = imgMeta.naturalHeight / imgMeta.finalHeight;
      return {
        x: Math.floor(x * scaleX),
        y: Math.floor(y * scaleY),
      };
    };

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !onClickPixel || !imgMeta) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const coords = useOriginalCoords ? mapToOriginalCoords(x, y) : { x, y };
      const color = getPixelColor(ctx, x, y);
      onClickPixel(coords, color);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !onHoverPixel || !imgMeta) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.floor(e.clientX - rect.left);
      const y = Math.floor(e.clientY - rect.top);
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const coords = useOriginalCoords ? mapToOriginalCoords(x, y) : { x, y };
      const color = getPixelColor(ctx, x, y);
      onHoverPixel(coords, color);
    };

    return (
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        style={{ border: "1px solid black", cursor: "crosshair" }}
      />
    );
  }
);

CanvasImage.displayName = "CanvasImage";
