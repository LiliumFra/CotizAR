import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
    current: number;
    avg: number;
}

export const MarketThermometer: React.FC<Props> = ({ current, avg }) => {
    if (!current || !avg) return null;

    const diff = ((current - avg) / avg) * 100;
    
    // Logic: 
    // < -2% = Opportunity (Barato)
    // -2% to 2% = Neutral (Precio Justo)
    // > 2% = Expensive (Caro/Esperar)
    
    let status = 'NEUTRAL';
    let color = 'text-slate-300';
    let bgColor = 'bg-slate-500';
    let message = 'Precio acorde al promedio mensual.';
    let Icon = Minus;

    if (diff < -1.5) {
        status = 'OPORTUNIDAD';
        color = 'text-emerald-400';
        bgColor = 'bg-emerald-500';
        message = 'El dólar está por debajo de su media.';
        Icon = TrendingDown;
    } else if (diff > 1.5) {
        status = 'CALIENTE';
        color = 'text-rose-400';
        bgColor = 'bg-rose-500';
        message = 'Precio por encima de la media mensual.';
        Icon = TrendingUp;
    }

    // Gauge Position (0 to 100)
    // -5% diff -> 0 position
    // +5% diff -> 100 position
    const position = Math.min(Math.max(((diff + 5) / 10) * 100, 0), 100);

    return (
        <div className="flex flex-col gap-3 h-full justify-center">
            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Temperatura del Mercado</div>
                    <div className={`text-lg font-mono font-bold ${color} flex items-center gap-2`}>
                        {status} <Icon size={16} />
                    </div>
                </div>
                <div className="text-right">
                     <span className={`text-xs px-2 py-1 rounded border border-white/5 ${color} bg-white/5`}>
                         {diff > 0 ? '+' : ''}{diff.toFixed(2)}%
                     </span>
                </div>
            </div>

            <div className="relative h-4 w-full bg-slate-900 rounded-full border border-slate-700 overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-slate-500/20 to-rose-500/20"></div>
                
                {/* Zones Lines */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600"></div>
                <div className="absolute left-[30%] top-0 bottom-0 w-0.5 bg-slate-800 border-l border-dashed border-slate-600 opacity-30"></div>
                <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-slate-800 border-l border-dashed border-slate-600 opacity-30"></div>

                {/* Indicator */}
                <div 
                    className={`absolute top-0 bottom-0 w-2 h-full ${bgColor} shadow-[0_0_10px_currentColor] transition-all duration-1000`}
                    style={{ left: `calc(${position}% - 4px)` }}
                ></div>
            </div>

            <p className="text-[10px] text-slate-500 text-center italic mt-1">
                "{message}"
            </p>
        </div>
    );
};