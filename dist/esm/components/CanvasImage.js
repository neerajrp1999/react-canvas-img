import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
export const CanvasImage = forwardRef(({ src, width, height, useOriginalCoords = true, onClickPixel, onHoverPixel, onCanvasReady }, ref) => {
    const canvasRef = useRef(null);
    const [imageSrc, setImageSrc] = useState("");
    const [imgMeta, setImgMeta] = useState(null);
    useImperativeHandle(ref, () => ({
        getCanvas: () => canvasRef.current,
        getContext: () => { var _a, _b; return (_b = (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext("2d")) !== null && _b !== void 0 ? _b : null; },
    }));
    useEffect(() => {
        if (!src)
            return;
        if (src instanceof File) {
            const objectUrl = URL.createObjectURL(src);
            setImageSrc(objectUrl);
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
        else {
            setImageSrc(src);
            return undefined;
        }
    }, [src]);
    const getPixelColor = (ctx, x, y) => {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
        const hex = `#${((1 << 24) +
            (pixel[0] << 16) +
            (pixel[1] << 8) +
            pixel[2])
            .toString(16)
            .slice(1)}`;
        return { rgb, hex };
    };
    useEffect(() => {
        if (!imageSrc || !canvasRef.current)
            return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx)
            return;
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            let finalWidth = width !== null && width !== void 0 ? width : img.naturalWidth;
            let finalHeight = height !== null && height !== void 0 ? height : img.naturalHeight;
            if (width && !height) {
                finalHeight = Math.floor((img.naturalHeight / img.naturalWidth) * width);
            }
            if (!width && height) {
                finalWidth = Math.floor((img.naturalWidth / img.naturalHeight) * height);
            }
            canvasRef.current.width = finalWidth;
            canvasRef.current.height = finalHeight;
            ctx.clearRect(0, 0, finalWidth, finalHeight);
            ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
            setImgMeta({
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                finalWidth,
                finalHeight,
            });
            onCanvasReady === null || onCanvasReady === void 0 ? void 0 : onCanvasReady(ctx, canvasRef.current);
        };
    }, [imageSrc, width, height, onCanvasReady]);
    const mapToOriginalCoords = (x, y) => {
        if (!imgMeta)
            return { x, y };
        const scaleX = imgMeta.naturalWidth / imgMeta.finalWidth;
        const scaleY = imgMeta.naturalHeight / imgMeta.finalHeight;
        return {
            x: Math.floor(x * scaleX),
            y: Math.floor(y * scaleY),
        };
    };
    const handleClick = (e) => {
        if (!canvasRef.current || !onClickPixel || !imgMeta)
            return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx)
            return;
        const coords = useOriginalCoords ? mapToOriginalCoords(x, y) : { x, y };
        const color = getPixelColor(ctx, x, y);
        onClickPixel(coords, color);
    };
    const handleMouseMove = (e) => {
        if (!canvasRef.current || !onHoverPixel || !imgMeta)
            return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx)
            return;
        const coords = useOriginalCoords ? mapToOriginalCoords(x, y) : { x, y };
        const color = getPixelColor(ctx, x, y);
        onHoverPixel(coords, color);
    };
    return (React.createElement("canvas", { ref: canvasRef, onClick: handleClick, onMouseMove: handleMouseMove, style: { border: "1px solid black", cursor: "crosshair" } }));
});
CanvasImage.displayName = "CanvasImage";
