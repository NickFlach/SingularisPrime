import React, { useEffect, useRef, useState } from 'react';
import { QuantumProcessor, Player } from '@/types/game';
import { hofstadterButterflyPattern } from '@/lib/quantumDecisions';

interface QuantumVisualizerProps {
  player?: Player;
  processor?: QuantumProcessor;
  decisionId?: string;
  animate?: boolean;
  size?: number;
}

/**
 * A component that visualizes quantum geometry and Hofstadter's butterfly fractal patterns
 * This shows how quantum decisions are being influenced by fractal mathematics
 */
export function QuantumVisualizer({
  player,
  processor,
  decisionId,
  animate = true,
  size = 340
}: QuantumVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);
  const [hoverPoint, setHoverPoint] = useState<{ x: number, y: number } | null>(null);

  // Default values when props are undefined
  const playerQuantum = player?.attributes.quantum || 50;
  const coherenceTime = processor?.coherenceTime || 5;
  const qubits = processor?.qubits || 8;
  const entanglementCapacity = processor?.entanglementCapacity || 0.6;

  // Handling mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoverPoint({ x, y });
  };

  const handleMouseLeave = () => {
    setHoverPoint(null);
  };

  // Main drawing function for the fractal visualization
  const drawHofstadterButterfly = (
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number,
    timestamp: number = 0
  ) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up some parameters that will control the visualization
    const cellSize = 5; // Size of each "pixel" in our fractal
    const timeScale = timestamp / 10000; // Slow time factor for animation
    const playerFactor = playerQuantum / 100; // Player's quantum skill affects the pattern
    const processorScale = qubits / 16; // Processor capability affects detail
    const entanglementFactor = entanglementCapacity;
    
    // We'll use these for coloring
    const hueBase = (timeScale * 20) % 360; // Base hue that shifts over time
    const saturation = 80 + 20 * Math.sin(timeScale); // Saturation pulses slightly
    
    // Create a gradient background that moves with time
    const gradientBackground = ctx.createLinearGradient(0, 0, width, height);
    gradientBackground.addColorStop(0, `hsla(${hueBase}, 70%, 5%, 1)`);
    gradientBackground.addColorStop(1, `hsla(${hueBase + 80}, 70%, 10%, 1)`);
    ctx.fillStyle = gradientBackground;
    ctx.fillRect(0, 0, width, height);
    
    // Draw the Hofstadter butterfly pattern
    for (let x = 0; x < width; x += cellSize) {
      for (let y = 0; y < height; y += cellSize) {
        // Normalize coordinates to [0, 1]
        const nx = x / width;
        const ny = y / height;
        
        // Calculate the fractal coefficient using our quantum function
        // This creates the butterfly-like pattern
        const complexity = nx * processorScale + Math.sin(timeScale) * 0.1;
        const entrFactor = entanglementFactor * (1 + Math.cos(ny * Math.PI * 2) * 0.2);
        let fractalValue = hofstadterButterflyPattern(complexity, entrFactor);
        
        // Apply mouse interaction if hovering
        if (hoverPoint) {
          const dx = (x - hoverPoint.x) / width;
          const dy = (y - hoverPoint.y) / height;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 0.2) {
            // Create a ripple-like effect around the mouse
            fractalValue = fractalValue * (1 + Math.sin((1 - distance * 5) * Math.PI) * 0.5);
          }
        }
        
        // Only draw if the value is above a threshold
        // This creates the "butterfly wings" negative space effect
        if (fractalValue > 0.2) {
          const intensity = fractalValue * playerFactor * 1.5;
          // Map the fractal value to a color
          const hue = (hueBase + fractalValue * 180) % 360;
          const lightness = 20 + intensity * 60;
          
          ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${intensity})`;
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }
    }
    
    // Add quantum field lines
    ctx.strokeStyle = `hsla(${hueBase + 180}, 80%, 60%, 0.2)`;
    ctx.lineWidth = 0.5;
    
    const lineCount = Math.floor(5 + qubits / 2); // More qubits = more field lines
    for (let i = 0; i < lineCount; i++) {
      const yPos = (height / lineCount) * i;
      
      ctx.beginPath();
      for (let x = 0; x < width; x += 5) {
        // Create wavy lines that are influenced by time and player quantum
        const waveFactor = Math.sin(x / width * Math.PI * 4 + timeScale) * 20 * playerFactor;
        const y = yPos + waveFactor;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
    
    // Draw the quantum entanglement connections
    if (entanglementCapacity > 0.3) {
      ctx.strokeStyle = `hsla(${hueBase + 120}, 90%, 70%, 0.3)`;
      ctx.lineWidth = 0.75;
      
      const points = [];
      const pointCount = Math.floor(entanglementCapacity * 10);
      
      // Generate "quantum entanglement" points
      for (let i = 0; i < pointCount; i++) {
        points.push({
          x: width * (0.2 + 0.6 * Math.sin(i / pointCount * Math.PI * 2)),
          y: height * (0.2 + 0.6 * Math.cos(i / pointCount * Math.PI * 2 + timeScale))
        });
      }
      
      // Connect entangled points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const probability = hofstadterButterflyPattern(i / pointCount, j / pointCount);
          if (probability > 0.7) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
    }
    
    // Draw processor coherence ring
    ctx.strokeStyle = `hsla(${hueBase - 30}, 90%, 60%, 0.7)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const radius = Math.min(width, height) * 0.4;
    ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2 * coherenceTime / 10);
    ctx.stroke();
    
    // Add decision ID label if provided
    if (decisionId) {
      ctx.font = '14px monospace';
      ctx.fillStyle = `hsla(${hueBase + 60}, 90%, 80%, 0.8)`;
      ctx.fillText(`Quantum Decision: ${decisionId}`, 15, height - 15);
    }
    
    // Add quantum metrics
    ctx.font = '12px monospace';
    ctx.fillStyle = `hsla(${hueBase - 60}, 70%, 70%, 0.7)`;
    ctx.fillText(`Quantum: ${playerQuantum}`, 15, 20);
    ctx.fillText(`Qubits: ${qubits}`, 15, 40);
    ctx.fillText(`Coherence: ${coherenceTime.toFixed(1)}`, 15, 60);
    ctx.fillText(`Entanglement: ${entanglementCapacity.toFixed(2)}`, 15, 80);
  };

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!animate) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set the canvas dimensions
    canvas.width = size;
    canvas.height = size;
    
    // Animation function
    const animateFrame = (timestamp: number) => {
      drawHofstadterButterfly(ctx, canvas.width, canvas.height, timestamp);
      setAnimationFrame(requestAnimationFrame(animateFrame));
    };
    
    // Start the animation
    setAnimationFrame(requestAnimationFrame(animateFrame));
    
    // Cleanup
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [player, processor, decisionId, size, animate, hoverPoint]);

  // For non-animated mode, just draw once
  useEffect(() => {
    if (!canvasRef.current || animate) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = size;
    canvas.height = size;
    drawHofstadterButterfly(ctx, canvas.width, canvas.height);
  }, [player, processor, decisionId, size, animate, playerQuantum, coherenceTime, qubits, entanglementCapacity]);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="rounded-md shadow-lg" 
      />
      {/* Overlay gradient edge glow */}
      <div 
        className="absolute inset-0 rounded-md pointer-events-none" 
        style={{ 
          boxShadow: 'inset 0 0 20px rgba(120, 0, 255, 0.4)',
          background: 'radial-gradient(circle at center, transparent 60%, rgba(30, 0, 60, 0.3) 100%)',
        }} 
      />
    </div>
  );
}