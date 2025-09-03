import type { CanvasHTMLAttributes, DetailedHTMLProps } from "react";
export type PixelCoords = {
    x: number;
    y: number;
};
export type PixelColor = {
    rgb: string;
    hex: string;
};
export type PixelEventHandler<T extends React.SyntheticEvent<HTMLCanvasElement>> = (coords: PixelCoords, color: PixelColor, event: T) => void;
export interface CanvasImageProps extends DetailedHTMLProps<CanvasHTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
    src: string | File;
    width?: number;
    height?: number;
    useOriginalCoords?: boolean;
    divClassName?: string;
    divStyle?: React.CSSProperties;
    onClickPixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onHoverPixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onContextMenuPixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onDoubleClickPixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onDragPixel?: PixelEventHandler<React.DragEvent<HTMLCanvasElement>>;
    onDragEndPixel?: PixelEventHandler<React.DragEvent<HTMLCanvasElement>>;
    onDragEnterPixel?: PixelEventHandler<React.DragEvent<HTMLCanvasElement>>;
    onDragExitPixel?: PixelEventHandler<React.DragEvent<HTMLCanvasElement>>;
    onDragLeavePixel?: PixelEventHandler<React.DragEvent<HTMLCanvasElement>>;
    onDragOverPixel?: PixelEventHandler<React.DragEvent<HTMLCanvasElement>>;
    onDragStartPixel?: PixelEventHandler<React.DragEvent<HTMLCanvasElement>>;
    onDropPixel?: PixelEventHandler<React.DragEvent<HTMLCanvasElement>>;
    onMouseDownPixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onMouseEnterPixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onMouseLeavePixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onMouseMovePixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onMouseOutPixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onMouseOverPixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onMouseUpPixel?: PixelEventHandler<React.MouseEvent<HTMLCanvasElement>>;
    onKeyDownPixel?: PixelEventHandler<React.KeyboardEvent<HTMLCanvasElement>>;
    onKeyPressPixel?: PixelEventHandler<React.KeyboardEvent<HTMLCanvasElement>>;
    onKeyUpPixel?: PixelEventHandler<React.KeyboardEvent<HTMLCanvasElement>>;
    onFocusPixel?: PixelEventHandler<React.FocusEvent<HTMLCanvasElement>>;
    onBlurPixel?: PixelEventHandler<React.FocusEvent<HTMLCanvasElement>>;
    onPointerDownPixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onPointerMovePixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onPointerUpPixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onPointerCancelPixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onGotPointerCapturePixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onLostPointerCapturePixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onPointerEnterPixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onPointerLeavePixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onPointerOverPixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onPointerOutPixel?: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>;
    onTouchStartPixel?: PixelEventHandler<React.TouchEvent<HTMLCanvasElement>>;
    onTouchMovePixel?: PixelEventHandler<React.TouchEvent<HTMLCanvasElement>>;
    onTouchEndPixel?: PixelEventHandler<React.TouchEvent<HTMLCanvasElement>>;
    onTouchCancelPixel?: PixelEventHandler<React.TouchEvent<HTMLCanvasElement>>;
    onWheelPixel?: PixelEventHandler<React.WheelEvent<HTMLCanvasElement>>;
    onScrollPixel?: PixelEventHandler<React.UIEvent<HTMLCanvasElement>>;
    onCopyPixel?: PixelEventHandler<React.ClipboardEvent<HTMLCanvasElement>>;
    onCutPixel?: PixelEventHandler<React.ClipboardEvent<HTMLCanvasElement>>;
    onPastePixel?: PixelEventHandler<React.ClipboardEvent<HTMLCanvasElement>>;
    onCanvasReady?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}
export interface CanvasImageRef {
    getCanvas: () => HTMLCanvasElement | null;
    getContext: () => CanvasRenderingContext2D | null;
}
export interface ImageMeta {
    naturalWidth: number;
    naturalHeight: number;
    finalWidth: number;
    finalHeight: number;
}
