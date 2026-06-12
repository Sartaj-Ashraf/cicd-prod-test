"use client";

import { Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
/* ─────────────────────────── TYPES ─────────────────────────── */
import { Summary,ReviewDistribution,Strength,Weakness,AiInsight,PriorityAction,RiskAlert,CompetitiveAnalysis,GrowthOpportunity,CustomerExperienceAnalysis,Analysis,DownloadReportProps } from "@/types/dashboard/report.types";
// interface Summary {
//   overallRating: number;
//   totalReviews: number;
//   reputationScore: number;
//   reviewVelocity: { value: number; status: string; insight: string };
//   responseRate: { value: number; status: string; insight: string };
//   customerSentiment: { score: number; summary: string };
// }
// interface ReviewDistribution {
//   fiveStar: number; fourStar: number; threeStar: number;
//   twoStar: number;  oneStar: number; "avg reviews": number;
// }
// interface Strength   { title: string; description: string; confidence?: number }
// interface Weakness   { title: string; description: string; severity?: string }
// interface AiInsight  { type: string; title: string; description: string; priority: string; action: string }
// interface PriorityAction { title: string; description: string; priority: string; recommendedAction: string; estimatedImpact: string }
// interface RiskAlert  { title: string; description: string; severity: string }
// interface CustomerExperienceAnalysis {
//   positiveThemes: string[]; negativeThemes: string[];
//   mostMentionedTopics: string[];
//   sentimentBreakdown: { positive: number; neutral: number; negative: number };
// }
// interface CompetitiveAnalysis {
//   marketPosition?: string; competitiveAdvantages?: string[]; gaps?: string[];
// }
// interface GrowthOpportunity { title: string; description: string; potential?: string }

// interface Analysis {
//   summary: Summary;
//   reviewDistribution: ReviewDistribution;
//   strengths: Strength[];
//   weaknesses: Weakness[];
//   aiInsights: AiInsight[];
//   priorityActions: PriorityAction[];
//   riskAlerts: RiskAlert[];
//   customerExperienceAnalysis?: CustomerExperienceAnalysis;
//   competitiveAnalysis?: CompetitiveAnalysis;
//   growthOpportunities?: GrowthOpportunity[];
// }

// interface DownloadReportProps {
//   analysis: Analysis;
//   locationName?: string;
// }

/* ─────────────────────────── HELPERS ─────────────────────────── */
const SEV: Record<string, string> = {
  critical:"#f87171", high:"#fb923c", medium:"#fbbf24", low:"#4ade80",
};
const PRI: Record<string, string> = {
  high:"#f87171", medium:"#fbbf24", low:"#4ade80",
};
const STA: Record<string, string> = {
  excellent:"#4ade80", good:"#86efac", average:"#fbbf24", poor:"#f87171", critical:"#ef4444",
};

function ringColor(s: number) {
  return s >= 80 ? "#4ade80" : s >= 60 ? "#38bdf8" : s >= 40 ? "#fbbf24" : "#f87171";
}

function svgRing(score: number, sz = 120) {
  const r = sz / 2 - 10, c = 2 * Math.PI * r, fill = (score / 100) * c;
  const col = ringColor(score);
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}" style="transform:rotate(-90deg)">
    <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="#1e2736" stroke-width="9"/>
    <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${col}" stroke-width="9"
      stroke-dasharray="${fill} ${c-fill}" stroke-linecap="round"/>
  </svg>`;
}

const badge = (txt: string, col: string) =>
  `<span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;
   padding:2px 8px;border-radius:20px;border:1px solid ${col}30;background:${col}18;color:${col};">${txt}</span>`;

const pill = (txt: string, bg: string, fg: string) =>
  `<span style="font-size:10px;padding:3px 10px;border-radius:20px;background:${bg};color:${fg};
   white-space:nowrap;display:inline-block;">${txt}</span>`;

const mono = (txt: string, col = "#64748b") =>
  `<div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;
   text-transform:uppercase;color:${col};margin-bottom:16px;padding-bottom:10px;
   border-bottom:1px solid #1e2736;">${txt}</div>`;

const card = (html: string, extra = "") =>
  `<div style="background:#141920;border:1px solid #1e2736;border-radius:14px;padding:24px;${extra}">${html}</div>`;

/* ─────────────────────────── REPORT BUILDER ─────────────────────────── */
function buildHTML(a: Analysis, loc: string): string {
  const {
    summary: s, reviewDistribution: rd,
    strengths, weaknesses, aiInsights, priorityActions, riskAlerts,
    customerExperienceAnalysis: cea, competitiveAnalysis: ca, growthOpportunities: go,
  } = a;

  const date  = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const maxSt = Math.max(rd.fiveStar, rd.fourStar, rd.threeStar, rd.twoStar, rd.oneStar, 1);
  const stars  = [
    { l:"5 ★", n: rd.fiveStar,  c:"#4ade80" },
    { l:"4 ★", n: rd.fourStar,  c:"#86efac" },
    { l:"3 ★", n: rd.threeStar, c:"#fbbf24" },
    { l:"2 ★", n: rd.twoStar,   c:"#fb923c" },
    { l:"1 ★", n: rd.oneStar,   c:"#f87171" },
  ];

  const pg = (num: string, title: string, content: string) => `
  <div style="padding:54px 66px;min-height:100vh;background:#07090e;page-break-before:always;">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:36px;
      padding-bottom:16px;border-bottom:1px solid #1e2736;">
      <div>
        <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.28em;text-transform:uppercase;
          color:#64748b;margin-bottom:5px;">Section ${num}</div>
        <h2 style="font-family:'DM Serif Display',serif;font-weight:400;font-size:28px;color:#e2e8f0;">${title}</h2>
      </div>
      <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;
        color:#1e2736;">${loc} · ${date}</div>
    </div>
    ${content}
  </div>`;

  /* ── COVER ── */
  const cover = `
  <div style="min-height:100vh;background:linear-gradient(150deg,#07090e 0%,#0c1320 60%,#07090e 100%);
    display:flex;flex-direction:column;justify-content:space-between;padding:58px 70px;
    position:relative;overflow:hidden;">
    <div style="position:absolute;top:-200px;right:-200px;width:560px;height:560px;border-radius:50%;
      background:radial-gradient(circle,rgba(74,222,128,.07) 0%,transparent 65%);pointer-events:none;"></div>
    <div style="position:absolute;bottom:-120px;left:-80px;width:400px;height:400px;border-radius:50%;
      background:radial-gradient(circle,rgba(245,158,11,.05) 0%,transparent 68%);pointer-events:none;"></div>

    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 14px #4ade80;"></div>
      <span style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#4ade80;">
        Mango Review · Oasis Ascend
      </span>
    </div>

    <div style="position:absolute;top:58px;right:70px;text-align:center;">
      <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.22em;text-transform:uppercase;
        color:#64748b;margin-bottom:10px;">Reputation Score</div>
      <div style="position:relative;width:120px;height:120px;margin:0 auto;">
        ${svgRing(s.reputationScore, 120)}
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
          font-family:'DM Serif Display',serif;font-size:42px;color:${ringColor(s.reputationScore)};">
          ${s.reputationScore}
        </div>
      </div>
    </div>

    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:72px 0 36px;">
      <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.3em;text-transform:uppercase;
        color:#64748b;margin-bottom:20px;">Reputation Intelligence Report</div>
      <h1 style="font-family:'DM Serif Display',serif;font-weight:400;font-size:58px;line-height:1.08;
        margin-bottom:14px;max-width:560px;color:#e2e8f0;">
        ${loc}<br/><span style="font-style:italic;color:#4ade80;">Analytics</span> Report
      </h1>
      <p style="font-family:'Sora',sans-serif;font-size:14px;color:#64748b;max-width:440px;line-height:1.65;">
        Comprehensive AI-powered reputation analysis derived from Google Places review data.
      </p>

      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:42px;">
        ${[
          { v:`${s.overallRating}/5`,          l:"Avg Rating" },
          { v:`${s.totalReviews}`,             l:"Total Reviews" },
          { v:`${s.responseRate.value}%`,      l:"Response Rate" },
          { v:`${s.customerSentiment.score}/100`, l:"Sentiment" },
          { v:`${s.reviewVelocity.value}/mo`,  l:"Review Velocity" },
        ].map(x => `
          <div style="border:1px solid #1e2736;border-radius:12px;padding:12px 20px;background:#0d1017;">
            <div style="font-family:'DM Serif Display',serif;font-size:20px;color:#e2e8f0;">${x.v}</div>
            <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;
              color:#64748b;margin-top:2px;">${x.l}</div>
          </div>`).join("")}
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:20px;
      border-top:1px solid #1e2736;">
      <span style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.24em;
        text-transform:uppercase;color:#64748b;">${date} · Confidential</span>
      <span style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.24em;
        text-transform:uppercase;color:#64748b;">AI-Powered · Google Places Data</span>
    </div>
  </div>`;

  /* ── PAGE 1: KPI + DISTRIBUTION + SENTIMENT ── */
  const p1 = pg("01", "Performance Overview", `
  
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:20px;">
      ${card(`
        ${mono("Review Distribution")}
        ${stars.map(x => `
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:11px;">
            <span style="font-family:'DM Mono',monospace;font-size:10px;color:#64748b;width:30px;">${x.l}</span>
            <div style="flex:1;height:8px;background:#1e2736;border-radius:4px;overflow:hidden;">
              <div style="height:100%;width:${maxSt>0?(x.n/maxSt)*100:0}%;background:${x.c};border-radius:4px;"></div>
            </div>
            <span style="font-family:'DM Mono',monospace;font-size:10px;color:#e2e8f0;width:22px;text-align:right;">${x.n}</span>
          </div>`).join("")}
        <div style="display:flex;align-items:center;gap:6px;margin-top:18px;padding-top:14px;border-top:1px solid #1e2736;">
          ${[1,2,3,4,5].map(i=>`<span style="font-size:13px;color:${i<=Math.round(rd["avg reviews"])?"#fbbf24":"#1e2736"};">★</span>`).join("")}
          <span style="font-family:'DM Serif Display',serif;font-size:20px;color:#e2e8f0;margin-left:6px;">${rd["avg reviews"]}</span>
          <span style="font-size:11px;color:#64748b;">overall average</span>
        </div>
      `)}

      ${card(`
        ${mono("Sentiment Breakdown")}
        ${cea ? `
          <div style="display:flex;gap:24px;margin-bottom:20px;">
            ${[
              {l:"Positive",v:cea.sentimentBreakdown.positive,c:"#4ade80"},
              {l:"Neutral", v:cea.sentimentBreakdown.neutral, c:"#64748b"},
              {l:"Negative",v:cea.sentimentBreakdown.negative,c:"#f87171"},
            ].map(x=>`
              <div>
                <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:#64748b;margin-bottom:4px;">${x.l}</div>
                <div style="font-family:'DM Serif Display',serif;font-size:26px;color:${x.c};">${x.v}%</div>
              </div>`).join("")}
          </div>
          <div style="display:flex;height:9px;border-radius:5px;overflow:hidden;gap:2px;margin-bottom:18px;">
            <div style="width:${cea.sentimentBreakdown.positive}%;background:#4ade80;border-radius:4px;"></div>
            <div style="width:${cea.sentimentBreakdown.neutral}%;background:#475569;border-radius:4px;"></div>
            <div style="width:${cea.sentimentBreakdown.negative}%;background:#f87171;border-radius:4px;"></div>
          </div>
          ${cea.positiveThemes?.length ? `
            <div style="margin-bottom:12px;">
              <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;margin-bottom:7px;">Positive Themes</div>
              <div style="display:flex;flex-wrap:wrap;gap:5px;">${cea.positiveThemes.map(t=>pill(t,"#14532d","#4ade80")).join("")}</div>
            </div>` : ""}
          ${cea.negativeThemes?.length ? `
            <div style="margin-bottom:12px;">
              <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;margin-bottom:7px;">Negative Themes</div>
              <div style="display:flex;flex-wrap:wrap;gap:5px;">${cea.negativeThemes.map(t=>pill(t,"#7f1d1d","#f87171")).join("")}</div>
            </div>` : ""}
          ${cea.mostMentionedTopics?.length ? `
            <div>
              <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;margin-bottom:7px;">Most Mentioned Topics</div>
              <div style="display:flex;flex-wrap:wrap;gap:5px;">${cea.mostMentionedTopics.map(t=>pill(t,"#1e2736","#94a3b8")).join("")}</div>
            </div>` : ""}
        ` : "<p style='font-size:12px;color:#64748b;'>No sentiment data available.</p>"}
      `)}
    </div>


  `);

  /* ── PAGE 2: STRENGTHS + WEAKNESSES + AI INSIGHTS ── */
  const p2 = pg("02", "Strengths · Weaknesses · AI Insights", `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
      ${card(`
        ${mono("↑ Strengths","#4ade80")}
        ${strengths.map((x,i)=>`
          <div style="display:flex;gap:14px;margin-bottom:${i<strengths.length-1?"18px":"0"};
            ${i<strengths.length-1?"padding-bottom:18px;border-bottom:1px solid #1e2736;":""}">
            <div style="width:6px;height:6px;border-radius:50%;background:#4ade80;margin-top:7px;flex-shrink:0;"></div>
            <div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;">
                <span style="font-size:13px;font-weight:600;color:#e2e8f0;">${x.title}</span>
                ${x.confidence ? `<span style="font-family:'DM Mono',monospace;font-size:10px;color:#4ade80;">${Math.round(x.confidence*100)}%</span>` : ""}
              </div>
              <p style="font-size:12px;color:#64748b;line-height:1.55;">${x.description}</p>
            </div>
          </div>`).join("")}
      `)}

      ${card(`
        ${mono("↓ Weaknesses","#fb923c")}
        ${weaknesses.map((x,i)=>`
          <div style="display:flex;gap:14px;margin-bottom:${i<weaknesses.length-1?"18px":"0"};
            ${i<weaknesses.length-1?"padding-bottom:18px;border-bottom:1px solid #1e2736;":""}">
            <div style="width:6px;height:6px;border-radius:50%;background:${SEV[x.severity??"low"]};margin-top:7px;flex-shrink:0;"></div>
            <div>
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;">
                <span style="font-size:13px;font-weight:600;color:#e2e8f0;">${x.title}</span>
                ${x.severity ? badge(x.severity, SEV[x.severity]??"#64748b") : ""}
              </div>
              <p style="font-size:12px;color:#64748b;line-height:1.55;">${x.description}</p>
            </div>
          </div>`).join("")}
      `)}
    </div>

    ${card(`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;
        padding-bottom:12px;border-bottom:1px solid #1e2736;">
        <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#fbbf24;">⚡ AI Insights</span>
        <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.14em;color:#64748b;">${aiInsights.length} signals detected</span>
      </div>
      ${aiInsights.map((ins,i)=>{
        const c = PRI[ins.priority]??"#64748b";
        return `
        <div style="border:1px solid ${c}22;border-radius:10px;padding:16px;background:${c}06;
          margin-bottom:${i<aiInsights.length-1?"12px":"0"};">
          <div style="display:flex;align-items:flex-start;gap:12px;">
            <div style="flex:1;">
              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:7px;">
                <span style="font-size:13px;font-weight:600;color:#e2e8f0;">${ins.title}</span>
                ${badge(ins.priority,c)} ${badge(ins.type,"#64748b")}
              </div>
              <p style="font-size:12px;color:#94a3b8;line-height:1.55;margin-bottom:8px;">${ins.description}</p>
              <div style="padding-left:10px;border-left:2px solid #1e2736;">
                <span style="font-size:11px;color:#64748b;font-style:italic;">${ins.action}</span>
              </div>
            </div>
          </div>
        </div>`}).join("")}
    `)}
  `);

  /* ── PAGE 3: PRIORITY ACTIONS + RISK ALERTS ── */
  const p3 = pg("03", "Priority Actions & Risk Alerts", `
    ${card(`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;
        padding-bottom:12px;border-bottom:1px solid #1e2736;">
        <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#fb923c;">◎ Priority Actions</span>
        <span style="font-family:'DM Mono',monospace;font-size:9px;color:#64748b;">${priorityActions?.length??0} tasks</span>
      </div>
      ${priorityActions?.length ? `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
          ${priorityActions.map(a=>{
            const c = PRI[a.priority]??"#64748b";
            return `
            <div style="background:#0d1017;border:1px solid #1e2736;border-radius:12px;padding:18px;
              position:relative;overflow:hidden;">
              <div style="position:absolute;top:0;left:0;right:0;height:2px;background:${c};opacity:.5;"></div>
              <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.15em;text-transform:uppercase;
                color:${c};margin-bottom:8px;">${a.priority} priority</div>
              <div style="font-size:13px;font-weight:600;color:#e2e8f0;margin-bottom:7px;">${a.title}</div>
              <p style="font-size:11px;color:#64748b;line-height:1.5;margin-bottom:12px;">${a.description}</p>
              <div style="border-top:1px solid #1e2736;padding-top:10px;margin-bottom:8px;">
                <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.14em;text-transform:uppercase;
                  color:#64748b;margin-bottom:4px;">Recommended Action</div>
                <p style="font-size:11px;color:#e2e8f0;line-height:1.45;">${a.recommendedAction}</p>
              </div>
              <div style="font-size:11px;color:#4ade80;font-weight:500;">Impact: ${a.estimatedImpact}</div>
            </div>`}).join("")}
        </div>
      ` : "<p style='font-size:12px;color:#64748b;'>No priority actions available.</p>"}
    `,"margin-bottom:22px;")}

    ${card(`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;
        padding-bottom:12px;border-bottom:1px solid #1e2736;">
        <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.22em;text-transform:uppercase;color:#f87171;">⚠ Risk Alerts</span>
        <span style="font-family:'DM Mono',monospace;font-size:9px;color:#f87171;">${riskAlerts?.length??0} active</span>
      </div>
      ${riskAlerts?.length ? `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
          ${riskAlerts.map(r=>{
            const c = SEV[r.severity]??"#64748b";
            return `
            <div style="border:1px solid ${c}26;border-radius:12px;padding:16px;background:${c}06;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
                <div style="width:7px;height:7px;border-radius:50%;background:${c};flex-shrink:0;"></div>
                <span style="font-size:12px;font-weight:600;color:#e2e8f0;flex:1;">${r.title}</span>
                ${badge(r.severity,c)}
              </div>
              <p style="font-size:11px;color:#64748b;line-height:1.5;">${r.description}</p>
            </div>`}).join("")}
        </div>
      ` : "<p style='font-size:12px;color:#64748b;'>No active risk alerts.</p>"}
    `)}
  `);

  /* ── PAGE 4: COMPETITIVE + GROWTH + EXECUTIVE SUMMARY ── */
  const p4 = pg("04", "Competitive Intelligence & Growth", `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px;">
      ${card(`
        ${mono("Competitive Analysis","#38bdf8")}
        ${ca?.marketPosition ? `
          <div style="margin-bottom:16px;">
            <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;margin-bottom:5px;">Market Position</div>
            <p style="font-size:13px;color:#e2e8f0;line-height:1.5;">${ca.marketPosition}</p>
          </div>` : ""}
        ${ca?.competitiveAdvantages?.length ? `
          <div style="margin-bottom:14px;">
            <div style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;margin-bottom:8px;">Competitive Advantages</div>
            ${ca.competitiveAdvantages.map(x=>`
              <div style="display:flex;gap:8px;margin-bottom:7px;">
                <span style="color:#4ade80;font-size:12px;line-height:1.5;">✓</span>
                <span style="font-size:12px;color:#94a3b8;line-height:1.5;">${x}</span>
              </div>`).join("")}
          </div>` : ""}
        ${!ca?.marketPosition && !ca?.competitiveAdvantages?.length && !ca?.gaps?.length
          ? "<p style='font-size:12px;color:#64748b;'>No competitive data available.</p>" : ""}
      `)}

      ${card(`
        ${mono("Growth Opportunities","#4ade80")}
        ${go?.length ? go.map((x,i)=>`
          <div style="margin-bottom:${i<go.length-1?"16px":"0"};
            ${i<go.length-1?"padding-bottom:16px;border-bottom:1px solid #1e2736;":""}">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;flex-wrap:wrap;">
              <span style="font-size:13px;font-weight:600;color:#e2e8f0;">${x.title}</span>
            </div>
            <p style="font-size:12px;color:#64748b;line-height:1.5;">${x.description}</p>
          </div>`).join("")
          : "<p style='font-size:12px;color:#64748b;'>No growth opportunity data available.</p>"}
      `)}
    </div>

    ${card(`
      ${mono("Executive Summary")}
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:14px;margin-bottom:20px;">
        ${[
          { l:"Reputation Score", v:`${s.reputationScore}/100`,       c: ringColor(s.reputationScore) },
          { l:"Avg Rating",       v:`${s.overallRating}/5`,            c:"#fbbf24" },
          { l:"Sentiment",        v:`${s.customerSentiment.score}/100`,c:"#4ade80" },
          { l:"Response Rate",    v:`${s.responseRate.value}%`,        c:"#38bdf8" },
          { l:"Total Reviews",    v:`${s.totalReviews}`,               c:"#a78bfa" },
        ].map(x=>`
          <div style="text-align:center;padding:16px 10px;background:#0d1017;border-radius:10px;border:1px solid #1e2736;">
            <div style="font-family:'DM Serif Display',serif;font-size:22px;color:${x.c};margin-bottom:4px;">${x.v}</div>
            <div style="font-family:'DM Mono',monospace;font-size:7px;letter-spacing:.18em;text-transform:uppercase;color:#64748b;">${x.l}</div>
          </div>`).join("")}
      </div>
      <p style="font-size:12px;color:#64748b;line-height:1.65;border-top:1px solid #1e2736;padding-top:16px;">
        ${s.customerSentiment.summary}
      </p>
    `)}

    <div style="margin-top:44px;padding-top:16px;border-top:1px solid #1e2736;
      display:flex;justify-content:space-between;align-items:center;">
      <span style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.24em;text-transform:uppercase;color:#1e2736;">
        Mango Review · Oasis Ascend
      </span>
      <span style="font-family:'DM Mono',monospace;font-size:8px;letter-spacing:.24em;text-transform:uppercase;color:#1e2736;">
        ${date} · Confidential & Proprietary
      </span>
    </div>
  `);

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=Sora:wght@300;400;500;600&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{background:#07090e;color:#e2e8f0;font-family:'Sora',sans-serif;font-size:14px;line-height:1.65;}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Reputation Report — ${loc}</title>
  <style>${css}</style>
</head>
<body>${cover}${p1}${p2}${p3}${p4}</body>
</html>`;
}

/* ─────────────────────────── COMPONENT ─────────────────────────── */
export default function DownloadReport({ analysis, locationName = "Business" }: DownloadReportProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    try {
      const html = buildHTML(analysis, locationName);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `reputation-report-${locationName.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setTimeout(() => setLoading(false), 900);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="
        inline-flex items-center gap-2
        px-4 py-2 rounded-lg
        border border-border bg-card
        text-sm font-medium text-foreground
        hover:border-leaf-main/40 hover:bg-card/70
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        group
      "
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin text-muted-foreground" />
          <span className="text-muted-foreground text-xs">Generating…</span>
        </>
      ) : (
        <>
          <FileText size={14} className="text-muted-foreground group-hover:text-leaf-main transition-colors" />
          <span>Download Report</span>
          <Download size={12} className="text-muted-foreground/40 group-hover:text-leaf-main/60 transition-colors" />
        </>
      )}
    </button>
  );
}