var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef, } from "react";
export const CanvasImage = forwardRef((_a, ref) => {
    var { src, width, height, useOriginalCoords = true, onCanvasReady } = _a, restProps = __rest(_a, ["src", "width", "height", "useOriginalCoords", "onCanvasReady"]);
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
            return () => URL.revokeObjectURL(objectUrl);
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
            return undefined;
        };
    }, [imageSrc, width, height, onCanvasReady]);
    const mapToOriginalCoords = (x, y) => {
        if (!imgMeta)
            return { x, y };
        const scaleX = imgMeta.naturalWidth / imgMeta.finalWidth;
        const scaleY = imgMeta.naturalHeight / imgMeta.finalHeight;
        return { x: Math.floor(x * scaleX), y: Math.floor(y * scaleY) };
    };
    function firePixelEvent(handler, e) {
        var _a, _b, _c, _d, _e, _f;
        if (!canvasRef.current || !imgMeta || !handler)
            return;
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        const client = (_a = e.clientX) !== null && _a !== void 0 ? _a : (_c = (_b = e.touches) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.clientX;
        const clientY = (_d = e.clientY) !== null && _d !== void 0 ? _d : (_f = (_e = e.touches) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.clientY;
        if (client == null || clientY == null)
            return;
        const x = Math.floor((client - rect.left) * scaleX);
        const y = Math.floor((clientY - rect.top) * scaleY);
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx)
            return;
        const coords = useOriginalCoords ? mapToOriginalCoords(x, y) : { x, y };
        const color = getPixelColor(ctx, x, y);
        handler(coords, color, e);
    }
    return (React.createElement("canvas", Object.assign({ ref: canvasRef, onClick: (e) => firePixelEvent(restProps.onClickPixel, e), onContextMenu: (e) => firePixelEvent(restProps.onContextMenuPixel, e), onDoubleClick: (e) => firePixelEvent(restProps.onDoubleClickPixel, e), onDrag: (e) => firePixelEvent(restProps.onDragPixel, e), onDragEnd: (e) => firePixelEvent(restProps.onDragEndPixel, e), onDragEnter: (e) => firePixelEvent(restProps.onDragEnterPixel, e), onDragExit: (e) => firePixelEvent(restProps.onDragExitPixel, e), onDragLeave: (e) => firePixelEvent(restProps.onDragLeavePixel, e), onDragOver: (e) => firePixelEvent(restProps.onDragOverPixel, e), onDragStart: (e) => firePixelEvent(restProps.onDragStartPixel, e), onDrop: (e) => firePixelEvent(restProps.onDropPixel, e), onMouseDown: (e) => firePixelEvent(restProps.onMouseDownPixel, e), onMouseUp: (e) => firePixelEvent(restProps.onMouseUpPixel, e), onMouseEnter: (e) => firePixelEvent(restProps.onMouseEnterPixel, e), onMouseLeave: (e) => firePixelEvent(restProps.onMouseLeavePixel, e), onMouseMove: (e) => {
            firePixelEvent(restProps.onMouseMovePixel, e);
            firePixelEvent(restProps.onHoverPixel, e);
        }, onMouseOut: (e) => firePixelEvent(restProps.onMouseOutPixel, e), onMouseOver: (e) => firePixelEvent(restProps.onMouseOverPixel, e), onKeyDown: (e) => firePixelEvent(restProps.onKeyDownPixel, e), onKeyPress: (e) => firePixelEvent(restProps.onKeyPressPixel, e), onKeyUp: (e) => firePixelEvent(restProps.onKeyUpPixel, e), onFocus: (e) => firePixelEvent(restProps.onFocusPixel, e), onBlur: (e) => firePixelEvent(restProps.onBlurPixel, e), onPointerDown: (e) => firePixelEvent(restProps.onPointerDownPixel, e), onPointerMove: (e) => firePixelEvent(restProps.onPointerMovePixel, e), onPointerUp: (e) => firePixelEvent(restProps.onPointerUpPixel, e), onPointerCancel: (e) => firePixelEvent(restProps.onPointerCancelPixel, e), onGotPointerCapture: (e) => firePixelEvent(restProps.onGotPointerCapturePixel, e), onLostPointerCapture: (e) => firePixelEvent(restProps.onLostPointerCapturePixel, e), onPointerEnter: (e) => firePixelEvent(restProps.onPointerEnterPixel, e), onPointerLeave: (e) => firePixelEvent(restProps.onPointerLeavePixel, e), onPointerOver: (e) => firePixelEvent(restProps.onPointerOverPixel, e), onPointerOut: (e) => firePixelEvent(restProps.onPointerOutPixel, e), onTouchStart: (e) => firePixelEvent(restProps.onTouchStartPixel, e), onTouchMove: (e) => firePixelEvent(restProps.onTouchMovePixel, e), onTouchEnd: (e) => firePixelEvent(restProps.onTouchEndPixel, e), onTouchCancel: (e) => firePixelEvent(restProps.onTouchCancelPixel, e), onWheel: (e) => firePixelEvent(restProps.onWheelPixel, e), onScroll: (e) => firePixelEvent(restProps.onScrollPixel, e), onCopy: (e) => firePixelEvent(restProps.onCopyPixel, e), onCut: (e) => firePixelEvent(restProps.onCutPixel, e), onPaste: (e) => firePixelEvent(restProps.onPastePixel, e) }, restProps)));
});
CanvasImage.displayName = "CanvasImage";
