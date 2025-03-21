import React from 'react';
import { render } from '@testing-library/react';
import { HofstadterButterflyVisualizer } from '@/components/HofstadterButterflyVisualizer';

// Mock the canvas and context for testing
const mockContext = {
  clearRect: jest.fn(),
  createImageData: jest.fn(() => ({
    data: new Uint8ClampedArray(400 * 400 * 4)
  })),
  putImageData: jest.fn(),
  font: '',
  fillStyle: '',
  fillText: jest.fn(),
  save: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  restore: jest.fn()
};

const mockCanvas = {
  getContext: jest.fn(() => mockContext),
  width: 400,
  height: 300
};

// Mock the HTMLCanvasElement
global.HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

describe('HofstadterButterflyVisualizer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    const { container } = render(<HofstadterButterflyVisualizer />);
    expect(container).toBeTruthy();
  });

  test('creates a canvas element', () => {
    const { container } = render(<HofstadterButterflyVisualizer />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('accepts custom dimensions', () => {
    const { container } = render(
      <HofstadterButterflyVisualizer width={600} height={400} />
    );
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ background: 'black' });
  });

  test('accepts different color schemes', () => {
    const { rerender, container } = render(
      <HofstadterButterflyVisualizer colorScheme="quantum" />
    );
    
    // We can't easily test the visual output, but we can verify it renders
    expect(container.querySelector('canvas')).toBeInTheDocument();
    
    // Test other color schemes
    rerender(<HofstadterButterflyVisualizer colorScheme="spectrum" />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
    
    rerender(<HofstadterButterflyVisualizer colorScheme="monochrome" />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  test('displays magnetic and energy values', () => {
    const { container } = render(
      <HofstadterButterflyVisualizer magnetic={0.75} energy={0.25} />
    );
    
    const valueDisplay = container.querySelector('.absolute.bottom-2.right-2');
    expect(valueDisplay).toBeInTheDocument();
    expect(valueDisplay).toHaveTextContent('Magnetic: 0.75');
    expect(valueDisplay).toHaveTextContent('Energy: 0.25');
  });

  test('uses different resolution based on prop', () => {
    const { rerender } = render(
      <HofstadterButterflyVisualizer resolution={1} />
    );
    
    // Initial render should call createImageData
    expect(mockContext.createImageData).toHaveBeenCalled();
    mockContext.createImageData.mockClear();
    
    // Rerender with higher resolution
    rerender(<HofstadterButterflyVisualizer resolution={2} />);
    
    // Should call createImageData again with new resolution
    expect(mockContext.createImageData).toHaveBeenCalled();
  });
});