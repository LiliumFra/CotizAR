import React from 'react';
import { NewsItem } from '../types';
import { Radio } from 'lucide-react';

export const NewsTicker = ({ news }: { news: NewsItem[] }) => {
    return (
        <div className="w-full bg-[#020617] border-b border-slate-800 h-8 flex items-center overflow-hidden relative z-40">
            <div className="bg-slate-900 h-full px-3 flex items-center gap-2 border-r border-slate-800 z-10 shrink-0">
                <Radio size={12} className="text-sky-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-300 uppercase">En Vivo</span>
            </div>
            <div className="flex whitespace-nowrap animate-marquee items-center">
                {[...news, ...news].map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex items-center gap-2 mx-6 opacity-70 hover:opacity-100 transition-opacity">
                        <span className={`w-1.5 h-1.5 rounded-full ${item.sentiment === 'positive' ? 'bg-emerald-500' : item.sentiment === 'negative' ? 'bg-rose-500' : 'bg-slate-500'}`}></span>
                        <span className="text-xs text-slate-300 font-medium">{item.title}</span>
                        <span className="text-[10px] text-slate-600 font-mono">[{item.source}]</span>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};