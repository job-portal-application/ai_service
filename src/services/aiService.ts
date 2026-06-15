import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { carrierAdvisorPrompt } from '../prompts/carrierGuidancePrompt.js';
import { resumeAnalyserPrompt } from '../prompts/resumeAnalyserPrompt.js';

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error('Missing GEMINI_API_KEY');
}
const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

export const generateCareerAdvisorPrompts = async(req: any, res: any) => {
    try {
        const { skills } = req.body;
        if(!skills) {
            return res.status(400).json({ message: 'Skills are required' });
        }

        const prompt = carrierAdvisorPrompt.replace('${skills}', skills);
        
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });
        let jsonResponse;
        try {
            const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return res.status(500).json({ message: 'No valid JSON found', rawResponse: rawText });
            }
            jsonResponse = JSON.parse(jsonMatch[0]);
            res.json(jsonResponse);
        } catch (error: any) {
            return res.status(500).json({ message: 'Failed to parse AI response', rawResponse: jsonResponse, error: error.message });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


export const generateResumeAnalyserPrompts = async(req: any, res: any) => {
    try {
        const { pdfBase64 } = req.body;
        if(!pdfBase64) {
            return res.status(400).json({ message: 'PDF file is required' });
        }
        const prompt = resumeAnalyserPrompt;
        
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                {
                    text: prompt
                },
                {
                    inlineData: {
                        mimeType: 'application/pdf',
                        data: pdfBase64.replace(/^data:application\/pdf;base64,/, "")
                    }
                }
            ]
        });
        let jsonResponse;
        try {
            const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                return res.status(500).json({ message: 'No valid JSON found', rawResponse: rawText });
            }
            jsonResponse = JSON.parse(jsonMatch[0]);
            res.json(jsonResponse);
        } catch (error: any) {
            return res.status(500).json({ message: 'Failed to parse AI response', rawResponse: jsonResponse, error: error.message });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};