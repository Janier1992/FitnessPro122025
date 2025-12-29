import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { FitnessFlowLogo, LockIcon, EyeOpenIcon, EyeClosedIcon } from '../components/FormIcons';

interface ResetPasswordPageProps {
    onNavigateToLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onNavigateToLogin }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ password: password });

            if (error) throw error;

            setMessage({
                type: 'success',
                text: 'Contraseña actualizada correctamente. Redirigiendo...'
            });

            setTimeout(() => {
                onNavigateToLogin();
            }, 2000);

        } catch (err: any) {
            console.error('Error resetting password:', err);
            setMessage({
                type: 'error',
                text: 'Error al actualizar: ' + (err.message || 'Inténtalo de nuevo.')
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
                    <h2 className="text-2xl font-bold text-white">Nueva Contraseña</h2>
                    <p className="text-slate-400 text-sm mt-2">
                        Establece tu nueva contraseña segura.
                    </p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-900/30 text-green-300 border border-green-800' : 'bg-red-900/30 text-red-300 border border-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-1">
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                <LockIcon />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                placeholder="Mínimo 6 caracteres"
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-white"
                            >
                                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-1">
                            Confirmar Contraseña
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                                <LockIcon />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirm-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                placeholder="Repite la contraseña"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/20"
                    >
                        {loading ? 'Actualizando...' : 'Restablecer Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};
