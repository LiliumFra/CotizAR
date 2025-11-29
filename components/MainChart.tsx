import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { HistoryPoint, ChartStats, TimeFrame } from '../types';
import { RefreshCw } from 'lucide-react';

interface Props {
    history: HistoryPoint[];
    stats: ChartStats;
    timeframe: TimeFrame;
    setTimeframe: (t: TimeFrame) => void;
    loading: boolean;
    currentValue: number;
}

// Custom Tooltip to show detailed data including SMA
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#0f172a]/95 backdrop-blur-md border border-sky-500/30 p-3 rounded-xl shadow-2xl shadow-black/50 min-w-[150px]">
                <p className="text-slate-400 text-[10px] font-mono mb-2 uppercase tracking-wider border-b border-slate-700/50 pb-1">
                    {label}
                </p>
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_5px_currentColor]"></span>
                            Precio
                        </span>
                        <span className="text-sm font-mono font-bold text-white tracking-tight">
                            ${Math.round(data.value)}
                        </span>
                    </div>
                    {data.sma && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_5px_currentColor]"></span>
                                Promedio
                            </span>
                            <span className="text-sm font-mono font-bold text-yellow-100 tracking-tight opacity-90">
                                ${Math.round(data.sma)}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

export const MainChart: React.FC<Props> = ({ history, stats, timeframe, setTimeframe, loading, currentValue }) => {
    
    // Formatting
    const formatMoney = (val: number) => `$${Math.round(val)}`;
    const pctChange = stats.start > 0 ? ((stats.end - stats.start) / stats.start) * 100 : 0;
    const isPositive = pctChange >= 0;

    // Argentine Flag Colors for Chart
    const CHART_COLOR = "#38bdf8"; // Sky-400

    return (
        <div className="h-full flex flex-col w-full">
            {/* Chart Header Stats */}
            <div className="flex flex-wrap justify-between items-end mb-6 gap-4 px-1">
                <div>
                     <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-mono font-bold text-white tracking-tighter shadow-sky-900 drop-shadow-lg">
                            {formatMoney(currentValue || (history.length ? history[history.length-1].value : 0))}
                        </span>
                        {history.length > 0 && (
                            <div className={`flex items-center px-2 py-0.5 rounded text-sm font-bold ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                {isPositive ? '+' : ''}{pctChange.toFixed(2)}%
                            </div>
                        )}
                     </div>
                     <div className="text-[10px] text-slate-400 mt-1 font-medium">
                        Min: <span className="text-slate-300">{formatMoney(stats.min)}</span> - Max: <span className="text-slate-300">{formatMoney(stats.max)}</span>
                     </div>
                </div>

                {/* Timeframe Selector */}
                <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    {(['1M', '3M', '1Y'] as TimeFrame[]).map(tf => (
                        <button 
                            key={tf} 
                            onClick={()=>setTimeframe(tf)} 
                            className={`px-3 py-1 text-[10px] font-bold rounded transition-colors ${timeframe === tf ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:text-sky-400'}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 min-h-[250px] w-full relative">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0f172a]/20 backdrop-blur-[2px]">
                        <RefreshCw className="animate-spin text-sky-400 opacity-80" />
                    </div>
                )}
                
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_COLOR} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={CHART_COLOR} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            minTickGap={40} 
                            dy={10} 
                        />
                        <YAxis 
                            domain={['auto', 'auto']} 
                            stroke="#64748b" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={formatMoney} 
                        />
                        
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ stroke: '#38bdf8', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.5 }} 
                        />
                        
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            name="Precio" 
                            stroke={CHART_COLOR} 
                            strokeWidth={2} 
                            fill="url(#chartGrad)" 
                            activeDot={{r: 4, fill:'#facc15', stroke: '#fff', strokeWidth: 2}} 
                            animationDuration={1000}
                        />
                        {/* SMA Line */}
                        <ReferenceLine 
                            y={stats.sma30} 
                            stroke="#facc15" 
                            strokeDasharray="3 3" 
                            opacity={0.8} 
                            label={{ value: 'PROM.', fill: '#facc15', fontSize: 9, position: 'insideRight' }} 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};