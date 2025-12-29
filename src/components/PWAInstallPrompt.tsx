import React, { useState, useEffect } from 'react';

export const PWAInstallPrompt: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900 border border-brand-primary/30 p-4 rounded-xl shadow-2xl z-50 animate-bounce-in">
            <div className="flex items-start gap-4">
                <div className="bg-brand-primary/20 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-white">Instalar App</h3>
                    <p className="text-sm text-slate-400 mt-1">Instala FitnessFlow para mejor rendimiento y acceso offline.</p>
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => setShowPrompt(false)}
                            className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                        >
                            Ahora no
                        </button>
                        <button
                            onClick={handleInstall}
                            className="px-3 py-1.5 text-xs bg-brand-primary text-slate-900 font-bold rounded-lg hover:bg-brand-secondary transition-colors"
                        >
                            Instalar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
