import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, } from "react";
import type { CanvasImageProps, CanvasImageRef, PixelCoords, PixelEventHandler, ImageMeta, } from "../interfaceOrType/interfaceOrType";

export const CanvasImage = forwardRef<CanvasImageRef, CanvasImageProps>(
  ({ src, width, height, useOriginalCoords = true, onCanvasReady, ...restProps }, ref) => {

    const canvasProps = Object.fromEntries(
      Object.entries(restProps).filter(
        ([key]) => !(key.endsWith("Pixel") || key === "divClassName" || key === "divStyle" || key === "style")
      )
    );

    const divClassName: string | undefined = restProps.divClassName;
    const divStyle: React.CSSProperties | undefined = restProps.divStyle;
    const canvas_style: React.CSSProperties | undefined = restProps.style;

    const [shiftPressed, setShiftPressed] = useState(false);
    const [zoom, setZoom] = useState<number>(1);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
    const [imgMeta, setImgMeta] = useState<ImageMeta | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const offscreenRef = useRef<HTMLCanvasElement | null>(null);
    const lastPosRef = useRef({ x: 0, y: 0 });
    const objectUrlRef = useRef<string | null>(null);

    useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => e.key === "Shift" && setShiftPressed(true);
      const onKeyUp = (e: KeyboardEvent) => e.key === "Shift" && setShiftPressed(false);
      const onWindowBlur = () => {
        setShiftPressed(false);
        setIsDragging(false);
      };
      const onVisibility = () => document.hidden && setShiftPressed(false);

      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      window.addEventListener("blur", onWindowBlur);
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
        window.removeEventListener("blur", onWindowBlur);
        document.removeEventListener("visibilitychange", onVisibility);
      };
    }, []);

    useEffect(() => {
      const onGlobalUp = () => setIsDragging(false);
      window.addEventListener("mouseup", onGlobalUp);
      window.addEventListener("pointerup", onGlobalUp);
      return () => {
        window.removeEventListener("mouseup", onGlobalUp);
        window.removeEventListener("pointerup", onGlobalUp);
      };
    }, []);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
      getContext: () => canvasRef.current?.getContext("2d") ?? null,
    }));

    useEffect(() => {
      if (!src) return;
      const img = new Image();
      if (src instanceof File) {
        const objectUrl = URL.createObjectURL(src);
        objectUrlRef.current = objectUrl;
        img.src = objectUrl;
      } else {
        img.src = src;
      }
      img.onload = () => {
        let finalWidth = width ?? img.naturalWidth;
        let finalHeight = height ?? img.naturalHeight;
        if (width && !height) finalHeight = Math.floor((img.naturalHeight / img.naturalWidth) * width);
        if (!width && height) finalWidth = Math.floor((img.naturalWidth / img.naturalHeight) * height);
        setImgMeta({ naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, finalWidth, finalHeight });
        setImageObj(img);
      };
      return () => {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
          objectUrlRef.current = null;
        }
      };
    }, [src, width, height]);

    useEffect(() => {
      if (!imageObj || !imgMeta) return;
      const off = document.createElement("canvas");
      off.width = imgMeta.finalWidth;
      off.height = imgMeta.finalHeight;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;
      offCtx.drawImage(imageObj, 0, 0, imgMeta.finalWidth, imgMeta.finalHeight);
      offscreenRef.current = off;
    }, [imageObj, imgMeta]);

    useEffect(() => {
      if (!canvasRef.current || !imageObj || !imgMeta) return;
      const canvas = canvasRef.current;
      const visibleW = Math.max(1, Math.round(imgMeta.finalWidth * zoom));
      const visibleH = Math.max(1, Math.round(imgMeta.finalHeight * zoom));
      canvas.width = visibleW;
      canvas.height = visibleH;
      canvas.style.width = `${visibleW}px`;
      canvas.style.height = `${visibleH}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, visibleW, visibleH);
      ctx.drawImage(imageObj, 0, 0, visibleW, visibleH);
      onCanvasReady?.(ctx, canvas);
    }, [imageObj, imgMeta, zoom, onCanvasReady]);

    const mapToOriginalCoords = (x: number, y: number): PixelCoords => {
      if (!imgMeta) return { x, y };
      const scaleX = imgMeta.naturalWidth / imgMeta.finalWidth;
      const scaleY = imgMeta.naturalHeight / imgMeta.finalHeight;
      return { x: Math.floor(x * scaleX), y: Math.floor(y * scaleY) };
    };

    function firePixelEvent<T extends React.SyntheticEvent<HTMLCanvasElement>>(
      handler: PixelEventHandler<T> | undefined,
      e: T
    ) {
      if (!handler || !imgMeta || !offscreenRef.current || !containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const clientX = (e as any).clientX ?? (e as any).touches?.[0]?.clientX;
      const clientY = (e as any).clientY ?? (e as any).touches?.[0]?.clientY;
      if (clientX == null || clientY == null) return;
      const imageX = (clientX - containerRect.left - offset.x) / zoom;
      const imageY = (clientY - containerRect.top - offset.y) / zoom;
      const ix = Math.floor(imageX);
      const iy = Math.floor(imageY);
      if (ix < 0 || iy < 0 || ix >= imgMeta.finalWidth || iy >= imgMeta.finalHeight) return;
      const offCtx = offscreenRef.current.getContext("2d");
      if (!offCtx) return;
      const pixel = offCtx.getImageData(ix, iy, 1, 1).data;
      const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1)}`;
      const coords = useOriginalCoords ? mapToOriginalCoords(ix, iy) : { x: ix, y: iy };
      handler(coords, { rgb, hex }, e);
    }

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      if (!e.shiftKey || !imgMeta || !containerRef.current) return;
      e.preventDefault();
      const containerRect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;
      const imageX = (clientX - containerRect.left - offset.x) / zoom;
      const imageY = (clientY - containerRect.top - offset.y) / zoom;
      const zoomStep = 0.1;
      const newZoom = e.deltaY < 0 ? Math.min(zoom + zoomStep, 10) : Math.max(zoom - zoomStep, 0.1);
      const newOffsetX = clientX - containerRect.left - imageX * newZoom;
      const newOffsetY = clientY - containerRect.top - imageY * newZoom;
      setZoom(newZoom);
      setOffset({ x: newOffsetX, y: newOffsetY });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      setShiftPressed(e.shiftKey);
      if (!isDragging) return;
      const dx = e.clientX - lastPosRef.current.x;
      const dy = e.clientY - lastPosRef.current.y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!e.shiftKey || e.button !== 2) return;
      e.preventDefault();
      setIsDragging(true);
      lastPosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => isDragging && setIsDragging(false);

    const computedCursor = shiftPressed ? (isDragging ? "grabbing" : "grab") : "crosshair";

    return (
      <div
        ref={containerRef}
        className={divClassName}
        style={{
          width: imgMeta?.finalWidth ? `${imgMeta.finalWidth}px` : undefined,
          height: imgMeta?.finalHeight ? `${imgMeta.finalHeight}px` : undefined,
          overflow: "hidden",
          border: "1px solid #ccc",
          position: "relative",
          touchAction: "none",
          cursor: computedCursor,
          ...divStyle,
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={(e) => e.shiftKey && e.preventDefault()}
      >
        <canvas
          ref={canvasRef}
          style={{
            ...canvas_style,
            display: "block",
            cursor: computedCursor,
            position: "absolute",
            left: `${offset.x}px`,
            top: `${offset.y}px`,
          }}
          onClick={(e) => firePixelEvent(restProps.onClickPixel, e)}
          onContextMenu={(e) => firePixelEvent(restProps.onContextMenuPixel, e)}
          onDoubleClick={(e) => firePixelEvent(restProps.onDoubleClickPixel, e)}
          onMouseMove={(e) => {
            firePixelEvent(restProps.onMouseMovePixel, e);
            firePixelEvent(restProps.onHoverPixel, e);
          }}
          {...canvasProps}
        />
      </div>
    );
  }
);

CanvasImage.displayName = "CanvasImage";
