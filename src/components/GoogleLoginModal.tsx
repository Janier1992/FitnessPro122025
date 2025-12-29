// FIX: Created the missing GoogleLoginModal component to handle the Google login flow.
import React from 'react';

interface GoogleLoginModalProps {
  onClose: () => void;
  onSelectAccount: (account: { name: string; email: string }) => void;
}

// Mock data to simulate finding a user's Google account
const mockGoogleAccounts = [
    { name: 'Ana García', email: 'ana.garcia@email.com' },
    { name: 'Ana G', email: 'ana.g.personal@email.com' },
];

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({ onClose, onSelectAccount }) => {
    // In a real app, this would use the Google Identity Services library.
    // For this demo, we simulate choosing from a list of known accounts.
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="google-login-title">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h2 id="google-login-title" className="text-xl font-bold text-slate-800">Elige una cuenta</h2>
                    <p className="text-sm text-slate-500">para continuar a FitnessFlow Pro</p>
                </div>
                <div className="p-4 space-y-2">
                    {mockGoogleAccounts.map(account => (
                        <button
                            key={account.email}
                            onClick={() => onSelectAccount(account)}
                            className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-slate-100"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                                {account.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">{account.name}</p>
                                <p className="text-sm text-slate-500">{account.email}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                    <button onClick={onClose} className="w-full text-center text-sm font-semibold text-slate-600 hover:text-slate-800">
                        Usar otra cuenta
                    </button>
                </div>
            </div>
        </div>
    );
};
