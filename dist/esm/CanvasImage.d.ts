import React from "react";
export type PixelCoords = {
    x: number;
    y: number;
};
export type PixelColor = {
    rgb: string;
    hex: string;
};
export interface CanvasImageProps {
    src: string | File;
    width?: number;
    height?: number;
    onClickPixel?: (coords: PixelCoords, color: PixelColor) => void;
    onHoverPixel?: (coords: PixelCoords, color: PixelColor) => void;
    onCanvasReady?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}
export interface CanvasImageRef {
    getCanvas: () => HTMLCanvasElement | null;
    getContext: () => CanvasRenderingContext2D | null;
}
export declare const CanvasImage: React.ForwardRefExoticComponent<CanvasImageProps & React.RefAttributes<CanvasImageRef>>;
