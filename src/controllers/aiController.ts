import { generateCareerAdvisorPrompts as generateCareerAdvisorPrompt,
    generateResumeAnalyserPrompts as generateResumeAnalyserPrompt } from '../services/aiService.js';

export const generateCareerAdvisorPrompts = async(req: any, res: any) => {
    await generateCareerAdvisorPrompt(req, res);
}

export const generateResumeAnalyserPrompts = async(req: any, res: any) => {
    await generateResumeAnalyserPrompt(req, res);
}