// ─────────────────────────────────────────────────────────────
// JSON Parser
// ─────────────────────────────────────────────────────────────

export function safeParseJson(raw: string): any {
  const clean = raw
    .replace(/^\uFEFF/, "")
    .replace(/^```(?:json)?\n?/im, "")
    .replace(/```\s*$/m, "")
    .trim();
  try {
    return JSON.parse(clean);
  } catch {
    const match = clean.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Gemini returned non-parseable JSON");
  }
}

// ─────────────────────────────────────────────────────────────
// Normalize business data
// ─────────────────────────────────────────────────────────────

export function normalizeBusiness(place: any) {
  return {
    name: place.name ?? "",
    rating: place.rating ?? 0,
    totalReviews: place.user_ratings_total ?? place.totalReviews ?? 0,
   
    types: place.types?.slice(0, 3) ?? [],
    website: !!place.website,
    openingHours:
      !!place.opening_hours && Object.keys(place.opening_hours).length > 0,
    reviews: (place.reviews ?? []).slice(0, 5).map((review: any) => ({
      rating: review.rating,
      text: review.text?.slice(0, 150) ?? "",
    })),
  };
}

// ─────────────────────────────────────────────────────────────
// Score Calculators  (defined before comparison fns that call them)
// ─────────────────────────────────────────────────────────────

export function calculateRatingScore(rating: number): number {
  return +(rating * 2).toFixed(1); // 0–10
}

export function calculateReviewScore(totalReviews: number): number {
  return +Math.min(totalReviews / 100, 10).toFixed(1); // caps at 1000 reviews
}

export function calculateOnlinePresenceScore(
  business: ReturnType<typeof normalizeBusiness>
): number {
  let score = 0;
  if (business.website) score += 3;
  if (business.openingHours) score += 2;
  if (business.types.length > 0) score += 2;
  if (business.totalReviews > 0) score += 1;
  return score; // 0–10
}

export function calculateOverallScore(
  ratingScore: number,
  reviewScore: number,
  onlinePresenceScore: number
): number {
  return +(
    ratingScore * 0.4 +
    reviewScore * 0.3 +
    onlinePresenceScore * 0.3
  ).toFixed(1);
}

// ─────────────────────────────────────────────────────────────
// Comparison Analysis Functions
// ─────────────────────────────────────────────────────────────

export function getRatingAnalysis(myRating: number, competitorRating: number) {
  const myScore = calculateRatingScore(myRating);
  const competitorScore = calculateRatingScore(competitorRating);

  if (myScore > competitorScore) {
    return {
      winner: "myBusiness",
      difference: +(myScore - competitorScore).toFixed(1),
      insight: `Your rating score (${myScore}/10) is higher than the competitor's (${competitorScore}/10).`,
    };
  }
  if (competitorScore > myScore) {
    return {
      winner: "competitor",
      difference: +(competitorScore - myScore).toFixed(1),
      insight: `The competitor has a higher rating score (${competitorScore}/10) compared to yours (${myScore}/10).`,
    };
  }
  return {
    winner: "tie",
    difference: 0,
    insight: "Both businesses have equal rating scores.",
  };
}

export function getReviewAnalysis(myReviews: number, competitorReviews: number) {
  const myScore = calculateReviewScore(myReviews);
  const competitorScore = calculateReviewScore(competitorReviews);

  if (myScore > competitorScore) {
    return {
      winner: "myBusiness",
      difference: +(myScore - competitorScore).toFixed(1),
      insight: `You have more customer reviews (${myReviews}) than the competitor (${competitorReviews}).`,
    };
  }
  if (competitorScore > myScore) {
    return {
      winner: "competitor",
      difference: +(competitorScore - myScore).toFixed(1),
      insight: `The competitor has more reviews (${competitorReviews}) compared to yours (${myReviews}).`,
    };
  }
  return {
    winner: "tie",
    difference: 0,
    insight: "Both businesses have a similar number of reviews.",
  };
}

export function getOnlinePresenceAnalysis(
  myBusiness: ReturnType<typeof normalizeBusiness>,
  competitor: ReturnType<typeof normalizeBusiness>
) {
  const advantages: string[] = [];
  const missing: string[] = [];

  if (myBusiness.website && !competitor.website)
    advantages.push("You have a website while the competitor does not.");
  if (!myBusiness.website && competitor.website)
    missing.push("The competitor has a website but your business does not.");

  if (myBusiness.openingHours && !competitor.openingHours)
    advantages.push("You provide opening hours while the competitor does not.");
  if (!myBusiness.openingHours && competitor.openingHours)
    missing.push("The competitor provides opening hours but your business does not.");


  if (myBusiness.totalReviews > 0 && competitor.totalReviews === 0)
    advantages.push("Your profile has customer reviews while the competitor has none.");
  if (myBusiness.totalReviews === 0 && competitor.totalReviews > 0)
    missing.push("The competitor has customer reviews while your profile does not.");

  return {
    advantages,
    missing,
    myScore: calculateOnlinePresenceScore(myBusiness),
    competitorScore: calculateOnlinePresenceScore(competitor),
  };
}

export function getOverallScoreAnalysis(
  myBusiness: ReturnType<typeof normalizeBusiness>,
  competitor: ReturnType<typeof normalizeBusiness>
) {
  const myOverall = calculateOverallScore(
    calculateRatingScore(myBusiness.rating),
    calculateReviewScore(myBusiness.totalReviews),
    calculateOnlinePresenceScore(myBusiness)
  );
  const competitorOverall = calculateOverallScore(
    calculateRatingScore(competitor.rating),
    calculateReviewScore(competitor.totalReviews),
    calculateOnlinePresenceScore(competitor)
  );

  if (myOverall > competitorOverall) {
    return {
      winner: "myBusiness",
      myScore: myOverall,
      competitorScore: competitorOverall,
      difference: +(myOverall - competitorOverall).toFixed(1),
      insight: `Your overall score (${myOverall}/10) is higher than the competitor's (${competitorOverall}/10).`,
    };
  }
  if (competitorOverall > myOverall) {
    return {
      winner: "competitor",
      myScore: myOverall,
      competitorScore: competitorOverall,
      difference: +(competitorOverall - myOverall).toFixed(1),
      insight: `The competitor's overall score (${competitorOverall}/10) is higher than yours (${myOverall}/10).`,
    };
  }
  return {
    winner: "tie",
    myScore: myOverall,
    competitorScore: competitorOverall,
    difference: 0,
    insight: "Both businesses have equal overall scores.",
  };
}

// ─────────────────────────────────────────────────────────────
// Gemini Prompt
// Scores and comparisons are pre-computed and passed in so
// Gemini focuses purely on language and insight, not arithmetic.
// ─────────────────────────────────────────────────────────────
export function buildPrompt(ctx: {
  myBusiness: any;
  competitors: any[];
}): string {
  return `
You are an expert business analyst and local SEO consultant.

All scores and comparisons have already been calculated.
Do NOT perform any arithmetic or recalculate scores.
Use the supplied values exactly as provided.

MY_BUSINESS:
${JSON.stringify(ctx.myBusiness, null, 2)}

COMPETITORS:
${JSON.stringify(ctx.competitors, null, 2)}

Rules:
- Analyze ONLY the provided data.
- Never guess or invent missing information.
- Focus primarily on improving YOUR_BUSINESS.
- Use each competitor's "comparisons" object directly.
- Keep explanations short and simple.
- Maximum 3 items per array.
- Return ONLY valid JSON.
- No markdown.
- No code fences.

Return exactly:

{
  "summary": {
    "overallPosition": "<short sentence describing how MY_BUSINESS compares to competitors>",
    "strongestCompetitor": "<competitor name>",
    "confidence": 0
  },

  "myBusiness":{}


  "profileImprovements": [
  {
    "title": "",
    "currentState": "",
    "benefit": "",
    "impact": "high|medium|low",
    "impactScore": 0
  }
]
}
Rules for profileImprovements:

- Identify features that competitors have but Your_BUSINESS lacks.
- Use each competitor's comparisons.onlinePresence.missing.
- Explain how adding or improving the missing feature could help Your_BUSINESS grow.
- Focus on practical improvements such as:
  - Website
  - Opening hours
  - More reviews
  - Additional categories

- "currentState" should describe what competitors have that Your_BUSINESS does not.
- "benefit" should explain how adding the feature could improve visibility, trust, customer experience, or rankings.
- "impact" must be one of: high, medium, low.
- "impactScore" must represent estimated business impact on a scale from 1 to 10.
- Maximum 3 items.
- Include a "myBusiness" object. 
- Copy the MY_BUSINESS object exactly as provided. 
- Do not modify, remove, recalculate, or invent any fields.
 - Preserve all values. - Return the complete MY_BUSINESS data.
  - Analyze ONLY the provided data.
   - Never guess missing information.
- Think of impactScore as a graph value:
  - 9-10 = major growth opportunity.
  - 6-8 = moderate opportunity.
  - 1-5 = minor opportunity.

Examples:

{
  "title": "Add Website",
  "currentState": "Several competitors have websites while Your_BUSINESS does not.",
  "benefit": "Having a website can increase customer trust and improve online visibility.",
  "impact": "high",
  "impactScore": 10
}

{
  "title": "Increase Review Count",
  "currentState": "Competitors have many more reviews than Your_BUSINESS.",
  "benefit": "More reviews can improve credibility and attract additional customers.",
  "impact": "high",
  "impactScore": 9
}

Requirements:
- Include ALL competitors.
- Use each competitor's comparisons.overall.insight.
- Use comparisons.onlinePresence.missing when identifying weaknesses.
- Use comparisons.onlinePresence.advantages when identifying strengths.
- Recommendations should focus on improving MY_BUSINESS.
`;
}