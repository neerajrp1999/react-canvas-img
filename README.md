# react-canvas-img 🎨

[![npm version](https://img.shields.io/npm/v/react-canvas-img.svg)](https://www.npmjs.com/package/react-canvas-img)
[![npm downloads](https://img.shields.io/npm/dt/react-canvas-img.svg)](https://www.npmjs.com/package/react-canvas-img)
[![license](https://img.shields.io/npm/l/react-canvas-img.svg)](./LICENSE)

A lightweight **React component** to load images into a `<canvas>` and read pixel data (color + coordinates) for **all React events** (click, hover, pointer, touch, drag, keyboard, focus, wheel, clipboard).  
Fully written in **TypeScript** with support for refs, hooks, and callbacks.


## ✨ Features

* Load images into `<canvas>` easily
* Get pixel color + coordinates for **mouse**, **pointer**, **touch**, **keyboard**, **focus**, **scroll**, and **clipboard** events
* Built-in `onHoverPixel` alias (fires on `onMouseMove`)
* Toggle between **canvas coordinates** and **original image coordinates**
* Exposes canvas context and element via `onCanvasReady`
* Built-in zoom & pan (hold Shift + Scroll to zoom, Shift + Right Click + Drag to pan)
* Supports refs for direct canvas access
* Written in TypeScript – full type definitions included
* Lightweight, no external dependencies

## ⚠️ Versioning Note

* Versions with `.stable` (e.g., `"1.1.4-stable"`) are **official stable releases** → recommended for production.
* Other versions (without `.stable`) may be experimental or under development → **not recommended** for production.


## 📦 Installation

```bash
npm install react-canvas-img
# or
yarn add react-canvas-img
````

## 🚀 Usage

```tsx
import { useState } from "react";
import CanvasImage, { type PixelCoords, type PixelColor } from "react-canvas-img";

export default function App() {
  const [clickedPixel, setClickedPixel] = useState<{
    coords: PixelCoords;
    color: PixelColor;
  } | null>(null);

  return (
    <CanvasImage
      src="/sample.png"
      width={400}     // optional → default: auto
      height={300}    // optional → default: auto
      useOriginalCoords={true} // optional → default: true
      style={{}}
      divClassName=""
      divStyle={{}}

      // Mouse
      onClickPixel={(coords, color) => setClickedPixel({ coords, color })}
      onHoverPixel={(coords, color) => console.log("Hover:", coords, color)}

      // Pointer
      onPointerMovePixel={(coords, color) => console.log("Pointer:", coords, color)}

      // Touch
      onTouchStartPixel={(coords, color) => console.log("Touch start:", coords, color)}

      // Lifecycle
      onCanvasReady={(ctx) => {
        ctx.fillStyle = "red";
        ctx.fillText("Demo Text", 10, 20);
      }}
    />
  );
}
```

## 🎮 Demo Example

```tsx
import { useState } from "react";
import CanvasImage, { type PixelCoords, type PixelColor } from "@react-canvas-img";

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
        width={parseSize(width)} // default: auto
        height={parseSize(height)} // default: auto
        useOriginalCoords={true} // default: true
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
        onMouseLeavePixel={(coords, color) => {
          console.log("Right-clicked pixel at", coords);
          console.log("Color:", color);
          setStatus(`Right-clicked pixel at (${coords.x}, ${coords.y})`);
          
        }}
        style={{ cursor: "crosshair" }}
        
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
import { useState } from "react";
import CanvasImage, { type PixelCoords, type PixelColor } from "@react-canvas-img";

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
        width={parseSize(width)} // default: auto
        height={parseSize(height)} // default: auto
        useOriginalCoords={true} // default: true
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
        onMouseLeavePixel={(coords, color) => {
          console.log("Right-clicked pixel at", coords);
          console.log("Color:", color);
          setStatus(`Right-clicked pixel at (${coords.x}, ${coords.y})`);
          
        }}
        style={{ cursor: "crosshair" }}
        
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

### Core Props

| Prop                | Type                                                                 | Default | Description                                                                                                    |
| ------------------- | -------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `src`               | `string \| File`                                                     | —       | Image source (URL or File)                                                                                     |
| `width`             | `number`                                                             | auto    | Width of canvas (auto = natural width)                                                                         |
| `height`            | `number`                                                             | auto    | Height of canvas (auto = natural height)                                                                       |
| `useOriginalCoords` | `boolean`                                                            | true    | If `true`, returns coordinates relative to **original image size**. If `false`, returns **canvas coordinates** |
| `onCanvasReady`     | `(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void` | —       | Called when the canvas is initialized                                                                          |

### Event Props

Each event is available with the suffix **`Pixel`**, e.g. `onClickPixel`.
They all share the same signature:

```ts
(coords: PixelCoords, color: PixelColor, event: React.SyntheticEvent<HTMLCanvasElement>) => void
```

#### 🖱 Mouse Events

`onClickPixel`, `onContextMenuPixel`, `onDoubleClickPixel`,
`onDragPixel`, `onDragEndPixel`, `onDragEnterPixel`, `onDragExitPixel`,
`onDragLeavePixel`, `onDragOverPixel`, `onDragStartPixel`, `onDropPixel`,
`onMouseDownPixel`, `onMouseUpPixel`, `onMouseEnterPixel`, `onMouseLeavePixel`,
`onMouseMovePixel`, `onHoverPixel` (alias of `onMouseMovePixel`),
`onMouseOutPixel`, `onMouseOverPixel`

#### ⌨️ Keyboard Events (if focusable with `tabIndex`)

`onKeyDownPixel`, `onKeyPressPixel`, `onKeyUpPixel`

#### 👀 Focus Events

`onFocusPixel`, `onBlurPixel`

#### ✍️ Pointer Events (better than mouse for touch/pen)

`onPointerDownPixel`, `onPointerMovePixel`, `onPointerUpPixel`,
`onPointerCancelPixel`, `onGotPointerCapturePixel`, `onLostPointerCapturePixel`,
`onPointerEnterPixel`, `onPointerLeavePixel`, `onPointerOverPixel`, `onPointerOutPixel`

#### 🤏 Touch Events

`onTouchStartPixel`, `onTouchMovePixel`, `onTouchEndPixel`, `onTouchCancelPixel`

#### 🖱 Wheel & Scroll Events

`onWheelPixel`, `onScrollPixel`

#### 📋 Clipboard Events (if focusable)

`onCopyPixel`, `onCutPixel`, `onPastePixel`

### Ref (optional)

```ts
interface CanvasImageRef {
  getCanvas(): HTMLCanvasElement | null;
  getContext(): CanvasRenderingContext2D | null;
}
```

## 🧪 Development

```bash
git clone https://github.com/neerajrp1999/react-canvas-img.git
cd react-canvas-img
npm install
npm run build
```

## 📌 Roadmap

* [ ] Add support for annotations
* [ ] Performance optimizations for large images
* [x] Enable zooming and panning

## 🤝 Contributing

PRs, issues, and suggestions are welcome!
Please open an issue first to discuss changes.

## 📄 License

MIT © [Neeraj Prajapati (malum)](https://github.com/neerajrp1999)

## 🔗 Links

* [GitHub Repository](https://github.com/neerajrp1999/react-canvas-img)
* [NPM Package](https://www.npmjs.com/package/react-canvas-img)

```

---

Do you want me to also add a **usage table** (like a big list) with all event props and their event type signatures (e.g., `onPointerMovePixel: PixelEventHandler<React.PointerEvent<HTMLCanvasElement>>`) so it’s crystal clear for users?
```



