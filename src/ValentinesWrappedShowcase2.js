import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

const BlocksContent = ({ styleConfig, gradientAngle }) => {
  const [touchedBlocks, setTouchedBlocks] = useState(new Set());
  const [lastTouchPosition, setLastTouchPosition] = useState(null);
  const containerRef = useRef(null);

  const handleTouchMove = (e) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const bounds = containerRef.current.getBoundingClientRect();
    const touchX = touch.clientX - bounds.left;
    const touchY = touch.clientY - bounds.top;
    
    // Calculate relative position within grid
    const cellWidth = bounds.width / styleConfig.blocks.grid.cols;
    const cellHeight = bounds.height / styleConfig.blocks.grid.rows;
    
    // Get the current block being touched
    const col = Math.floor(touchX / cellWidth);
    const row = Math.floor(touchY / cellHeight);
    
    if (row >= 0 && row < styleConfig.blocks.grid.rows &&
        col >= 0 && col < styleConfig.blocks.grid.cols) {
      const currentIndex = row * styleConfig.blocks.grid.cols + col;
      
      // Add blocks in a small radius around the touch point
      const radius = 2; // Adjust this value to change the "brush" size
      for (let r = -radius; r <= radius; r++) {
        for (let c = -radius; c <= radius; c++) {
          const newRow = row + r;
          const newCol = col + c;
          if (newRow >= 0 && newRow < styleConfig.blocks.grid.rows &&
              newCol >= 0 && newCol < styleConfig.blocks.grid.cols) {
            const index = newRow * styleConfig.blocks.grid.cols + newCol;
            setTouchedBlocks(prev => new Set([...prev, index]));
          }
        }
      }
    }
    
    setLastTouchPosition({ x: touchX, y: touchY });
  };

  const numBlocks = styleConfig.blocks.grid.rows * styleConfig.blocks.grid.cols;

  return (
    <div 
      ref={containerRef}
      className="h-full w-full overflow-hidden flex items-center justify-center"
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchMove}
    >
      <div 
        className="relative w-full h-full"
        style={{
          transform: 'rotate3d(1, 1, 0, 45deg)',
          perspective: '1000px',
        }}
      >
        <div 
          className="grid gap-0.5 w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${styleConfig.blocks.grid.cols}, 1fr)`,
            gridTemplateRows: `repeat(${styleConfig.blocks.grid.rows}, 1fr)`,
          }}
        >
          {Array(numBlocks).fill(null).map((_, i) => {
            const row = Math.floor(i / styleConfig.blocks.grid.cols);
            const col = i % styleConfig.blocks.grid.cols;
            const time = Date.now() * 0.001;
            const hue = (time * styleConfig.blocks.animationParams.hueShiftSpeed + (row + col) * 10) % 360;
            const isRevealed = touchedBlocks.has(i);

            const backgroundPositionX = (col * 100 / (styleConfig.blocks.grid.cols - 1));
            const backgroundPositionY = (row * 100 / (styleConfig.blocks.grid.rows - 1));

            return (
              <div 
                key={i}
                className="relative w-full h-full"
                style={{
                  perspective: '1000px',
                }}
              >
                <div
                  className="absolute w-full h-full transition-transform duration-700 transform-gpu"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Front face */}
                  <div
                    className="absolute w-full h-full backface-hidden"
                    style={{
                      background: `linear-gradient(${gradientAngle}deg, 
                        hsl(${hue}, 70%, 50%), 
                        hsl(${(hue + 60) % 360}, 70%, 50%))`,
                      backfaceVisibility: 'hidden'
                    }}
                  />
                  
                  {/* Back face */}
                  <div
                    className="absolute w-full h-full backface-hidden overflow-hidden"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                      background: `url('/wrapped2024.jpg')`,
                      backgroundSize: '1600%',
                      backgroundPosition: `${backgroundPositionX}% ${backgroundPositionY}%`
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function ValentinesWrappedShowcase2({ onNext }) {
  const styleConfig = {
    blocks: {
      colors: [
        ['#4facfe', '#00f2fe'],
        ['#f093fb', '#f5576c'],
        ['#FF5733', '#C70039'],
      ],
      grid: {
        rows: 12,
        cols: 16,
      },
      animationParams: {
        flipDuration: 720,
        rippleSpeed: 50,
        rippleRadius: 3,
        baseHeight: 20,
        activeHeight: 40,
        hueShiftSpeed: 30
      }
    }
  };

  const [gradientAngle, setGradientAngle] = useState(0);
  const [currentBlockColorIndex, setCurrentBlockColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlockColorIndex(prev => (prev + 1) % styleConfig.blocks.colors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientAngle(prev => (prev + 1.2) % 360);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="w-full h-screen flex flex-col" 
      style={{ 
        background: 'linear-gradient(45deg, #FF0080, #7928CA, #FF4D4D)',
        backgroundSize: '400% 400%',
        animation: 'gradient-shift 15s ease infinite'
      }}
    >
      <style>
        {`
          @keyframes gradient-shift {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}
      </style>
      <div className="flex-1">
        <BlocksContent 
          styleConfig={styleConfig} 
          gradientAngle={gradientAngle} 
        />
      </div>
      
      {/* Next Button */}
      <div className="absolute bottom-8 right-8 z-50">
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default ValentinesWrappedShowcase2;