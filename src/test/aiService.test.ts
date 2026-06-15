import { jest, describe, afterEach, it, expect, beforeAll } from '@jest/globals';

// ESM-compatible mocks — must be declared before dynamic import of the service
const mockGenerateContent = jest.fn<any>();

jest.unstable_mockModule('dotenv', () => ({ default: { config: jest.fn() } }));

jest.unstable_mockModule('../prompts/carrierGuidancePrompt.js', () => ({
    carrierAdvisorPrompt: 'Based on skills: ${skills}.',
}));

jest.unstable_mockModule('../prompts/resumeAnalyserPrompt.js', () => ({
    resumeAnalyserPrompt: 'Analyse resume.',
}));

jest.unstable_mockModule('@google/genai', () => ({
    GoogleGenAI: jest.fn().mockImplementation(() => ({
        models: { generateContent: mockGenerateContent },
    })),
}));

process.env.GEMINI_API_KEY = 'test-key';

// Dynamically import AFTER mocks are registered
let generateCareerAdvisorPrompts: any;
let generateResumeAnalyserPrompts: any;

beforeAll(async () => {
    const service = await import('../services/aiService.js');
    generateCareerAdvisorPrompts = service.generateCareerAdvisorPrompts;
    generateResumeAnalyserPrompts = service.generateResumeAnalyserPrompts;
});

// --- Helpers ---
const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const aiResponse = (text: string) => ({
    candidates: [{ content: { parts: [{ text }] } }],
});

// ─── generateCareerAdvisorPrompts ────────────────────────────────────────────

describe('generateCareerAdvisorPrompts', () => {
    afterEach(() => { jest.clearAllMocks(); });

    it('returns 400 when skills missing', async () => {
        const res = mockRes();
        await generateCareerAdvisorPrompts({ body: {} }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Skills are required' });
    });

    it('returns parsed JSON on success', async () => {
        mockGenerateContent.mockResolvedValueOnce(aiResponse('{"result":"ok"}'));
        const res = mockRes();
        await generateCareerAdvisorPrompts({ body: { skills: 'TypeScript' } }, res);
        expect(res.json).toHaveBeenCalledWith({ result: 'ok' });
    });

    it('returns 500 when no JSON match in response', async () => {
        mockGenerateContent.mockResolvedValueOnce(aiResponse('no json here'));
        const res = mockRes();
        await generateCareerAdvisorPrompts({ body: { skills: 'TypeScript' } }, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'No valid JSON found' })
        );
    });

    it('returns 500 when JSON.parse throws', async () => {
        mockGenerateContent.mockResolvedValueOnce(aiResponse('{invalid json}'));
        const res = mockRes();
        await generateCareerAdvisorPrompts({ body: { skills: 'TypeScript' } }, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Failed to parse AI response' })
        );
    });

    it('returns 500 on outer error', async () => {
        mockGenerateContent.mockRejectedValueOnce(new Error('network error'));
        const res = mockRes();
        await generateCareerAdvisorPrompts({ body: { skills: 'TypeScript' } }, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'network error' });
    });
});

// ─── generateResumeAnalyserPrompts ───────────────────────────────────────────

describe('generateResumeAnalyserPrompts', () => {
    afterEach(() => { jest.clearAllMocks(); });

    it('returns 400 when pdfBase64 missing', async () => {
        const res = mockRes();
        await generateResumeAnalyserPrompts({ body: {} }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'PDF file is required' });
    });

    it('returns parsed JSON on success', async () => {
        mockGenerateContent.mockResolvedValueOnce(aiResponse('{"atsScore":90}'));
        const res = mockRes();
        await generateResumeAnalyserPrompts({ body: { pdfBase64: 'data:application/pdf;base64,abc123' } }, res);
        expect(res.json).toHaveBeenCalledWith({ atsScore: 90 });
    });

    it('returns 500 when no JSON match in response', async () => {
        mockGenerateContent.mockResolvedValueOnce(aiResponse('no json here'));
        const res = mockRes();
        await generateResumeAnalyserPrompts({ body: { pdfBase64: 'abc123' } }, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'No valid JSON found' })
        );
    });

    it('returns 500 when JSON.parse throws', async () => {
        mockGenerateContent.mockResolvedValueOnce(aiResponse('{invalid json}'));
        const res = mockRes();
        await generateResumeAnalyserPrompts({ body: { pdfBase64: 'abc123' } }, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'Failed to parse AI response' })
        );
    });

    it('returns 500 on outer error', async () => {
        mockGenerateContent.mockRejectedValueOnce(new Error('timeout'));
        const res = mockRes();
        await generateResumeAnalyserPrompts({ body: { pdfBase64: 'abc123' } }, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'timeout' });
    });
});
