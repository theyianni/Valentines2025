import React from 'react';
import { Heart } from 'lucide-react';

function ValentinesCard() {
  return (
    <div 
      className="w-full min-h-screen"
      style={{ 
        background: 'linear-gradient(-45deg, #ff1b6b, #ff8177, #ff3cac, #b829ca)',
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
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
        
          {/* Card Header */}
          <div className="bg-red-50 p-3 text-center">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold text-red-600 mb-2">For My Maybeeb</h1>
            <p className="text-red-400 italic">February 23, 2025</p>
          </div>
          
          {/* Card Content */}
          <div className="p-6">
            <div className="prose prose-lg mx-auto">
              <p className="text-gray-700 leading-relaxed mb-6">
                Dearest dearest,
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
              You make me so unbelievably happy in a way that feels foreign to me. I said it before, and I'll keep saying it:
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
              I'm the luckiest person in the world when you're around.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                Thank you for being you, for loving me, and being the best part of every day.
              </p>
              
              <p className="text-gray-700 text-right italic mt-8">
                Love,<br />
                Your Maybeeb
              </p>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-red-50 p-2 text-center">
            <p className="text-sm text-red-400">
              Happy Valentine's Day, my love ❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ValentinesCard;