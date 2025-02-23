import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Waves } from 'lucide-react';

function ValentinesWrappedShowcase3() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [autoAnimatePos, setAutoAnimatePos] = useState({ x: 0, y: 0 });
  const [textOpacity, setTextOpacity] = useState(0);
  const [textFadeComplete, setTextFadeComplete] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);
  const [textWavePhase, setTextWavePhase] = useState(0);
  const lastInteractionTime = useRef(Date.now());
  const animationFrameRef = useRef();
  const fadeInTimeoutRef = useRef();

  const styleConfig = {
    waves: {
      colors: [
        ['#00c6ff', '#0072ff'],
        ['#43e97b', '#38f9d7'],
        ['#f8b1f1', '#8d72e1'],
      ],
      numWaves: 7,
      animationDuration: 40,
      animationParams: {
        waveRotationIncrement: 25,
        wavePhaseIncrement: 0.015,
        translateYMultiplier: 110,
        waveScale: 2.2,
        borderRadius: '45%',
        filter: 'blur(15px)',
        opacity: 0.25,
        mouseInfluence: 50
      }
    }
  };

  const [currentWavesColorIndex, setCurrentWavesColorIndex] = useState(0);

  // Handle user interaction
  const handleInteraction = useCallback(() => {
    if (textFadeComplete) return;
    
    lastInteractionTime.current = Date.now();
    setTextOpacity(0);
    if (fadeInTimeoutRef.current) {
      clearTimeout(fadeInTimeoutRef.current);
    }
    
    fadeInTimeoutRef.current = setTimeout(() => {
      const fadeIn = () => {
        const elapsed = Date.now() - lastInteractionTime.current - 11000;
        if (elapsed >= 0) {
          const newOpacity = Math.min(elapsed / 4000, 1);
          setTextOpacity(newOpacity);
          if (newOpacity < 1) {
            requestAnimationFrame(fadeIn);
          } else {
            setTextFadeComplete(true);
          }
        }
      };
      fadeIn();
    }, 11000);
  }, [textFadeComplete]);

  // Auto-animation when idle
  useEffect(() => {
    let startTime = Date.now();
    
    const animate = () => {
      const t = (Date.now() - startTime) / 16000;
      setAutoAnimatePos({
        x: Math.sin(t) * 0.5,
        y: Math.cos(t * 1.3) * 0.5
      });
      setWavePhase(prev => (prev + styleConfig.waves.animationParams.wavePhaseIncrement) % (Math.PI * 2));
      setTextWavePhase(prev => (prev + 0.02) % (Math.PI * 2));
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
    handleInteraction();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (fadeInTimeoutRef.current) {
        clearTimeout(fadeInTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - bounds.left) / bounds.width - 0.5) * 2,
      y: ((e.clientY - bounds.top) / bounds.height - 0.5) * 2
    });
    handleInteraction();
  }, [handleInteraction]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWavesColorIndex(prev => (prev + 1) % styleConfig.waves.colors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Create text chunks for wave effect
  const textChunks = Array(160).fill(null).map((_, rowIndex) => (
    <div
      key={rowIndex}
      className="whitespace-pre"
      style={{
        opacity: 0.45 + (Math.sin(textWavePhase + rowIndex * 0.2) * 0.25)
      }}
    >
      {Array(70).fill('I LOVE YOU❤️').join('')}
    </div>
  ));

  return (
    <div 
      className="w-full h-screen flex flex-col bg-black"
      onMouseMove={handleMouseMove}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onKeyDown={handleInteraction}
      tabIndex={0}
    >
      
      <div className="flex-1 relative bg-black">
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {Array(styleConfig.waves.numWaves).fill(null).map((_, i) => {
            const [fromColor, toColor] = styleConfig.waves.colors[currentWavesColorIndex];
            const phase = wavePhase + i * 0.5 + (mousePos.y || autoAnimatePos.y) * 2;
            
            return (
              <div 
                key={i}
                className="absolute w-full h-64 z-0"
                style={{
                  background: `linear-gradient(90deg, ${fromColor}, ${toColor})`,
                  transform: `
                    rotate(${i * styleConfig.waves.animationParams.waveRotationIncrement}deg)
                    translateY(${Math.sin(phase) * styleConfig.waves.animationParams.translateYMultiplier}px)
                    scale(${styleConfig.waves.animationParams.waveScale + Math.sin(wavePhase + i * 0.3) * 0.2})
                    translate(
                      ${(mousePos.x || autoAnimatePos.x) * styleConfig.waves.animationParams.mouseInfluence}px,
                      ${(mousePos.y || autoAnimatePos.y) * styleConfig.waves.animationParams.mouseInfluence}px
                    )
                  `,
                  opacity: styleConfig.waves.animationParams.opacity,
                  borderRadius: styleConfig.waves.animationParams.borderRadius,
                  filter: styleConfig.waves.animationParams.filter,
                  transition: 'all 0.3s ease-out'
                }}
              />
            );
          })}
        </div>
        
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{
            opacity: textOpacity,
            transition: 'opacity 4s ease-out',
            fontFamily: 'Arial Narrow, sans-serif'
          }}
        >
          <div 
            className="w-full h-full flex flex-col items-center justify-center"
            style={{
              fontSize: '0.9rem',
              lineHeight: '0.9',
              letterSpacing: '-0.05em',
              fontWeight: 'bold',
              color: 'white',
              wordBreak: 'break-all',
              padding: '0.1rem'
            }}
          >
            {textChunks}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ValentinesWrappedShowcase3;