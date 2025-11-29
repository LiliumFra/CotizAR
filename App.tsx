import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, Calculator, Sun, Home, 
  Wallet, Grid, Flame, ExternalLink, Activity, Share2, TrendingUp,
  AlertTriangle, RefreshCw
} from 'lucide-react';
import { fetchMarketData, fetchRateHistory } from './services/api';
import { MarketData, TimeFrame, HistoryPoint, ChartStats } from './types';
import { Card } from './components/Card';
import { CryptoTicker } from './components/CryptoTicker';
import { MainChart } from './components/MainChart';
import { Converter, SpreadGauge } from './components/Tools';
import { InflationCard } from './components/InflationCard';
import { NewsTicker } from './components/NewsTicker';
import { MarketThermometer } from './components/MarketThermometer';
import { AlertSystem } from './components/AlertSystem';
import { AdBanner } from './components/AdBanner';

const App = () => {
    // State
    const [data, setData] = useState<MarketData>({
        rates: [],
        riesgo: 0,
        inflation: [],
        crypto: null,
        news: [],
        lastUpdate: null,
        loading: true
    });
    
    const [error, setError] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState('blue');
    const [timeframe, setTimeframe] = useState<TimeFrame>('1M');
    // Mobile Navigation State
    const [activeTab, setActiveTab] = useState<'home' | 'crypto' | 'tools'>('home');
    
    // Chart State
    const [history, setHistory] = useState<HistoryPoint[]>([]);
    const [chartStats, setChartStats] = useState<ChartStats>({ sma30: 0, min: 0, max: 0, start: 0, end: 0, change: 0 });
    const [chartLoading, setChartLoading] = useState(false);

    // Fetch Logic
    const loadData = useCallback(async (isRetry = false) => {
        if (isRetry) {
             setData(prev => ({ ...prev, loading: true }));
             setError(null);
        }

        try {
            const marketData = await fetchMarketData();
            setData(marketData);
            setError(null);
        } catch (e) {
            console.error(e);
            // Only set global error if we don't have data yet, otherwise just a quiet fail (or toast)
            setError("No se pudieron obtener los datos actualizados. Verificá tu conexión.");
            setData(prev => ({ ...prev, loading: false }));
        }
    }, []);

    // Initial Data Fetch
    useEffect(() => {
        loadData();
        const interval = setInterval(() => loadData(), 60000); // 1 min refresh
        return () => clearInterval(interval);
    }, [loadData]);

    // History Fetch when selection changes
    useEffect(() => {
        const loadHistory = async () => {
            setChartLoading(true);
            const rawHistory = await fetchRateHistory(selectedType, timeframe);
            
            if (rawHistory.length > 0) {
                const values = rawHistory.map((d: any) => d.venta);
                const sma = values.reduce((a: number, b: number) => a + b, 0) / values.length;
                
                const points = rawHistory.map((d: any) => ({
                    dateRaw: d.fecha,
                    date: new Date(d.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }),
                    value: d.venta,
                    sma: sma
                }));

                setHistory(points);
                setChartStats({
                    sma30: sma,
                    min: Math.min(...values),
                    max: Math.max(...values),
                    start: values[0],
                    end: values[values.length - 1],
                    change: 0
                });
            } else {
                setHistory([]);
            }
            setChartLoading(false);
        };
        loadHistory();
    }, [selectedType, timeframe]);

    // Helpers
    const getRate = (c: string) => data.rates.find(r => r.casa === c) || {venta:0, compra:0, nombre: c, casa: c, moneda: 'USD', fechaActualizacion: ''};
    const currentRate = getRate(selectedType);
    const blueRate = getRate('blue');

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'CotizAR - Dólar Hoy',
                    text: `El Dólar ${currentRate.nombre} está a $${currentRate.venta}. Miralo en CotizAR.`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            alert(`Dólar ${currentRate.nombre}: $${currentRate.venta}`);
        }
    };

    // LOADING SCREEN
    if (data.loading && !data.rates.length && !error) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-6">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-t-2 border-sky-400 rounded-full animate-spin"></div>
                    <div className="absolute inset-3 border-r-2 border-yellow-400 rounded-full animate-spin direction-reverse"></div>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-mono uppercase tracking-[0.4em] text-sky-400 animate-pulse">CotizAR</span>
                </div>
            </div>
        );
    }

    // ERROR SCREEN
    if (error && !data.rates.length) {
        return (
             <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-8 p-6">
                <div className="relative group">
                    <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full group-hover:bg-rose-500/30 transition-all duration-500"></div>
                    <div className="relative bg-[#0f172a] border border-rose-500/30 p-8 rounded-full flex items-center justify-center shadow-2xl">
                        <AlertTriangle size={48} className="text-rose-500" />
                    </div>
                </div>
                
                <div className="text-center max-w-md space-y-3">
                    <h2 className="text-2xl font-bold text-white tracking-tight">Conexión Interrumpida</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">
                        {error}
                    </p>
                </div>

                <button 
                    onClick={() => loadData(true)} 
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-sky-900/30 active:scale-95"
                >
                    <RefreshCw size={20} className={data.loading ? 'animate-spin' : ''} /> 
                    {data.loading ? 'Reintentando...' : 'Reintentar'}
                </button>
            </div>
        );
    }

    // --- RENDER SECTIONS ---

    // 1. HOME SECTION (Rates Grid + Main Chart)
    const renderHome = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* FIAT GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {['blue', 'oficial', 'bolsa', 'contadoconliqui', 'tarjeta', 'cripto'].map(t => {
                    const r = getRate(t);
                    if (t === 'tarjeta' && r.venta === 0) return null; // Skip if API missing tarjeta
                    
                    const isActive = selectedType === t;
                    return (
                        <button key={t} onClick={()=>setSelectedType(t)} 
                            className={`flex flex-col p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group
                                ${isActive ? 'bg-slate-900 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)]' : 'bg-[#111827]/40 border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/60'}
                            `}>
                            {isActive && (
                                <>
                                    <div className="absolute top-0 left-0 w-1 h-full bg-sky-400"></div>
                                    <div className="absolute top-0 right-0 p-1.5">
                                        {chartLoading ? (
                                            <RefreshCw size={12} className="text-sky-400 animate-spin opacity-80" />
                                        ) : (
                                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_5px_#facc15]"></div>
                                        )}
                                    </div>
                                </>
                            )}
                            
                            <span className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-sky-500/70'}`}>
                                {r.nombre}
                            </span>
                            <span className={`text-xl font-mono font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                ${r.venta}
                            </span>
                        </button>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <Card 
                        title={`Tendencia: ${currentRate.nombre}`} 
                        icon={BarChart3} 
                        className="min-h-[450px]" 
                        active
                        tools={
                            <button onClick={handleShare} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-sky-400 transition-colors">
                                <Share2 size={16} />
                            </button>
                        }
                        footer={
                            <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400"></span> Fuente: BCRA & DolarAPI</span>
                                <span>Act: {data.lastUpdate?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        }
                    >
                        <MainChart 
                            history={history} 
                            stats={chartStats} 
                            timeframe={timeframe} 
                            setTimeframe={setTimeframe} 
                            loading={chartLoading}
                            currentValue={currentRate.venta}
                        />
                    </Card>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-6">
                     <Card title="Termómetro" icon={Activity}>
                        <MarketThermometer current={currentRate.venta} avg={chartStats.sma30} />
                     </Card>
                     <Card title="Calidad del Precio" icon={Activity}>
                        <SpreadGauge buy={currentRate.compra} sell={currentRate.venta} />
                     </Card>
                </div>
            </div>
        </div>
    );

    // 2. CRYPTO SECTION
    const renderCrypto = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
             <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-6 rounded-2xl border border-indigo-500/20 mb-6">
                 <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                     <Wallet className="text-indigo-400" /> Mercado Cripto
                 </h2>
                 <p className="text-sm text-slate-400">Cotizaciones en tiempo real y oportunidades de arbitraje.</p>
             </div>
             <CryptoTicker crypto={data.crypto} />
             
             {/* Extra Crypto Insights */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Dólar Bitcoin (Implícito)" icon={TrendingUp}>
                    <div className="flex items-center justify-between h-full p-2">
                        <div>
                             <div className="text-xs text-slate-500 uppercase font-bold mb-1">Cotización BTC/ARS</div>
                             <div className="text-2xl font-mono text-white font-bold">
                                {data.crypto ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits:0}).format(data.crypto.bitcoin.ars / data.crypto.bitcoin.usd) : '---'}
                             </div>
                        </div>
                        <div className="text-right">
                             <div className="text-[10px] text-slate-500">Referencia</div>
                             <div className="text-xs text-orange-400 font-bold">Sin restricciones</div>
                        </div>
                    </div>
                </Card>
             </div>
        </div>
    );

    // 3. TOOLS SECTION
    const renderTools = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Calculadora de Cambio" icon={Calculator}>
                    <Converter rates={data.rates} />
                </Card>
                
                <Card title="Inflación Mensual (Indec)" icon={Flame} className="min-h-[250px]">
                        <InflationCard data={data.inflation} />
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Brecha Oficial" icon={Activity}>
                     <div className="flex flex-col items-center justify-center h-full py-4">
                        <div className="text-4xl font-mono font-bold text-white mb-2">
                            {(() => {
                                const ofi = data.rates.find(r => r.casa === 'oficial')?.venta || 1;
                                const blue = data.rates.find(r => r.casa === 'blue')?.venta || 1;
                                return ((blue - ofi) / ofi * 100).toFixed(1) + '%';
                            })()}
                        </div>
                        <div className="text-xs text-slate-500 uppercase">Blue vs Oficial</div>
                     </div>
                </Card>
                
                <div className="md:col-span-2 p-5 rounded-xl border border-sky-900/30 bg-gradient-to-br from-slate-900 to-[#020617] relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-white"><Sun size={100}/></div>
                        <div className="flex items-center gap-2 text-sky-500 mb-2"><ExternalLink size={16} /> <span className="text-xs font-bold uppercase">Sobre CotizAR</span></div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-md z-10">
                            CotizAR agrega información financiera pública de múltiples fuentes (BCRA, Mercados, Blockchain) para ofrecer un panel unificado y gratuito para todos los argentinos.
                        </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-sky-500/30 flex flex-col pb-24 md:pb-0">
            {/* Background Texture & Flag Gradient */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23fff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
            <div className="fixed top-0 left-0 w-full h-32 bg-gradient-to-b from-sky-900/20 to-transparent pointer-events-none z-0"></div>

            <NewsTicker news={data.news} />

            {/* HEADER */}
            <header className="sticky top-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-b border-sky-900/30">
                <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Sol de Mayo Icon */}
                        <div className="w-9 h-9 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] text-[#020617] relative shrink-0">
                            <Sun size={20} fill="currentColor" className="animate-[spin_60s_linear_infinite]" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-white uppercase tracking-wider leading-none">
                                Cotiz<span className="text-sky-400">AR</span>
                            </h1>
                            <span className="text-[9px] text-sky-500/80 font-mono tracking-wide hidden sm:block">TERMINAL FINANCIERA</span>
                        </div>
                    </div>
                    
                    {/* Header Stats */}
                    <div className="flex items-center gap-4">
                         {error && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-[10px] font-bold animate-pulse">
                                <AlertTriangle size={14} />
                                <span>Problemas de conexión</span>
                            </div>
                         )}
                         
                         <div className="flex items-center gap-3 sm:gap-4">
                             {/* Dolar Blue Clickable Stat */}
                             <button 
                                onClick={() => {
                                    setSelectedType('blue');
                                    setActiveTab('home');
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="flex flex-col items-end group cursor-pointer"
                             >
                                <span className="text-[9px] uppercase font-bold text-slate-500 group-hover:text-sky-400 transition-colors flex items-center gap-1">
                                    Dólar Blue
                                </span>
                                <span className="text-xs font-mono font-bold text-white bg-slate-800 group-hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 group-hover:border-sky-500/30 transition-all">
                                    ${blueRate.venta}
                                </span>
                             </button>

                             {/* Divider */}
                             <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

                             {/* Riesgo Pais Clickable Stat */}
                             <button 
                                onClick={() => {
                                    // Scroll to alerts/thermometer area for context
                                    const el = document.getElementById('alerts-section');
                                    if(el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="flex flex-col items-end group cursor-pointer"
                             >
                                <span className="text-[9px] uppercase font-bold text-slate-500 group-hover:text-rose-400 transition-colors flex items-center gap-1">
                                    Riesgo País
                                </span>
                                <span className="text-xs font-mono font-bold text-white bg-slate-800 group-hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 group-hover:border-rose-500/30 transition-all">
                                    {data.riesgo}
                                </span>
                             </button>
                         </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1400px] mx-auto w-full p-4 md:p-6 overflow-y-auto z-10">
                
                {/* SYSTEM ALERTS - ID added for scrolling */}
                <div id="alerts-section">
                    <AlertSystem 
                        blueValue={data.rates.find(r => r.casa === 'blue')?.venta || 0}
                        riskValue={data.riesgo}
                    />
                </div>

                {/* AD BANNER - ZONE: High Visibility, Non-intrusive */}
                <AdBanner />

                {/* DESKTOP VIEW: Show everything in a grid */}
                <div className="hidden md:block space-y-8 mt-4">
                    {renderHome()}
                    {renderCrypto()}
                    {renderTools()}
                </div>

                {/* MOBILE VIEW: Show based on Tab */}
                <div className="md:hidden h-full mt-4">
                    {activeTab === 'home' && renderHome()}
                    {activeTab === 'crypto' && renderCrypto()}
                    {activeTab === 'tools' && renderTools()}
                </div>

            </main>

            {/* MOBILE NAVIGATION TABS */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#020617]/95 backdrop-blur-xl border-t border-slate-800 flex justify-around p-2 z-50 safe-area-bottom pb-6 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                 <button onClick={()=>setActiveTab('home')} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${activeTab==='home' ? 'text-sky-400 bg-sky-500/10' : 'text-slate-500'}`}>
                     <Home size={20} />
                     <span className="text-[9px] font-bold">Inicio</span>
                 </button>
                 <button onClick={()=>setActiveTab('crypto')} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${activeTab==='crypto' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}>
                     <Wallet size={20} />
                     <span className="text-[9px] font-bold">Cripto</span>
                 </button>
                 <button onClick={()=>setActiveTab('tools')} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${activeTab==='tools' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500'}`}>
                     <Grid size={20} />
                     <span className="text-[9px] font-bold">Herram.</span>
                 </button>
            </div>
        </div>
    );
};

export default App;