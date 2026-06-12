export type ReviewPromptParams = {
  businessName: string;
  address?:     string;
  rating:       number;
  answers?:     { questionText: string; value: unknown }[];
};

export const buildReviewPrompt = ({
  businessName,
  address,
  rating,
  answers,
}: ReviewPromptParams): string => {
  const stars     = "⭐".repeat(rating);
  const sentiment = rating >= 4 ? "positive" : "mixed";
  const answerContext = answers?.length
    ? answers
        .map((a) => `- ${a.questionText}: ${a.value}`)
        .join("\n")
    : "";

  return `
You are an expert at writing SEO-optimized Google Maps reviews that help businesses rank higher in local search.

Write a genuine, detailed Google Maps review for the following business:

Business: ${businessName}
${address ? `Location: ${address}` : ""}
Star Rating: ${rating}/5 ${stars}
${answerContext ? `Customer Feedback:\n${answerContext}` : ""}

Requirements:
- Write in first person as a real customer
- 80-120 words — detailed but natural
- Naturally include the business name and location/area (if provided) for local SEO
- Include specific details that make it sound authentic and personal
- Use relevant keywords that people search for (e.g. service type, location, quality descriptors)
- Sentiment must match the ${sentiment} rating — do NOT sound fake or over-the-top
- Do NOT use phrases like "I was blown away" or "absolutely amazing" — keep it natural
- Do NOT mention discounts, offers, or anything promotional
- Do NOT use hashtags
- Output ONLY the review text — no title, no label, no explanation

Review:
`.trim();
};