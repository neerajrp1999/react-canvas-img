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

* Versions with `.stable` (e.g., `"1.1.5-stable"`) are **official stable releases** → recommended for production.
* Other versions (without `.stable`) may be experimental or under development → **not recommended** for production.


## 📦 Installation

```bash
npm install react-canvas-img@stable
npm install react-canvas-img

# or
yarn add react-canvas-img@stable
yarn add react-canvas-img
````

## 🚀 Usage

```tsx
import { useState } from "react";
import CanvasImage, { type PixelCoords, type PixelColor } from "react-canvas-img";

export default function App() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
      onCanvasReady={(ctx, canvas) => {
        canvasRef.current = canvas;
      }}
    />
  );
}
```


## 🎮 Demo Example

* 🔗 **Live Demo:** [https://react-canvas-img-example.vercel.app/](https://react-canvas-img-example.vercel.app/)
* 📂 **GitHub Code:** [https://github.com/malum309/react-canvas-img-example](https://github.com/malum309/react-canvas-img-example)


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



