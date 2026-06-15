import { carrierAdvisorPrompt } from "../prompts/carrierGuidancePrompt.js";
import { describe, expect, it } from '@jest/globals';

describe("carrierAdvisorPrompt", () => {
  it("should be a non-empty string", () => {
    expect(typeof carrierAdvisorPrompt).toBe("string");
    expect(carrierAdvisorPrompt.length).toBeGreaterThan(0);
  });

  it("should contain the skills placeholder", () => {
    expect(carrierAdvisorPrompt).toContain("${skills}");
  });

  it("should contain required JSON structure keys", () => {
    expect(carrierAdvisorPrompt).toContain('"summary"');
    expect(carrierAdvisorPrompt).toContain('"jobOptions"');
    expect(carrierAdvisorPrompt).toContain('"skillsToLearn"');
    expect(carrierAdvisorPrompt).toContain('"learningApproach"');
  });

  it("should contain jobOptions fields", () => {
    expect(carrierAdvisorPrompt).toContain('"title"');
    expect(carrierAdvisorPrompt).toContain('"responsibilities"');
    expect(carrierAdvisorPrompt).toContain('"why"');
  });

  it("should contain skillsToLearn fields", () => {
    expect(carrierAdvisorPrompt).toContain('"category"');
    expect(carrierAdvisorPrompt).toContain('"skills"');
    expect(carrierAdvisorPrompt).toContain('"how"');
  });

  it("should contain learningApproach fields", () => {
    expect(carrierAdvisorPrompt).toContain('"points"');
  });

  it("should instruct to return valid JSON only", () => {
    expect(carrierAdvisorPrompt).toContain("valid JSON format");
    expect(carrierAdvisorPrompt).toContain("Do not include any text or markdown");
  });
});
