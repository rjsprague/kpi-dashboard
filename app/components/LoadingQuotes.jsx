
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { loadingQuotes } from '../lib/loadingQuotes';


export default function LoadingQuotes({ mode }) {
  const [quote, setQuote] = useState('');
  const circle1 = useRef(null);
  const circle2 = useRef(null);
  const circle3 = useRef(null);

  useEffect(() => {
    setQuote(loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)]);

    const interval = setInterval(() => {
      setQuote(loadingQuotes[Math.floor(Math.random() * loadingQuotes.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.to(circle1.current, { rotation: 1280, repeat: -1, duration: 5 });
    gsap.to(circle2.current, { rotation: -1280, repeat: -1, duration: 5 });
    gsap.to(circle3.current, { rotation: 1280, repeat: -1, duration: 5 });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-8 align-middle min-h-60">
      <div className="relative w-24 h-24">
        <svg ref={circle1} className="absolute top-0 left-0 w-full h-full" viewBox="0 0 50 50" style={{ transform: 'rotate(120deg)' }}>
          <path d="M25 25 m -20, 0 a 20,20 0 1,0 40,0" fill="none" stroke={mode === 'light' ? 'blue' : 'white'} strokeWidth="2" strokeOpacity={0.8} />
        </svg>
        <svg ref={circle2} className="absolute top-0 left-0 w-full h-full" viewBox="0 0 50 50" style={{ transform: 'rotate(240deg)' }}>
          <path d="M25 25 m -15, 0 a 15,15 0 1,1 30,0" fill="none" stroke={mode === 'light' ? 'gray' : 'white'} strokeWidth="3" strokeOpacity={0.6} />
        </svg>
        <svg ref={circle3} className="absolute top-0 left-0 w-full h-full" viewBox="0 0 50 50" style={{ transform: 'rotate(360deg)' }}>
          <path d="M25 25 m -10, 0 a 10,10 0 1,0 20,0" fill="none" stroke={mode === 'light' ? 'blue' : 'white'} strokeWidth="4" strokeOpacity={0.4} />
        </svg>
      </div>
      <p className={`text-xl font-semibold text-center ${mode === 'light' ? 'text-blue-900' : 'text-white'}`}>{quote}</p>
    </div>
  );
}