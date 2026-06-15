import { resumeAnalyserPrompt } from "../prompts/resumeAnalyserPrompt.js";
import { describe, expect, it } from '@jest/globals';

describe("resumeAnalyserPrompt", () => {
  it("should be a non-empty string", () => {
    expect(typeof resumeAnalyserPrompt).toBe("string");
    expect(resumeAnalyserPrompt.length).toBeGreaterThan(0);
  });

  it("should contain ATS analyzer instruction", () => {
    expect(resumeAnalyserPrompt).toContain("ATS");
  });

  it("should contain required JSON structure fields", () => {
    expect(resumeAnalyserPrompt).toContain("atsScore");
    expect(resumeAnalyserPrompt).toContain("scoreBreakdown");
    expect(resumeAnalyserPrompt).toContain("suggestions");
    expect(resumeAnalyserPrompt).toContain("strengths");
    expect(resumeAnalyserPrompt).toContain("summary");
  });

  it("should contain scoreBreakdown sub-fields", () => {
    expect(resumeAnalyserPrompt).toContain("formatting");
    expect(resumeAnalyserPrompt).toContain("keywords");
    expect(resumeAnalyserPrompt).toContain("structure");
    expect(resumeAnalyserPrompt).toContain("readability");
  });

  it("should contain suggestion fields", () => {
    expect(resumeAnalyserPrompt).toContain("category");
    expect(resumeAnalyserPrompt).toContain("issue");
    expect(resumeAnalyserPrompt).toContain("recommendation");
    expect(resumeAnalyserPrompt).toContain("priority");
  });

  it("should instruct valid JSON-only response", () => {
    expect(resumeAnalyserPrompt).toContain("valid JSON format");
  });

  it("should contain focus area instructions", () => {
    expect(resumeAnalyserPrompt).toContain("action verbs");
    expect(resumeAnalyserPrompt).toContain("Contact information");
    expect(resumeAnalyserPrompt).toContain("Date formatting");
  });
});
