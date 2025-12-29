import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabaseService } from './supabaseService';
import { supabase } from '../lib/supabase';

// Mock supabase client
vi.mock('../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn()
        }))
    }
}));

describe('supabaseService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch classes successfully', async () => {
        const mockData = [
            {
                id: 1,
                nombre: 'Yoga',
                horarios_clases: [{ dia_semana: 'Lunes', hora_dia: '10:00' }]
            }
        ];

        // Setup mock return
        const selectMock = vi.fn().mockResolvedValue({ data: mockData, error: null });
        (supabase.from as any).mockReturnValue({ select: selectMock });

        const classes = await supabaseService.getClasses();

        expect(classes).toHaveLength(1);
        expect(classes[0].name).toBe('Yoga');
        expect(classes[0].schedule).toHaveLength(1);
        expect(classes[0].schedule[0].day).toBe('Lunes');
    });

    it('should handle errors when fetching classes', async () => {
        const mockError = { message: 'Network error' };
        const selectMock = vi.fn().mockResolvedValue({ data: null, error: mockError });
        (supabase.from as any).mockReturnValue({ select: selectMock });

        await expect(supabaseService.getClasses()).rejects.toEqual(mockError);
    });
});
