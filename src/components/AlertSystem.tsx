import React, { useState, useEffect } from 'react';
import { TrendingUp, X, AlertOctagon } from 'lucide-react';

interface Props {
    blueValue: number;
    riskValue: number;
}

export const AlertSystem: React.FC<Props> = ({ blueValue, riskValue }) => {
    // Initialize from localStorage to remember dismissed alerts
    const [dismissed, setDismissed] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('cotizar_dismissed_alerts');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });

    // Save to localStorage whenever dismissed list changes
    useEffect(() => {
        localStorage.setItem('cotizar_dismissed_alerts', JSON.stringify(dismissed));
    }, [dismissed]);

    const alerts = [];

    // Definición de Umbrales
    const THRESHOLD_BLUE = 1200;
    const THRESHOLD_RISK = 1800;

    // Lógica de Alerta Dólar Blue
    if (blueValue > THRESHOLD_BLUE) {
        alerts.push({
            id: 'alert-blue-high',
            level: 'warning', // Nivel medio
            icon: TrendingUp,
            title: 'Cotización Elevada',
            message: `El Dólar Blue ha superado los $${THRESHOLD_BLUE}. Valor actual: $${blueValue}.`
        });
    }

    // Lógica de Alerta Riesgo País
    if (riskValue > THRESHOLD_RISK) {
        alerts.push({
            id: 'alert-risk-critical',
            level: 'critical', // Nivel alto
            icon: AlertOctagon,
            title: 'Riesgo País Crítico',
            message: `El índice superó los ${THRESHOLD_RISK} puntos básicos (${riskValue} pts).`
        });
    }

    // Filtrar alertas descartadas por el usuario
    const activeAlerts = alerts.filter(a => !dismissed.includes(a.id));

    if (activeAlerts.length === 0) return null;

    return (
        <div className="space-y-3 mb-6 animate-in slide-in-from-top-2 duration-500">
            {activeAlerts.map(alert => (
                <div 
                    key={alert.id}
                    className={`
                        relative flex items-start gap-4 p-4 rounded-xl border backdrop-blur-md shadow-lg
                        ${alert.level === 'critical' 
                            ? 'bg-rose-950/30 border-rose-500/40 text-rose-200 shadow-rose-900/10' 
                            : 'bg-amber-950/30 border-amber-500/40 text-amber-200 shadow-amber-900/10'
                        }
                    `}
                >
                    {/* Icono con Glow */}
                    <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${alert.level === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        <alert.icon size={20} />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2 ${alert.level === 'critical' ? 'text-rose-400' : 'text-amber-400'}`}>
                            {alert.title}
                            <span className="flex h-2 w-2 relative">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${alert.level === 'critical' ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${alert.level === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                            </span>
                        </h4>
                        <p className="text-sm font-medium opacity-90 leading-snug">
                            {alert.message}
                        </p>
                    </div>

                    {/* Botón Cerrar */}
                    <button 
                        onClick={() => setDismissed(prev => [...prev, alert.id])}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors opacity-60 hover:opacity-100"
                        aria-label="Cerrar alerta"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
};