import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';

const mockGenerateCareer = jest.fn((_req: any, res: any) => res.status(200).json({ mock: 'career' }));
const mockGenerateResume = jest.fn((_req: any, res: any) => res.status(200).json({ mock: 'resume' }));

jest.unstable_mockModule('../services/aiService.js', () => ({
    generateCareerAdvisorPrompts: mockGenerateCareer,
    generateResumeAnalyserPrompts: mockGenerateResume,
}));

const { default: express } = await import('express');
const { default: request } = await import('supertest');
const { default: router } = await import('../routes/routes.js');

const buildApp = () => {
    const app = express();
    app.use(express.json());
    app.use(router);
    return app;
};

describe('routes', () => {
    let app: ReturnType<typeof buildApp>;

    beforeEach(() => {
        app = buildApp();
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('POST /career calls generateCareerAdvisorPrompts', async () => {
        const res = await request(app).post('/career').send({ skills: 'JavaScript' });
        expect(res.status).toBe(200);
        expect(mockGenerateCareer).toHaveBeenCalledTimes(1);
    });

    it('POST /resume calls generateResumeAnalyserPrompts', async () => {
        const res = await request(app).post('/resume').send({ pdfBase64: 'dGVzdA==' });
        expect(res.status).toBe(200);
        expect(mockGenerateResume).toHaveBeenCalledTimes(1);
    });
});
