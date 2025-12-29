
import { Challenge, LeaderboardEntry, SocialActivity } from '../types';

export const ACTIVE_CHALLENGES: Challenge[] = [
    {
        id: '1',
        title: 'Semana de Fuego',
        description: 'Completa 4 entrenamientos esta semana.',
        target: 4,
        current: 3,
        unit: 'sesiones',
        rewardXP: 500,
        deadline: 'Domingo',
        participants: 124
    },
    {
        id: '2',
        title: 'Corredor Matutino',
        description: 'Acumula 15km corriendo antes de las 9 AM.',
        target: 15,
        current: 5.2,
        unit: 'km',
        rewardXP: 300,
        deadline: '30 Jun',
        participants: 56
    }
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
    { rank: 1, userName: 'Valeria M.', xp: 15400, trend: 'same' },
    { rank: 2, userName: 'Juan Pablo R.', xp: 14200, trend: 'up' },
    { rank: 3, userName: 'Ana García', xp: 12050, trend: 'down' }, // Current User mockup
    { rank: 4, userName: 'Carlos D.', xp: 11800, trend: 'up' },
    { rank: 5, userName: 'Luisa F.', xp: 9500, trend: 'same' },
];

export const SOCIAL_FEED: SocialActivity[] = [
    { id: '1', user: 'Diego V.', action: 'rompió su PR en Peso Muerto (140kg)', timeAgo: '2h', type: 'workout', likes: 12 },
    { id: '2', user: 'Sofia G.', action: 'subió a Nivel 5: "Atleta"', timeAgo: '4h', type: 'level_up', likes: 24 },
    { id: '3', user: 'Mateo H.', action: 'completó el reto "Semana de Fuego"', timeAgo: '5h', type: 'achievement', likes: 8 },
    { id: '4', user: 'Laura M.', action: 'finalizó clase de Yoga Flow', timeAgo: '6h', type: 'workout', likes: 5 },
];

export const LEVEL_TITLES = [
    { level: 1, title: 'Novato', minXP: 0 },
    { level: 2, title: 'Iniciado', minXP: 1000 },
    { level: 3, title: 'Entusiasta', minXP: 2500 },
    { level: 4, title: 'Atleta', minXP: 5000 },
    { level: 5, title: 'Élite', minXP: 10000 },
    { level: 6, title: 'Leyenda', minXP: 20000 },
];
