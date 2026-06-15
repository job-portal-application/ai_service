import express from 'express';
import { generateCareerAdvisorPrompts, generateResumeAnalyserPrompts } from '../controllers/aiController.js';

const router = express.Router();

router.post('/career', generateCareerAdvisorPrompts);
router.post('/resume', generateResumeAnalyserPrompts);

export default router;