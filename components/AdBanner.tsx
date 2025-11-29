import React, { useEffect, useRef } from 'react';

export const AdBanner = () => {
    const adInitialized = useRef(false);

    useEffect(() => {
        // Guard against double execution (React Strict Mode)
        if (adInitialized.current) return;
        
        try {
            // Check if ad slot is visible/has width before pushing
            // @ts-ignore
            if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
                adInitialized.current = true;
                // @ts-ignore
                window.adsbygoogle.push({});
            }
        } catch (e) {
            console.error("AdSense Error", e);
        }
    }, []);

    return (
        <div className="w-full my-6 text-center min-h-[100px] relative overflow-hidden rounded-xl bg-slate-900/20 border border-slate-800/50">
            <span className="absolute top-1 left-2 text-[9px] text-slate-600 uppercase tracking-wider font-bold z-10">Publicidad</span>
            
            {/* 
                NOTA: Reemplaza 'data-ad-slot' con el ID real si tienes uno específico.
                Se usa display: block para evitar el error 'availableWidth=0' común en contenedores flex.
            */}
            <div className="w-full flex justify-center pt-4 pb-2">
                <ins className="adsbygoogle"
                    style={{ display: 'block', minWidth: '300px', width: '100%' }}
                    data-ad-client="ca-pub-3478972419062039"
                    data-ad-slot="1234567890" 
                    data-ad-format="auto"
                    data-full-width-responsive="true">
                </ins>
            </div>
        </div>
    );
};