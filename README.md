# react-canvas-img 🎨

[![npm version](https://img.shields.io/npm/v/react-canvas-img.svg)](https://www.npmjs.com/package/react-canvas-img)
[![npm downloads](https://img.shields.io/npm/dt/react-canvas-img.svg)](https://www.npmjs.com/package/react-canvas-img)
[![license](https://img.shields.io/npm/l/react-canvas-img.svg)](./LICENSE)

A lightweight **React component** to load images into a `<canvas>` and read pixel data (color and coordinates) on hover or click.  
Fully written in **TypeScript** with support for refs, hooks, and callbacks.


## ✨ Features

- Load images into `<canvas>` easily
- Get pixel color + coordinates on **hover** and **click**
- Exposes canvas context and element via `onCanvasReady`
- Supports refs to call canvas methods
- Written in TypeScript – full type definitions included
- Lightweight, no external dependencies


## 📦 Installation

```bash
npm install react-canvas-img
# or
yarn add react-canvas-img
```


## 🚀 Usage

```tsx
import { useState } from "react";
import { CanvasImage, type PixelCoords, type PixelColor } from "react-canvas-img";

export default function App() {
  const [clickedPixel, setClickedPixel] = useState<{
    coords: PixelCoords;
    color: PixelColor;
  } | null>(null);

  return (
    <CanvasImage
      src="/sample.png"
      width={400}     // optional → if not given = auto
      height={300}    // optional → if not given = auto
      onClickPixel={(coords, color) => setClickedPixel({ coords, color })}
      onHoverPixel={(coords, color) => console.log("Hover:", coords, color)}
      onCanvasReady={(ctx) => {
        ctx.fillStyle = "red";
        ctx.fillText("Demo Text", 10, 20);
      }}
    />
  );
}
```

## 🚀 Example

```tsx
import { useState } from "react";
import {
  CanvasImage,
  type PixelCoords,
  type PixelColor,
} from "react-canvas-img";

export default function App() {
  const [imageSrc, setImageSrc] = useState<string | File>("/sample.png");
  const [width, setWidth] = useState<string>("auto");
  const [height, setHeight] = useState<string>("auto");

  const [clickedPixel, setClickedPixel] = useState<{
    coords: PixelCoords;
    color: PixelColor;
  } | null>(null);

  const [hoverPixel, setHoverPixel] = useState<{
    coords: PixelCoords;
    color: PixelColor;
  } | null>(null);

  const [canvasInfo, setCanvasInfo] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [status, setStatus] = useState<string>("Idle");

  const parseSize = (val: string): number | undefined =>
    val === "auto" || val.trim() === "" ? undefined : parseInt(val, 10);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🎨 react-canvas-img Demo</h2>
      
      <div>
        <label className="font-medium">Upload Image: </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setImageSrc(e.target.files[0]);
              setStatus("Image selected from file");
            }
          }}
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label className="font-medium">Image URL: </label>
        <input
          type="text"
          value={typeof imageSrc === "string" ? imageSrc : ""}
          onChange={(e) => {
            setImageSrc(e.target.value);
            setStatus("Image URL set");
          }}
          placeholder="Enter image URL"
          className="border p-1 w-full"
        />
      </div>

      <div className="flex gap-2">
        <div>
          <label className="font-medium">Width: </label>
          <input
            type="text"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            placeholder="auto or number"
            className="border p-1 w-24"
          />
        </div>
        <div>
          <label className="font-medium">Height: </label>
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="auto or number"
            className="border p-1 w-24"
          />
        </div>
      </div>

      <CanvasImage
        src={imageSrc}
        width={parseSize(width)}
        height={parseSize(height)}
        onClickPixel={(coords, color) => {
          setClickedPixel({ coords, color });
          setStatus(`Clicked pixel at (${coords.x}, ${coords.y})`);
        }}
        onHoverPixel={(coords, color) => {
          setHoverPixel({ coords, color });
        }}
        onCanvasReady={(ctx, canvas) => {
          setCanvasInfo({ width: canvas.width, height: canvas.height });
          ctx.font = "16px sans-serif";
          ctx.fillStyle = "red";
          ctx.fillText("Demo Canvas Text", 10, 20);
        }}
       />

      <div className="mt-4 space-y-2">
        <p>
          <strong>Status:</strong> {status}
        </p>
        {clickedPixel && (
          <p>
            <strong>Clicked:</strong> ({clickedPixel.coords.x},{" "}
            {clickedPixel.coords.y}) → {clickedPixel.color.rgb} |{" "}
            {clickedPixel.color.hex}
          </p>
        )}
        {hoverPixel && (
          <p>
            <strong>Hover:</strong> ({hoverPixel.coords.x},{" "}
            {hoverPixel.coords.y}) → {hoverPixel.color.rgb} |{" "}
            {hoverPixel.color.hex}
          </p>
        )}
        {canvasInfo && (
          <p>
            <strong>Canvas Ready:</strong> {canvasInfo.width} ×{" "}
            {canvasInfo.height}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setImageSrc("/sample.png");
            setWidth("auto");
            setHeight("auto");
            setClickedPixel(null);
            setHoverPixel(null);
            setCanvasInfo(null);
            setStatus("Reset to default");
          }}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset
        </button>

      </div>
    </div>
  );
}
```


## 📚 API

### Props

| Prop            | Type                                                                 | Description                           |
| --------------- | -------------------------------------------------------------------- | ------------------------------------- |
| `src`           | `string \| File`                                                     | Image source (URL or File)            |
| `onClickPixel`  | `(pixel: { x: number; y: number; color: string }) => void`           | Callback when a pixel is clicked      |
| `onHoverPixel`  | `(pixel: { x: number; y: number; color: string }) => void`           | Callback when hovering over a pixel   |
| `onCanvasReady` | `(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void` | Called when the canvas is initialized |

### Ref (optional)

If you attach a `ref`, you can call helper methods:

```ts
interface CanvasImageRef {
  getCanvas(): HTMLCanvasElement | null;
  getContext(): CanvasRenderingContext2D | null;
}
```

## 🧪 Development

Clone the repo and run:

```bash
git clone https://github.com/neerajrp1999/react-canvas-img.git
cd react-canvas-img
npm install
npm run build
```


## 📌 Roadmap

- [ ] Add support for annotations
- [ ] Enable zooming and panning
- [ ] Performance optimizations for large images


## 🤝 Contributing

PRs, issues, and suggestions are welcome!  
Please open an issue first to discuss changes.


## 📄 License

MIT © [Neeraj Prajapati (malum)](https://github.com/neerajrp1999)


## 🔗 Links

- [GitHub Repository](https://github.com/neerajrp1999/react-canvas-img)
- [NPM Package](https://www.npmjs.com/package/react-canvas-img)

