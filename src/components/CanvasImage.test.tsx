import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { test, expect, beforeAll, jest } from "@jest/globals";
import { CanvasImage, CanvasImageRef } from "./CanvasImage";

const mockGetImageData = jest.fn(() => ({
  data: [255, 0, 0, 255],
}));

const mockContext = {
  getImageData: mockGetImageData,
  clearRect: jest.fn(),
  drawImage: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
};

beforeAll(() => {
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => mockContext as any
  );
});

test("renders canvas element", () => {
  const { container } = render(<CanvasImage src="" />);
  const canvas = container.querySelector("canvas");
  expect(canvas).not.toBeNull();
});

test("calls onClickPixel when clicking on canvas", () => {
  const handleClick = jest.fn();

  const { container } = render(
    <CanvasImage src="" onClickPixel={handleClick} />
  );

  const canvas = container.querySelector("canvas")!;
  fireEvent.click(canvas, { clientX: 10, clientY: 20 });

  expect(handleClick).toHaveBeenCalledTimes(1);
  expect(handleClick).toHaveBeenCalledWith(
    { x: 10, y: 20 },
    { rgb: "rgb(255, 0, 0)", hex: "#ff0000" }
  );
});

test("calls onHoverPixel when moving mouse over canvas", () => {
  const handleHover = jest.fn();

  const { container } = render(
    <CanvasImage src="" onHoverPixel={handleHover} />
  );

  const canvas = container.querySelector("canvas")!;
  fireEvent.mouseMove(canvas, { clientX: 5, clientY: 5 });

  expect(handleHover).toHaveBeenCalledTimes(1);
  expect(handleHover).toHaveBeenCalledWith(
    { x: 5, y: 5 },
    { rgb: "rgb(255, 0, 0)", hex: "#ff0000" }
  );
});

test("calls onCanvasReady with ctx and canvas", () => {
  const handleReady = jest.fn();
  let triggerOnLoad: (() => void) | undefined;

  const OriginalImage = globalThis.Image;
  (globalThis as any).Image = class {
    onload: (() => void) | null = null;
    set src(_: string) {
      triggerOnLoad = () => {
        if (this.onload) this.onload();
      };
    }
  };

  render(<CanvasImage src="test.png" onCanvasReady={handleReady} />);

  triggerOnLoad?.();

  expect(handleReady).toHaveBeenCalledTimes(1);
  const [ctx, canvas] = handleReady.mock.calls[0];
  expect(ctx).toBe(mockContext);
  expect(canvas).toBeInstanceOf(HTMLCanvasElement);
  
  globalThis.Image = OriginalImage;
});



test("exposes canvas methods via ref", () => {
  const ref = React.createRef<CanvasImageRef>();

  render(<CanvasImage ref={ref} src="" />);

  expect(ref.current?.getCanvas()).toBeInstanceOf(HTMLCanvasElement);
  expect(ref.current?.getContext()).toBe(mockContext);
});
