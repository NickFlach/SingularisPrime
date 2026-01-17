import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { QuantumVisualizer } from '@/components/QuantumVisualizer';
import { Player, QuantumProcessor } from '@/types/game';

// Mock Canvas and Context
const mockClearRect = jest.fn();
const mockBeginPath = jest.fn();
const mockMoveTo = jest.fn();
const mockLineTo = jest.fn();
const mockStroke = jest.fn();
const mockArc = jest.fn();
const mockFillRect = jest.fn();
const mockFillText = jest.fn();
const mockCreateLinearGradient = jest.fn(() => ({
  addColorStop: jest.fn()
}));

const mockContext = {
  clearRect: mockClearRect,
  beginPath: mockBeginPath,
  moveTo: mockMoveTo,
  lineTo: mockLineTo,
  stroke: mockStroke,
  arc: mockArc,
  fillRect: mockFillRect,
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  font: '',
  fillText: mockFillText,
  createLinearGradient: mockCreateLinearGradient
};

// Mock requestAnimationFrame and cancelAnimationFrame
const originalRAF = global.requestAnimationFrame;
const originalCAF = global.cancelAnimationFrame;

// Mock sample data
const mockPlayer: Player = {
  name: 'Test Player',
  origin: 'Quantum Realm',
  attributes: {
    quantum: 75,
    temporal: 50,
    pattern: 60
  },
  energy: 100,
  knowledge: 70,
  paradox: 20
};

const mockProcessor: QuantumProcessor = {
  qubits: 12,
  entanglementCapacity: 80,
  coherenceTime: 5000,
  errorCorrectionLevel: 6,
  activeAlgorithms: ['shor', 'grover', 'vqe']
};

describe('QuantumVisualizer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock canvas getContext
    HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((callback) => {
      callback(1000);
      return 1;
    });
    
    global.cancelAnimationFrame = jest.fn();
  });
  
  afterEach(() => {
    // Restore original functions
    global.requestAnimationFrame = originalRAF;
    global.cancelAnimationFrame = originalCAF;
  });

  test('renders without crashing', () => {
    const { container } = render(<QuantumVisualizer />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
  
  test('uses default values when props not provided', () => {
    render(<QuantumVisualizer />);
    
    // Should still render and use default values
    expect(mockClearRect).toHaveBeenCalled();
    expect(mockFillRect).toHaveBeenCalled();
  });
  
  test('accepts player and processor props', () => {
    render(
      <QuantumVisualizer 
        player={mockPlayer} 
        processor={mockProcessor}
        decisionId="test-decision"
      />
    );
    
    // Should display quantum metrics with player values
    expect(mockFillText).toHaveBeenCalledWith(`Quantum: ${mockPlayer.attributes.quantum}`, 15, 20);
    expect(mockFillText).toHaveBeenCalledWith(`Qubits: ${mockProcessor.qubits}`, 15, 40);
    expect(mockFillText).toHaveBeenCalledWith(`Coherence: ${mockProcessor.coherenceTime.toFixed(1)}`, 15, 60);
    
    // Should display decision ID
    expect(mockFillText).toHaveBeenCalledWith('Quantum Decision: test-decision', 15, expect.any(Number));
  });
  
  test('supports disabling animation', () => {
    const { rerender } = render(<QuantumVisualizer animate={false} />);
    
    // With animation disabled, requestAnimationFrame shouldn't be called
    expect(global.requestAnimationFrame).not.toHaveBeenCalled();
    
    // But it should still render once
    expect(mockClearRect).toHaveBeenCalled();
    
    // Rerender with animation enabled
    mockClearRect.mockClear();
    rerender(<QuantumVisualizer animate={true} />);
    
    // Now it should use animation
    expect(global.requestAnimationFrame).toHaveBeenCalled();
    expect(mockClearRect).toHaveBeenCalled();
  });
  
  test('supports mouse interactions', () => {
    const { container } = render(<QuantumVisualizer />);
    const canvas = container.querySelector('canvas');
    
    // Trigger mouse events
    if (canvas) {
      fireEvent.mouseMove(canvas, { clientX: 50, clientY: 50 });
      fireEvent.mouseLeave(canvas);
    }
    
    // The main thing we care about is that it doesn't crash
    // since most of the logic is in the drawing function
    expect(canvas).toBeInTheDocument();
  });
  
  test('cleans up animation on unmount', () => {
    const { unmount } = render(<QuantumVisualizer animate={true} />);
    
    // Should start animation
    expect(global.requestAnimationFrame).toHaveBeenCalled();
    
    // Unmount
    unmount();
    
    // Should cancel animation frame
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });
  
  test('accepts custom size', () => {
    const customSize = 400;
    const { container } = render(<QuantumVisualizer size={customSize} />);
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('width', customSize.toString());
    expect(canvas).toHaveAttribute('height', customSize.toString());
  });
});