
import { Client } from '../types';

export const mockClients: Client[] = [
    {
        id: 1,
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@email.com',
        goal: 'Perder Grasa',
        lastActivity: 'Ayer',
        progress: 75,
        notes: [
            '2024-07-15: Excelente progreso en la última semana. Aumentar cardio a 35 min.',
            '2024-07-08: Foco en la técnica de sentadilla para evitar molestias en la rodilla.',
        ]
    },
    {
        id: 2,
        name: 'Sofia Gómez',
        email: 'sofia.gomez@email.com',
        goal: 'Ganar Músculo',
        lastActivity: 'Hoy',
        progress: 60,
        notes: [
            '2024-07-16: Aumentó el peso en press de banca. Revisar la dieta para asegurar superávit calórico.',
        ]
    },
    {
        id: 3,
        name: 'Javier Pérez',
        email: 'javier.perez@email.com',
        goal: 'Fitness General',
        lastActivity: 'Hace 3 días',
        progress: 40,
        notes: [
            '2024-07-12: Mostró gran consistencia. Sugerir una clase de yoga para mejorar flexibilidad.',
        ]
    },
];
