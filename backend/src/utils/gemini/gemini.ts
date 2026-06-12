// utils/gemini/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── pricing for gemini-2.5-flash-lite (per 1M tokens) ───────────────────────
const PRICING = {
  input:    0.10,
  output:   0.40,
  thinking: 0.10,
};

const USD_TO_INR = 84;

const getGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");
  return new GoogleGenerativeAI(apiKey);
};

export const generateText = async (
  prompt:        string,
  systemPrompt?: string
): Promise<string> => {
  const genAI = getGemini();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    ...(systemPrompt && { systemInstruction: systemPrompt }),
  });

  const result = await model.generateContent(prompt);

  // ── token usage ───────────────────────────────────────────────────────────
  const usage = result.response.usageMetadata;

  const inputTokens    = usage?.promptTokenCount     ?? 0;
  const outputTokens   = usage?.candidatesTokenCount ?? 0;
  const totalTokens    = usage?.totalTokenCount      ?? 0;
  const thinkingTokens = Math.max(0, totalTokens - inputTokens - outputTokens);

  const inputCostUSD    = (inputTokens    / 1_000_000) * PRICING.input;
  const outputCostUSD   = (outputTokens   / 1_000_000) * PRICING.output;
  const thinkingCostUSD = (thinkingTokens / 1_000_000) * PRICING.thinking;
  const totalCostUSD    = inputCostUSD + outputCostUSD + thinkingCostUSD;
  const totalCostINR    = totalCostUSD * USD_TO_INR;

  console.log("─── Gemini Token Usage ───────────────────────────────");
  console.log(`  Input tokens:     ${inputTokens.toLocaleString()}`);
  console.log(`  Output tokens:    ${outputTokens.toLocaleString()}`);
  console.log(`  Thinking tokens:  ${thinkingTokens.toLocaleString()}`);
  console.log(`  Total tokens:     ${totalTokens.toLocaleString()}`);
  console.log("─── Cost Summary ─────────────────────────────────────");
  console.log(`  Input cost:       $${inputCostUSD.toFixed(6)}    ₹${(inputCostUSD    * USD_TO_INR).toFixed(4)}`);
  console.log(`  Output cost:      $${outputCostUSD.toFixed(6)}   ₹${(outputCostUSD   * USD_TO_INR).toFixed(4)}`);
  console.log(`  Thinking cost:    $${thinkingCostUSD.toFixed(6)}  ₹${(thinkingCostUSD * USD_TO_INR).toFixed(4)}`);
  console.log(`  ──────────────────────────────────────────────────`);
  console.log(`  TOTAL:            $${totalCostUSD.toFixed(6)}    ₹${totalCostINR.toFixed(4)}`);
  console.log("──────────────────────────────────────────────────────");

  return result.response.text();
};