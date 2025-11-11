import { beforeAll, vi } from 'vitest';
beforeAll(() => {
  // Mock HTMLCanvasElement.getContext
  if (typeof HTMLCanvasElement !== 'undefined') {
    const mockGetContext = vi.fn(() => ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Array(4),
      })),
      putImageData: vi.fn(),
      createImageData: vi.fn(() => []),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    }));
    HTMLCanvasElement.prototype.getContext = mockGetContext;
  }
  // Mock WebGL context
  if (typeof WebGLRenderingContext !== 'undefined') {
    const mockGetContextWebGL = vi.fn((contextType) => {
      if (contextType === '2d') {
        return {
          fillRect: vi.fn(),
          clearRect: vi.fn(),
          getImageData: vi.fn(() => ({ data: new Array(4) })),
          putImageData: vi.fn(),
          createImageData: vi.fn(() => []),
          setTransform: vi.fn(),
          drawImage: vi.fn(),
          save: vi.fn(),
          fillText: vi.fn(),
          restore: vi.fn(),
          beginPath: vi.fn(),
          moveTo: vi.fn(),
          lineTo: vi.fn(),
          closePath: vi.fn(),
          stroke: vi.fn(),
          translate: vi.fn(),
          scale: vi.fn(),
          rotate: vi.fn(),
          arc: vi.fn(),
          fill: vi.fn(),
          measureText: vi.fn(() => ({ width: 0 })),
          transform: vi.fn(),
          rect: vi.fn(),
          clip: vi.fn(),
        };
      }
      return null;
    });
    HTMLCanvasElement.prototype.getContext = mockGetContextWebGL;
  }
});
