import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import type {
  CanvasImageProps,
  CanvasImageRef,
  PixelColor,
  PixelCoords,
  PixelEventHandler,
} from "../interfaceOrType/interfaceOrType";

export const CanvasImage = forwardRef<CanvasImageRef, CanvasImageProps>(
  (
    {
      src,
      width,
      height,
      useOriginalCoords = true,
      onCanvasReady,
      ...restProps
    },
    ref
  ) => {
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
        return () => URL.revokeObjectURL(objectUrl);
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
        return undefined;
      };
    }, [imageSrc, width, height, onCanvasReady]);

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
      if (!canvasRef.current || !imgMeta || !handler) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;

      const client = (e as any).clientX ?? (e as any).touches?.[0]?.clientX;
      const clientY = (e as any).clientY ?? (e as any).touches?.[0]?.clientY;
      if (client == null || clientY == null) return;

      const x = Math.floor((client - rect.left) * scaleX);
      const y = Math.floor((clientY - rect.top) * scaleY);

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const coords = useOriginalCoords ? mapToOriginalCoords(x, y) : { x, y };
      const color = getPixelColor(ctx, x, y);

      handler(coords, color, e);
    }

    return (
      <canvas
        ref={canvasRef}
        // Mouse
        onClick={(e) => firePixelEvent(restProps.onClickPixel, e)}
        onContextMenu={(e) => firePixelEvent(restProps.onContextMenuPixel, e)}
        onDoubleClick={(e) => firePixelEvent(restProps.onDoubleClickPixel, e)}
        onDrag={(e) => firePixelEvent(restProps.onDragPixel, e)}
        onDragEnd={(e) => firePixelEvent(restProps.onDragEndPixel, e)}
        onDragEnter={(e) => firePixelEvent(restProps.onDragEnterPixel, e)}
        onDragExit={(e) => firePixelEvent(restProps.onDragExitPixel, e)}
        onDragLeave={(e) => firePixelEvent(restProps.onDragLeavePixel, e)}
        onDragOver={(e) => firePixelEvent(restProps.onDragOverPixel, e)}
        onDragStart={(e) => firePixelEvent(restProps.onDragStartPixel, e)}
        onDrop={(e) => firePixelEvent(restProps.onDropPixel, e)}
        onMouseDown={(e) => firePixelEvent(restProps.onMouseDownPixel, e)}
        onMouseUp={(e) => firePixelEvent(restProps.onMouseUpPixel, e)}
        onMouseEnter={(e) => firePixelEvent(restProps.onMouseEnterPixel, e)}
        onMouseLeave={(e) => firePixelEvent(restProps.onMouseLeavePixel, e)}
        onMouseMove={(e) => {
          firePixelEvent(restProps.onMouseMovePixel, e);
          firePixelEvent(restProps.onHoverPixel, e);
        }}
        onMouseOut={(e) => firePixelEvent(restProps.onMouseOutPixel, e)}
        onMouseOver={(e) => firePixelEvent(restProps.onMouseOverPixel, e)}
        // Keyboard
        onKeyDown={(e) => firePixelEvent(restProps.onKeyDownPixel, e)}
        onKeyPress={(e) => firePixelEvent(restProps.onKeyPressPixel, e)}
        onKeyUp={(e) => firePixelEvent(restProps.onKeyUpPixel, e)}
        // Focus
        onFocus={(e) => firePixelEvent(restProps.onFocusPixel, e)}
        onBlur={(e) => firePixelEvent(restProps.onBlurPixel, e)}
        // Pointer
        onPointerDown={(e) => firePixelEvent(restProps.onPointerDownPixel, e)}
        onPointerMove={(e) => firePixelEvent(restProps.onPointerMovePixel, e)}
        onPointerUp={(e) => firePixelEvent(restProps.onPointerUpPixel, e)}
        onPointerCancel={(e) =>
          firePixelEvent(restProps.onPointerCancelPixel, e)
        }
        onGotPointerCapture={(e) =>
          firePixelEvent(restProps.onGotPointerCapturePixel, e)
        }
        onLostPointerCapture={(e) =>
          firePixelEvent(restProps.onLostPointerCapturePixel, e)
        }
        onPointerEnter={(e) => firePixelEvent(restProps.onPointerEnterPixel, e)}
        onPointerLeave={(e) => firePixelEvent(restProps.onPointerLeavePixel, e)}
        onPointerOver={(e) => firePixelEvent(restProps.onPointerOverPixel, e)}
        onPointerOut={(e) => firePixelEvent(restProps.onPointerOutPixel, e)}
        // Touch
        onTouchStart={(e) => firePixelEvent(restProps.onTouchStartPixel, e)}
        onTouchMove={(e) => firePixelEvent(restProps.onTouchMovePixel, e)}
        onTouchEnd={(e) => firePixelEvent(restProps.onTouchEndPixel, e)}
        onTouchCancel={(e) => firePixelEvent(restProps.onTouchCancelPixel, e)}
        // Wheel & Scroll
        onWheel={(e) => firePixelEvent(restProps.onWheelPixel, e)}
        onScroll={(e) => firePixelEvent(restProps.onScrollPixel, e)}
        // Clipboard
        onCopy={(e) => firePixelEvent(restProps.onCopyPixel, e)}
        onCut={(e) => firePixelEvent(restProps.onCutPixel, e)}
        onPaste={(e) => firePixelEvent(restProps.onPastePixel, e)}
        {...restProps}
      />
    );
  }
);

CanvasImage.displayName = "CanvasImage";
