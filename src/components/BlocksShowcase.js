import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Music, Layers, Waves } from 'lucide-react';

const ValentinesWrappedShowcase = () => {
  const [selectedStyle, setSelectedStyle] = useState('blocks');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const styleConfig = {
    blocks: {
      colors: [
        ['#4facfe', '#00f2fe'],
        ['#f093fb', '#f5576c'],
        ['#FF5733', '#C70039'],
      ],
      grid: {
        rows: 12,    // Reduced rows due to wider blocks
        cols: 16,    // Reduced columns due to taller blocks
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

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const numBlocks = styleConfig.blocks.grid.rows * styleConfig.blocks.grid.cols;
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

  const styles = {
    blocks: {
      background: 'transparent',
      content: (() => {
        const [activeBlock, setActiveBlock] = useState(null);
        const [rippleBlocks, setRippleBlocks] = useState(new Set());
        
        useEffect(() => {
          if (activeBlock !== null) {
            const newRippleBlocks = new Set();
            const row = Math.floor(activeBlock / styleConfig.blocks.grid.cols);
            const col = activeBlock % styleConfig.blocks.grid.cols;
            const radius = styleConfig.blocks.animationParams.rippleRadius;
            
            for (let r = -radius; r <= radius; r++) {
              for (let c = -radius; c <= radius; c++) {
                const distance = Math.sqrt(r * r + c * c);
                if (distance <= radius) {
                  const newRow = row + r;
                  const newCol = col + c;
                  if (newRow >= 0 && newRow < styleConfig.blocks.grid.rows &&
                      newCol >= 0 && newCol < styleConfig.blocks.grid.cols) {
                    const index = newRow * styleConfig.blocks.grid.cols + newCol;
                    setTimeout(() => {
                      setRippleBlocks(prev => new Set([...prev, index]));
                      setTimeout(() => {
                        setRippleBlocks(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(index);
                          return newSet;
                        });
                      }, styleConfig.blocks.animationParams.flipDuration);
                    }, distance * styleConfig.blocks.animationParams.rippleSpeed);
                  }
                }
              }
            }
          }
        }, [activeBlock]);

        return (
          <div 
            ref={containerRef}
            className="h-full w-full overflow-hidden flex items-center justify-center"
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
                  const isActive = rippleBlocks.has(i);

                  const backgroundPositionX = -(col * (100 / (styleConfig.blocks.grid.cols - 1)));
                  const backgroundPositionY = -(row * (100 / (styleConfig.blocks.grid.rows - 1)));
                  
                  return (
                    <div 
                      key={i}
                      className="relative w-full h-full cursor-pointer"
                      style={{
                        perspective: '1000px',
                      }}
                      onMouseEnter={() => setActiveBlock(i)}
                      onMouseLeave={() => setActiveBlock(null)}
                    >
                      <div
                        className="absolute w-full h-full transition-transform duration-700 transform-gpu"
                        style={{
                          transformStyle: 'preserve-3d',
                          transform: isActive ? 'rotateY(180deg)' : 'rotateY(0deg)',
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
                            background: `url('/api/placeholder/1920/1080?text=Wrapped2024')`,
                            backgroundSize: `${styleConfig.blocks.grid.cols * 100}% ${styleConfig.blocks.grid.rows * 100}%`,
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
      })()
    }
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ 
        background: 'linear-gradient(45deg, #FF0080, #7928CA, #FF4D4D)',
        backgroundSize: '400% 400%',
        animation: 'gradient-shift 15s ease infinite'
      }}>
      <style>
        {`
          @keyframes gradient-shift {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}
      </style>
      <div className="flex-1" style={{ background: styles[selectedStyle].background }}>
        {styles[selectedStyle].content}
      </div>
    </div>
  );
};

export default ValentinesWrappedShowcase;