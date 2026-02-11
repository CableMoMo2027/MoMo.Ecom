import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

const FlashSaleBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 34, seconds: 56 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#141E30] to-[#3F5E96] py-6 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Zap size={32} className="text-yellow-300 animate-pulse" />
          <div>
            <h3 className="text-white font-bold text-2xl">Flash Sale! Up to 50% OFF</h3>
            <p className="text-white/80">Limited time offer on selected items</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-black/30 backdrop-blur rounded-lg px-4 py-2 text-center">
            <div className="text-3xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-white/70 text-sm">Hours</div>
          </div>
          <div className="bg-black/30 backdrop-blur rounded-lg px-4 py-2 text-center">
            <div className="text-3xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-white/70 text-sm">Minutes</div>
          </div>
          <div className="bg-black/30 backdrop-blur rounded-lg px-4 py-2 text-center">
            <div className="text-3xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-white/70 text-sm">Seconds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;