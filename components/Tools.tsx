import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { DolarRate } from '../types';

// --- CONVERTER ---
export const Converter = ({ rates }: { rates: DolarRate[] }) => {
    const [amount, setAmount] = useState<string>('');
    const [type, setType] = useState('blue');
    
    const rate = rates.find(r => r.casa === type)?.venta || 0;
    const numericAmount = parseFloat(amount) || 0;
    
    const result = numericAmount * rate;

    return (
        <div className="flex flex-col gap-4">
             <div className="flex gap-2">
                 <div className="relative w-1/2 group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                    <input 
                        type="number" 
                        placeholder="USD"
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-7 pr-3 text-white outline-none focus:border-sky-500 focus:bg-slate-900 transition-all text-sm font-mono placeholder:text-slate-600" 
                    />
                 </div>
                 <select 
                    value={type} 
                    onChange={e => setType(e.target.value)} 
                    className="w-1/2 bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-white text-xs outline-none focus:border-sky-500 cursor-pointer"
                 >
                     {rates.map(r => <option key={r.casa} value={r.casa}>{r.nombre}</option>)}
                 </select>
             </div>
             
             <div className="relative">
                <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-[#0f172a] p-1 rounded-full border border-slate-800 text-slate-500">
                    <ArrowRightLeft size={12} />
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-xl text-center border border-slate-700/50 flex flex-col items-center justify-center">
                    <div className="text-[10px] uppercase text-slate-500 font-bold mb-1">Total Estimado (ARS)</div>
                    <div className="text-2xl font-mono font-bold text-emerald-400 tracking-tight">
                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(result)}
                    </div>
                    <div className="text-[9px] text-slate-600 mt-1">Tasa: ${rate}</div>
                </div>
             </div>
        </div>
    );
};

// --- SPREAD GAUGE ---
export const SpreadGauge = ({ buy, sell }: { buy: number, sell: number }) => {
    // Handling edge case where buy is 0 (often happens with "oficial" in some APIs)
    const validBuy = buy > 0 ? buy : sell * 0.95; 
    const spread = sell - validBuy;
    const pct = (spread / sell) * 100;
    
    let color = 'bg-emerald-500';
    let textColor = 'text-emerald-400';
    let label = 'Estable';
    
    if (pct > 4) { color = 'bg-yellow-500'; textColor = 'text-yellow-400'; label = 'Alto'; }
    if (pct > 8) { color = 'bg-rose-500'; textColor = 'text-rose-400'; label = 'Volátil'; }

    return (
        <div className="flex items-center gap-4 h-full">
            <div className="flex-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mb-2">
                    <span>Spread ({pct.toFixed(1)}%)</span>
                    <span className="text-white">${spread.toFixed(0)} ARS</span>
                </div>
                {/* Progress Bar Background */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    {/* Animated Bar */}
                    <div 
                        className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000`} 
                        style={{width: `${Math.min(pct * 8, 100)}%`}}
                    ></div>
                </div>
            </div>
            
            <div className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border border-white/5 bg-white/5 ${textColor} min-w-[70px] text-center backdrop-blur-sm`}>
                {label}
            </div>
        </div>
    );
};