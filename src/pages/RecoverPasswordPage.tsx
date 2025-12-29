import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { FitnessFlowLogo, MailIcon } from '../components/FormIcons';

interface RecoverPasswordPageProps {
    onNavigateToLogin: () => void;
}

export const RecoverPasswordPage: React.FC<RecoverPasswordPageProps> = ({ onNavigateToLogin }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });

            if (error) throw error;

            setMessage({
                type: 'success',
                text: 'Se ha enviado un enlace de recuperación a tu correo. Revisa tu bandeja de entrada.'
            });
        } catch (err: any) {
            console.error('Error recovering password:', err);
            setMessage({
                type: 'error',
                text: 'Error al enviar la solicitud: ' + (err.message || 'Inténtalo de nuevo.')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
                <div className="text-center mb-6">
                    <div className="inline-block bg-white p-3 rounded-full shadow-lg mb-4">
                        <FitnessFlowLogo />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Recuperar Contraseña</h2>
                    <p className="text-slate-400 text-sm mt-2">
                        Ingresa tu correo para recibir un enlace de restablecimiento.
                    </p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-900/30 text-green-300 border border-green-800' : 'bg-red-900/30 text-red-300 border border-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                <MailIcon />
                            </span>
                            <input
                                type="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20"
                    >
                        {loading ? 'Enviando...' : 'Enviar Enlace'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={onNavigateToLogin}
                        className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                        ← Volver al Inicio de Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};
