import React from 'react';
import { Bitcoin, Zap, DollarSign, Activity, Wallet } from 'lucide-react';
import { CryptoMarket } from '../types';

interface Props {
    crypto: CryptoMarket | null;
}

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(v);
const fmtArs = (v: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

export const CryptoTicker: React.FC<Props> = ({ crypto }) => {
    if (!crypto) return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-slate-900/50 rounded-xl border border-slate-800"></div>)}
        </div>
    );
    
    // Calculate Implicit Rate (Arbitrage Opportunity)
    // Formula: (BTC_ARS / BTC_USD + ETH_ARS / ETH_USD) / 2
    const btcImp = crypto.bitcoin.ars / crypto.bitcoin.usd;
    const ethImp = crypto.ethereum.ars / crypto.ethereum.usd;
    const avgImplicit = (btcImp + ethImp) / 2;

    const items = [
        { name: 'Bitcoin', symbol: 'BTC', usd: crypto.bitcoin.usd, ars: crypto.bitcoin.ars, icon: Bitcoin, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { name: 'Ethereum', symbol: 'ETH', usd: crypto.ethereum.usd, ars: crypto.ethereum.ars, icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { name: 'Solana', symbol: 'SOL', usd: crypto.solana.usd, ars: crypto.solana.ars, icon: Wallet, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { name: 'Tether', symbol: 'USDT', usd: crypto.tether.usd, ars: crypto.tether.ars, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {items.map((item) => (
                <div key={item.symbol} className="bg-[#0f172a]/60 backdrop-blur-md border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex items-center justify-between group transition-all">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>
                            <item.icon size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.name}</div>
                            <div className="text-lg font-mono font-bold text-slate-200">{fmt(item.usd)}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] text-slate-600 font-semibold mb-0.5">ARS PRICE</div>
                        <div className="text-xs font-mono text-slate-400">{fmtArs(item.ars)}</div>
                    </div>
                </div>
            ))}
            
            {/* Implicit Rate Banner - Only visible on large screens as a summary line or extra card if needed */}
        </div>
    );
};