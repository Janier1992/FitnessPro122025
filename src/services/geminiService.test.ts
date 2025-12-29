import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeAI, getAICoachResponse } from './geminiService';

// Hoist the mock function so it's available in the factory
const { mockGenerateContent } = vi.hoisted(() => {
    return { mockGenerateContent: vi.fn() };
});

vi.mock('@google/genai', () => {
    return {
        GoogleGenAI: class {
            models = {
                generateContent: mockGenerateContent
            };
            constructor(_config: any) { }
        },
        Type: {
            OBJECT: 'OBJECT',
            STRING: 'STRING',
            ARRAY: 'ARRAY',
            INTEGER: 'INTEGER',
        }
    };
});

describe('geminiService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        initializeAI('test-api-key');
    });

    it('should initialize with API key and make requests', async () => {
        mockGenerateContent.mockResolvedValue({
            text: 'Respuesta de prueba',
            candidates: [
                {
                    groundingMetadata: {
                        groundingChunks: [
                            { web: { uri: 'http://example.com', title: 'Example' } }
                        ]
                    }
                }
            ]
        });

        const response = await getAICoachResponse('Hola');
        expect(response.text).toBe('Respuesta de prueba');
        expect(response.sources[0].title).toBe('Example');
    });

    it('should handle API errors gracefully', async () => {
        mockGenerateContent.mockRejectedValue(new Error('API Failure'));

        const response = await getAICoachResponse('Hola');
        expect(response.text).toContain('problemas para conectarme');
    });

    it('should return error if API key is missing', async () => {
        vi.stubEnv('VITE_GEMINI_API_KEY', '');
        initializeAI('');
        const response = await getAICoachResponse('Hola');
        expect(response.text).toContain('clave API no está configurada');
    });
});
