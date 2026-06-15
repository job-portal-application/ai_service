import { jest, describe, it, expect, afterEach, beforeAll } from '@jest/globals';

const mockGenerateCareerAdvisorPrompt = jest.fn<(req: any, res: any) => Promise<void>>().mockResolvedValue(undefined);
const mockGenerateResumeAnalyserPrompt = jest.fn<(req: any, res: any) => Promise<void>>().mockResolvedValue(undefined);

jest.unstable_mockModule('../services/aiService.js', () => ({
    generateCareerAdvisorPrompts: mockGenerateCareerAdvisorPrompt,
    generateResumeAnalyserPrompts: mockGenerateResumeAnalyserPrompt,
}));

let generateCareerAdvisorPrompts: any;
let generateResumeAnalyserPrompts: any;

beforeAll(async () => {
    const controller = await import('../controllers/aiController.js');
    generateCareerAdvisorPrompts = controller.generateCareerAdvisorPrompts;
    generateResumeAnalyserPrompts = controller.generateResumeAnalyserPrompts;
});

const mockReq = {} as any;
const mockRes = {} as any;

describe('aiController', () => {
    afterEach(() => { jest.clearAllMocks(); });

    it('should call generateCareerAdvisorPrompt with req and res', async () => {
        await generateCareerAdvisorPrompts(mockReq, mockRes);
        expect(mockGenerateCareerAdvisorPrompt).toHaveBeenCalledWith(mockReq, mockRes);
    });

    it('should call generateResumeAnalyserPrompt with req and res', async () => {
        await generateResumeAnalyserPrompts(mockReq, mockRes);
        expect(mockGenerateResumeAnalyserPrompt).toHaveBeenCalledWith(mockReq, mockRes);
    });
});
