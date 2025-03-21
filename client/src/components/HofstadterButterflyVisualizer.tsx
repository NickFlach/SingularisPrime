import React, { useEffect, useRef } from 'react';

interface HofstadterButterflyVisualizerProps {
  width?: number;
  height?: number;
  resolution?: number; // Higher = more detailed
  magnetic?: number; // Controls the magnetic field effect (0-1)
  energy?: number; // Controls the energy levels (0-1)
  colorScheme?: 'quantum' | 'spectrum' | 'monochrome';
}

/**
 * This component visualizes Hofstadter's Butterfly fractal pattern
 * which represents electron energy levels in a magnetic field
 * (a real quantum phenomenon discovered by Douglas Hofstadter)
 */
export function HofstadterButterflyVisualizer({
  width = 500,
  height = 300,
  resolution = 1,  // Default resolution
  magnetic = 0.5,  // Default magnetic field strength
  energy = 0.5,    // Default energy level
  colorScheme = 'quantum'
}: HofstadterButterflyVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate Hofstadter's Butterfly pattern for a given x, y coordinate
  // x represents the magnetic field Φ/Φ₀ (0 to 1)
  // y represents the energy parameter E (0 to 1)
  const calculateHofstadterValue = (x: number, y: number): number => {
    // This is a simplified approximation of Hofstadter's Butterfly
    // Real calculations would involve solving Harper's equation and Mathieu functions
    
    // Normalize x to [0, 1]
    const phi = x; // magnetic flux
    
    // Calculate the primary wing structure
    // This creates the characteristic butterfly shape with fractal self-similarity
    
    // Main frequency components at different scales
    const f1 = Math.sin(phi * Math.PI * 2);
    const f2 = Math.sin(phi * Math.PI * 4);
    const f3 = Math.sin(phi * Math.PI * 8);
    const f4 = Math.sin(phi * Math.PI * 16);
    
    // Recursive pattern that creates self-similarity at different scales
    const recursivePattern = (
      f1 * 0.5 + 
      f2 * 0.25 * (1 + f1 * 0.5) + 
      f3 * 0.125 * (1 + f2 * 0.25) +
      f4 * 0.0625 * (1 + f3 * 0.125)
    );
    
    // Energy bands calculation that splits the butterfly into wings
    // Centers the pattern on y = 0.5
    const energyFactor = Math.sin((y - 0.5) * Math.PI * (1 + recursivePattern * 0.5));
    const bandGap = Math.pow(Math.sin(phi * Math.PI), 2) * Math.sin(y * Math.PI * 8);
    
    // Combine components to create the pattern
    let value = energyFactor * (1 + recursivePattern * 0.3) + bandGap * 0.2;
    
    // Normalize to [0, 1] range
    value = (value + 1) * 0.5;
    
    return value;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Create an image data object
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Calculate pixel size based on resolution
    const pixelSize = Math.max(1, Math.floor(1 / resolution));
    
    // Draw the Hofstadter Butterfly pattern
    for (let x = 0; x < width; x += pixelSize) {
      for (let y = 0; y < height; y += pixelSize) {
        // Normalize coordinates to [0, 1]
        const nx = x / width;
        const ny = y / height;
        
        // Apply the magnetic field parameter to modify x coordinate calculation
        const magneticX = nx * (1 + (magnetic - 0.5) * 0.5);
        
        // Apply the energy parameter to modify y coordinate calculation
        const energyY = ny * (1 + (energy - 0.5) * 0.3);
        
        // Calculate Hofstadter value
        const value = calculateHofstadterValue(magneticX, energyY);
        
        // Set pixel color based on value and chosen color scheme
        let r, g, b, a;
        
        // Apply different color mappings based on the color scheme
        switch (colorScheme) {
          case 'spectrum':
            // Full spectrum coloring (rainbow)
            const hue = value * 360;
            // Convert HSL to RGB
            const c = (1 - Math.abs(2 * 0.5 - 1)) * 1;
            const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
            const m = 0.5 - c / 2;
            
            let rc, gc, bc;
            if (hue < 60) { [rc, gc, bc] = [c, x, 0]; }
            else if (hue < 120) { [rc, gc, bc] = [x, c, 0]; }
            else if (hue < 180) { [rc, gc, bc] = [0, c, x]; }
            else if (hue < 240) { [rc, gc, bc] = [0, x, c]; }
            else if (hue < 300) { [rc, gc, bc] = [x, 0, c]; }
            else { [rc, gc, bc] = [c, 0, x]; }
            
            r = Math.floor((rc + m) * 255);
            g = Math.floor((gc + m) * 255);
            b = Math.floor((bc + m) * 255);
            a = Math.floor(value * 200) + 55; // Higher alpha for higher values
            break;
            
          case 'monochrome':
            // Black and white with gray gradient
            const intensity = Math.floor(value * 255);
            r = g = b = intensity;
            a = 255;
            break;
            
          case 'quantum':
          default:
            // Quantum-themed coloring (purple/blue/cyan)
            r = Math.floor(value * 140);
            g = Math.floor(value * value * 230);
            b = Math.floor(180 + value * 75);
            a = Math.floor(value * 200) + 55; // Higher alpha for higher values
            break;
        }
        
        // Draw pixel
        for (let dx = 0; dx < pixelSize; dx++) {
          for (let dy = 0; dy < pixelSize; dy++) {
            if (x + dx < width && y + dy < height) {
              const index = 4 * ((y + dy) * width + (x + dx));
              data[index] = r;
              data[index + 1] = g;
              data[index + 2] = b;
              data[index + 3] = a;
            }
          }
        }
      }
    }
    
    // Draw the image data to the canvas
    ctx.putImageData(imageData, 0, 0);
    
    // Add axes labels for scientific accuracy
    ctx.font = '12px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    
    // X-axis (magnetic field)
    ctx.fillText('Magnetic Flux Φ/Φ₀', width / 2 - 60, height - 10);
    
    // Y-axis (energy)
    ctx.save();
    ctx.translate(10, height / 2 + 40);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Energy E', 0, 0);
    ctx.restore();
    
    // Add title
    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText("Hofstadter's Butterfly", 10, 20);
    
  }, [width, height, resolution, magnetic, energy, colorScheme]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="rounded-lg shadow-lg"
        style={{ 
          background: 'black', 
          boxShadow: '0 0 15px rgba(100, 50, 255, 0.5)',
        }}
      />
      <div className="absolute bottom-2 right-2 text-xs text-white opacity-70">
        Magnetic: {magnetic.toFixed(2)} · Energy: {energy.toFixed(2)}
      </div>
    </div>
  );
}