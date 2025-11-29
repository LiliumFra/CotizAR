import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  icon?: LucideIcon;
  className?: string;
  active?: boolean;
  tools?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, title, icon: Icon, className = "", active = false, tools, footer }) => (
    <div className={`flex flex-col bg-[#0f172a]/40 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 relative group
        ${active ? 'border-sky-500/50 shadow-[0_0_25px_rgba(14,165,233,0.15)]' : 'border-slate-800/80 hover:border-sky-500/30'} ${className}`}>
        
        {/* Active Line Indicator (Flag colors) */}
        {active && (
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-sky-300 via-white to-sky-300 shadow-[0_0_10px_#7dd3fc]"></div>
        )}

        {(title || Icon) && (
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/50 bg-slate-900/40">
                <div className="flex items-center gap-2.5">
                    {Icon && (
                        <div className={`p-1.5 rounded-lg ${active ? 'bg-sky-500/10 text-sky-400' : 'bg-slate-800 text-slate-400 group-hover:text-sky-400'} transition-colors`}>
                            <Icon size={14} />
                        </div>
                    )}
                    <span className="text-[11px] font-bold text-slate-200 uppercase tracking-widest">{title}</span>
                </div>
                {tools && <div className="flex items-center gap-2">{tools}</div>}
            </div>
        )}
        
        <div className="flex-1 p-5 relative z-10 flex flex-col min-h-0">
            {children}
        </div>

        {footer && (
            <div className="px-5 py-3 border-t border-slate-800/50 bg-slate-950/30 text-[10px] text-slate-500">
                {footer}
            </div>
        )}
    </div>
);