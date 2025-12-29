import React from 'react';

interface TrialBannerProps {
  trialEndDate: Date;
  onSubscribeClick: () => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({ trialEndDate, onSubscribeClick }) => {
    const calculateDaysLeft = () => {
        const now = new Date();
        const differenceInTime = trialEndDate.getTime() - now.getTime();
        const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
        return differenceInDays > 0 ? differenceInDays : 0;
    };

    const daysLeft = calculateDaysLeft();

    return (
        <div className="bg-yellow-400 text-yellow-900 text-sm font-semibold p-2 text-center">
            <p>
                Te quedan {daysLeft} {daysLeft === 1 ? 'día' : 'días'} de prueba.
                <button onClick={onSubscribeClick} className="ml-2 underline font-bold hover:text-yellow-950">
                    Suscríbete ahora
                </button>
            </p>
        </div>
    );
};