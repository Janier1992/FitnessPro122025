import React, { useState } from 'react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPaymentConfirm: () => void;
    planName: string;
    price: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentConfirm, planName, price }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        setLoading(true);
        // Simulating API call
        setTimeout(() => {
            setLoading(false);
            onPaymentConfirm();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="bg-brand-primary p-4 text-white text-center">
                    <h2 className="text-lg font-bold">Confirmar Suscripción</h2>
                    <p className="text-sm opacity-90">Plan {planName} - ${price}</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="text-center space-y-2">
                        <p className="text-slate-600 dark:text-slate-300">Para activar tu cuenta, realiza el pago a través de:</p>
                        <div className="flex justify-center gap-4 py-2">
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg font-bold text-slate-800 dark:text-white">Nequi</div>
                            <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-lg font-bold text-slate-800 dark:text-white">Bancolombia</div>
                        </div>
                        <p className="text-xs text-slate-500">Cuenta Ahorros: <strong>123-456789-00</strong></p>
                        <p className="text-xs text-slate-500">NIT: 900.123.456-7</p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
                        <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
                            ⚠️ En modo demostración, haz clic en "Confirmar Transferencia" para simular el pago exitoso automáticamente.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className="flex-1 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 flex justify-center items-center"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Confirmar Transferencia'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
