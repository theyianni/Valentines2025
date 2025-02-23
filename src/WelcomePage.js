import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

function WelcomePage({ onStart }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-500 to-red-500 text-white"
      style={{
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
      
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-6 tracking-tight">
          For Sabrina
        </h1>
        <p className="text-2xl mb-12 opacity-80">
        </p>
        
        {showButton && (
          <button 
            onClick={onStart}
            className="flex items-center justify-center gap-3 mx-auto px-8 py-4 bg-white text-red-500 rounded-full text-xl font-semibold hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg"
          >
            <Heart className="animate-pulse" />
            Start
            <Heart className="animate-pulse" />
          </button>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;