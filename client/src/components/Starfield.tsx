import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const starfield = canvasRef.current;
    const stars: Star[] = [];
    const starCount = 150;
    
    // Create stars
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 2 + 1;
      const opacity = Math.random() * 0.5 + 0.3;
      
      // Position randomly
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      star.className = 'star animate-star-pulse';
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.top = `${y}%`;
      star.style.left = `${x}%`;
      star.style.opacity = opacity.toString();
      star.style.animationDelay = `${Math.random() * 3}s`;
      
      starfield.appendChild(star);
      
      stars.push({ x, y, size, opacity, speed: Math.random() * 0.05 });
    }
    
    return () => {
      // Cleanup on unmount
      while (starfield.firstChild) {
        starfield.removeChild(starfield.firstChild);
      }
    };
  }, []);

  return (
    <div 
      ref={canvasRef} 
      className="starfield fixed top-0 left-0 w-full h-full z-[-1]"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default Starfield;
