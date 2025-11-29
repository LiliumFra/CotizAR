import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InflationData } from '../types';

export const InflationCard = ({ data }: { data: InflationData[] }) => {
    if (!data || data.length === 0) return <div className="text-slate-500 text-xs p-4">Datos no disponibles</div>;

    const last = data[data.length - 1];
    const prev = data[data.length - 2];
    const diff = last.valor - prev.valor;
    const isUp = diff > 0;

    return (
        <div className="flex flex-col h-full w-full">
            <div className="flex justify-between items-end mb-4 px-1">
                <div>
                    <div className="text-2xl font-bold text-white font-mono">{last.valor}%</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Último Mes ({new Date(last.fecha).toLocaleDateString('es-AR', {month:'short', timeZone:'UTC'})})</div>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded ${isUp ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    {isUp ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}%
                </div>
            </div>
            
            <div className="flex-1 min-h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis 
                            dataKey="fecha" 
                            tickFormatter={(t) => new Date(t).toLocaleDateString('es-AR', {month:'short', timeZone:'UTC'})} 
                            stroke="#475569" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false}
                        />
                        <Tooltip 
                            cursor={{fill: '#1e293b'}}
                            contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', fontSize: '10px'}}
                        />
                        <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#f43f5e' : '#334155'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};