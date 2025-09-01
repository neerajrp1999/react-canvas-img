"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasImage = void 0;
const react_1 = __importStar(require("react"));
exports.CanvasImage = (0, react_1.forwardRef)(({ src, width, height, onClickPixel, onHoverPixel, onCanvasReady }, ref) => {
    const canvasRef = (0, react_1.useRef)(null);
    const [imageSrc, setImageSrc] = (0, react_1.useState)("");
    (0, react_1.useImperativeHandle)(ref, () => ({
        getCanvas: () => canvasRef.current,
        getContext: () => { var _a, _b; return (_b = (_a = canvasRef.current) === null || _a === void 0 ? void 0 : _a.getContext("2d")) !== null && _b !== void 0 ? _b : null; },
    }));
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
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
            onCanvasReady === null || onCanvasReady === void 0 ? void 0 : onCanvasReady(ctx, canvasRef.current);
        };
    }, [imageSrc, width, height, onCanvasReady]);
    const handleClick = (e) => {
        if (!canvasRef.current || !onClickPixel)
            return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx)
            return;
        const color = getPixelColor(ctx, x, y);
        onClickPixel({ x, y }, color);
    };
    const handleMouseMove = (e) => {
        if (!canvasRef.current || !onHoverPixel)
            return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx)
            return;
        const color = getPixelColor(ctx, x, y);
        onHoverPixel({ x, y }, color);
    };
    return (react_1.default.createElement("canvas", { ref: canvasRef, onClick: handleClick, onMouseMove: handleMouseMove, style: { border: "1px solid black", cursor: "crosshair" } }));
});
exports.CanvasImage.displayName = "CanvasImage";
