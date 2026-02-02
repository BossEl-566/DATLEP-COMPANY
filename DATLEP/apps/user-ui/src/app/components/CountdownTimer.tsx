'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = endDate.getTime();
      const difference = end - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, expired: false };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <div className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
        Sale Ended
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white p-2 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span className="text-xs font-semibold">Sale Ends In:</span>
        </div>
        <div className="flex gap-1">
          {timeLeft.days > 0 && (
            <div className="text-center px-1">
              <div className="text-xs font-bold">{timeLeft.days.toString().padStart(2, '0')}</div>
              <div className="text-[10px] opacity-80">Days</div>
            </div>
          )}
          <div className="text-center px-1">
            <div className="text-xs font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
            <div className="text-[10px] opacity-80">Hrs</div>
          </div>
          <div className="text-center px-1">
            <div className="text-xs font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
            <div className="text-[10px] opacity-80">Min</div>
          </div>
          <div className="text-center px-1">
            <div className="text-xs font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
            <div className="text-[10px] opacity-80">Sec</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;