import React, { useState, useEffect } from 'react';
import { PhoneOff, Mic, MicOff, User, Clock } from 'lucide-react';
import { memoWithDeepEqual } from '../utils/memoUtils';

export interface FloatingCallWidgetProps {
  leadName?: string;
  leadMobile?: string;
  onEndCall?: (durationSeconds?: number) => void;
}

const FloatingCallWidgetBase: React.FC<FloatingCallWidgetProps> = ({
  leadName = 'Karan Advani',
  leadMobile = '+91 98****4321',
  onEndCall,
}) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<'RINGING' | 'CONNECTED'>('RINGING');

  useEffect(() => {
    const ringTimeout = setTimeout(() => {
      setStatus('CONNECTED');
    }, 2000);
    return () => clearTimeout(ringTimeout);
  }, []);

  useEffect(() => {
    if (status !== 'CONNECTED') return;
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-700 text-white rounded-2xl shadow-2xl p-4 w-80 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status === 'CONNECTED' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            ></span>
          </span>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            {status === 'CONNECTED' ? 'VoIP Active' : 'Connecting...'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-medium bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
          <Clock className="w-3 h-3" />
          {formatTime(seconds)}
        </div>
      </div>

      <div className="py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
          <User className="w-4 h-4" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-100">{leadName}</div>
          <div className="text-[11px] text-slate-400">{leadMobile}</div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
            isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          <span>{isMuted ? 'Muted' : 'Mute'}</span>
        </button>

        <button
          onClick={() => {
            if (onEndCall) onEndCall(seconds);
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
};

export const FloatingCallWidget = memoWithDeepEqual(FloatingCallWidgetBase, 'FloatingCallWidget');
export default FloatingCallWidget;
