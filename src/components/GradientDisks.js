import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';

const ValentinesWrappedShowcase = () => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [gradientAngle, setGradientAngle] = useState(0);
  const [diskPositions, setDiskPositions] = useState([]);
  const [draggedDisk, setDraggedDisk] = useState(null);
  const [startDragPos, setStartDragPos] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const styleConfig = {
    gradient: {
      colors: [
        ['#f093fb', '#f5576c'],
        ['#5ee7df', '#b490ca'],
        ['#f4d03f', '#16a085'],
      ],
      numLayers: 5,
      blurRange: [8, 16],
      alignmentThreshold: 100
    }
  };

  // Initialize random disk positions
  useEffect(() => {
    const containerSize = 384;
    const diskSize = containerSize / 2;
    const maxOffset = containerSize - diskSize;
    
    const randomPositions = Array(styleConfig.gradient.numLayers).fill(null).map(() => ({
      x: Math.random() * maxOffset - maxOffset / 2,
      y: Math.random() * maxOffset - maxOffset / 2
    }));
    
    setDiskPositions(randomPositions);
  }, []);

  // Check if disks are aligned relative to each other
  useEffect(() => {
    if (diskPositions.length === 0 || isWon) return;
    
    // Pick the first moved or dragged disk as reference
    const referencePos = diskPositions[draggedDisk !== null ? draggedDisk : 0];
    
    // Check if all disks are close to the reference disk
    const isAligned = diskPositions.every((pos) => {
      const distance = Math.sqrt(
        Math.pow(pos.x - referencePos.x, 2) + 
        Math.pow(pos.y - referencePos.y, 2)
      );
      return distance < styleConfig.gradient.alignmentThreshold;
    });
    
    if (isAligned) {
      setIsWon(true);
      // Align all disks perfectly with the reference disk
      setDiskPositions(prev => prev.map(() => ({ ...referencePos })));
      
      setTimeout(() => {
        setShowMessage(true);
      }, 500);
    }
  }, [diskPositions, isWon, draggedDisk]);

  // Animation timings
  useEffect(() => {
    const intervals = [
      setInterval(() => setGradientAngle(prev => (prev + 1.2) % 360), 100),
      setInterval(() => setCurrentColorIndex(prev => (prev + 1) % 3), 4000)
    ];
    return () => intervals.forEach(clearInterval);
  }, []);

  const handleDiskMouseDown = (e, index) => {
    if (isWon) return;
    e.preventDefault();
    setDraggedDisk(index);
    const bounds = e.currentTarget.getBoundingClientRect();
    setStartDragPos({
      x: e.clientX - bounds.left - diskPositions[index].x,
      y: e.clientY - bounds.top - diskPositions[index].y
    });
  };

  const handleDiskDrag = useCallback((e) => {
    if (draggedDisk !== null && startDragPos !== null && !isWon) {
      const bounds = e.currentTarget.getBoundingClientRect();
      setDiskPositions(prev => prev.map((pos, i) => 
        i === draggedDisk ? {
          x: e.clientX - bounds.left - startDragPos.x,
          y: e.clientY - bounds.top - startDragPos.y
        } : pos
      ));
    }
  }, [draggedDisk, startDragPos, isWon]);

  const handleDiskMouseUp = () => {
    setDraggedDisk(null);
    setStartDragPos(null);
  };

  const resetPuzzle = () => {
    const containerSize = 384;
    const diskSize = containerSize / 2;
    const maxOffset = containerSize - diskSize;
    
    const randomPositions = Array(styleConfig.gradient.numLayers).fill(null).map(() => ({
      x: Math.random() * maxOffset - maxOffset / 2,
      y: Math.random() * maxOffset - maxOffset / 2
    }));
    
    setDiskPositions(randomPositions);
    setIsWon(false);
    setShowMessage(false);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-black">
      <div className="flex gap-4 p-6 bg-gradient-to-r from-gray-900 to-black relative z-50">
        <div className="flex-1">
          <h2 className="text-white text-xl">
            Stack the gradient disks anywhere to reveal a message
          </h2>
        </div>
        <button
          onClick={resetPuzzle}
          className="px-6 py-3 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
        >
          Reset Puzzle
        </button>
      </div>
      
      <div className="flex-1 transition-all duration-1000 bg-black relative">
        {/* Success Message */}
        <div 
          className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-1000 ${
            showMessage ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-center">
            <h1 className="text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4 font-sans">
              HAPPY VALENTINE'S DAY
            </h1>
            <p className="text-base text-white opacity-70 tracking-wide font-light">
              I love you so much and can't wait to love you deeper
            </p>
          </div>
        </div>

        {/* Puzzle Area */}
        <div 
          className="h-full w-full flex items-center justify-center overflow-hidden"
          onMouseMove={handleDiskDrag}
          onMouseUp={handleDiskMouseUp}
          onMouseLeave={handleDiskMouseUp}
        >
          <div className="relative w-96 h-96">
            {Array(styleConfig.gradient.numLayers).fill(null).map((_, i) => {
              const [fromColor, toColor] = styleConfig.gradient.colors[currentColorIndex];
              const position = diskPositions[i] || { x: 0, y: 0 };
              
              return (
                <div 
                  key={i}
                  className="absolute inset-0 rounded-full cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
                  style={{
                    background: `linear-gradient(${gradientAngle}deg, ${fromColor}, ${toColor})`,
                    transform: `
                      rotate(${i * (360 / styleConfig.gradient.numLayers)}deg)
                      translate(${position.x}px, ${position.y}px)
                      scale(${isWon ? 1.1 : 1})
                    `,
                    opacity: isWon ? (0.9 - (i * 0.1)) : (0.7 - (i * 0.1)),
                    filter: `blur(${styleConfig.gradient.blurRange[0]}px)`,
                    transition: draggedDisk === i ? 'none' : 'all 0.5s ease-out'
                  }}
                  onMouseDown={(e) => handleDiskMouseDown(e, i)}
                >
                  {/* Center alignment dot */}
                  <div 
                    className="w-2 h-2 rounded-full bg-white opacity-50"
                    style={{
                      boxShadow: '0 0 5px rgba(255,255,255,0.5)'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValentinesWrappedShowcase;