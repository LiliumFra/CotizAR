import React, { useEffect } from 'react';

export const AdBanner = () => {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense Error", e);
        }
    }, []);

    return (
        <div className="w-full flex justify-center my-4 overflow-hidden min-h-[90px]">
            {/* 
                NOTA: Reemplaza 'data-ad-slot' con el ID de tu bloque de anuncios real desde AdSense.
                Este es un bloque responsivo horizontal.
            */}
            <ins className="adsbygoogle"
                style={{ display: 'block', width: '100%', maxWidth: '100%', maxHeight: '120px' }}
                data-ad-client="ca-pub-3478972419062039"
                data-ad-slot="1234567890" 
                data-ad-format="horizontal"
                data-full-width-responsive="true">
            </ins>
            
            {/* Placeholder visual para desarrollo (se oculta si AdSense carga) */}
            <div className="hidden adsbygoogle-no-content w-full h-full bg-slate-900/30 border border-slate-800/50 rounded-lg flex items-center justify-center text-[10px] text-slate-600 uppercase tracking-widest">
                Espacio Publicitario
            </div>
        </div>
    );
};