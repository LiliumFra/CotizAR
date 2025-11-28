import { CryptoMarket, DolarRate, InflationData, NewsItem } from '../types';

// Constants
const API_DOLAR = 'https://dolarapi.com/v1/dolares';
const API_ARG_RIESGO = 'https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais/ultimo';
const API_ARG_INFLATION = 'https://api.argentinadatos.com/v1/finanzas/indices/inflacion';
// Using specific endpoint for historical calls in charts
export const API_ARG_HISTORY_BASE = 'https://api.argentinadatos.com/v1/cotizaciones/dolares';
const API_COINGECKO = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,solana&vs_currencies=usd,ars&include_24hr_change=true';

// Mock News Data (Real financial news APIs often require backend proxies due to CORS/Keys)
const MOCK_NEWS: NewsItem[] = [
    { id: '1', title: 'BCRA acumula reservas por quinto día consecutivo', source: 'Mercado', time: 'Hace 2h', sentiment: 'positive' },
    { id: '2', title: 'Bonos soberanos operan con volatilidad en Wall Street', source: 'Finanzas', time: 'Hace 4h', sentiment: 'neutral' },
    { id: '3', title: 'Inflación mensual muestra signos de desaceleración', source: 'Economía', time: 'Hace 6h', sentiment: 'positive' },
    { id: '4', title: 'El dólar cripto mantiene brecha estable respecto al oficial', source: 'Cripto', time: 'Hace 8h', sentiment: 'neutral' },
    { id: '5', title: 'Presión sobre los tipos de cambio financieros', source: 'Bolsa', time: 'Hace 10h', sentiment: 'negative' },
];

export const fetchMarketData = async () => {
    try {
        const [ratesRes, riesgoRes, inflationRes, cryptoRes] = await Promise.allSettled([
            fetch(API_DOLAR),
            fetch(API_ARG_RIESGO),
            fetch(API_ARG_INFLATION),
            fetch(API_COINGECKO)
        ]);

        // Process Rates
        const rates: DolarRate[] = ratesRes.status === 'fulfilled' ? await ratesRes.value.json() : [];

        // Process Risk
        const riesgoData = riesgoRes.status === 'fulfilled' ? await riesgoRes.value.json() : { valor: 0 };

        // Process Inflation (Get last 12 months)
        let inflation: InflationData[] = [];
        if (inflationRes.status === 'fulfilled') {
            const allInflation = await inflationRes.value.json();
            // Sort by date ascending and take last 6
            inflation = allInflation
                .sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                .slice(-6);
        }

        // Process Crypto
        const crypto: CryptoMarket | null = cryptoRes.status === 'fulfilled' ? await cryptoRes.value.json() : null;

        return {
            rates,
            riesgo: riesgoData.valor,
            inflation,
            crypto,
            news: MOCK_NEWS, // Replace with real fetch if API key available
            lastUpdate: new Date(),
            loading: false
        };

    } catch (error) {
        console.error("Critical API Error", error);
        throw error;
    }
};

export const fetchRateHistory = async (casa: string, timeframe: string) => {
    try {
        // Map DolarAPI names to ArgentinaDatos endpoints
        let endpoint = casa;
        if (casa === 'bolsa') endpoint = 'mep';
        if (casa === 'contadoconliqui') endpoint = 'ccl';
        if (casa === 'cripto') endpoint = 'blue'; // Fallback for history as crypto history is harder to get free

        const res = await fetch(`${API_ARG_HISTORY_BASE}/${endpoint}`);
        if (!res.ok) throw new Error("History fetch failed");
        
        const json = await res.json();
        const sorted = json.sort((a: any, b: any) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        
        const days = timeframe === '1M' ? 30 : (timeframe === '3M' ? 90 : 365);
        return sorted.slice(-days);
    } catch (error) {
        console.warn("History not available for", casa);
        return [];
    }
};