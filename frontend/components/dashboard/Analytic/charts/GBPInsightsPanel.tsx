"use client";

import {
  Search, Image, FileText,
  AlertTriangle, CheckCircle, Clock, Info,
} from "lucide-react";
import type { GBPInsights, SearchKeyword } from "@/types/dashboard/Analytics.types";

interface Props {
  gbpInsights: GBPInsights;
}

const TAG_CONFIG: Record<SearchKeyword["type"], { label: string; color: string }> = {
  direct:      { label: "Direct",      color: "text-leaf-main bg-leaf-main/10 border-leaf-main/20"            },
  high_intent: { label: "High intent", color: "text-mango-mid bg-mango-mid/10 border-mango-mid/20"            },
  generic:     { label: "Generic",     color: "text-muted-foreground bg-muted border-border"                  },
  competitor:  { label: "Competitor",  color: "text-mango-orange bg-mango-orange/10 border-mango-orange/20"   },
};

export default function GBPInsightsPanel({ gbpInsights }: Props) {
  const { searchKeywords, photos, posts } = gbpInsights;

  // ── direct % insight ─────────────────────────────────────────────────────
  const totalImpressions  = searchKeywords?.reduce((s, k) => s + k.impressions, 0) ?? 0;
  const directImpressions = searchKeywords
    ?.filter((k) => k.type === "direct")
    .reduce((s, k) => s + k.impressions, 0) ?? 0;
  const directPct = totalImpressions > 0
    ? Math.round((directImpressions / totalImpressions) * 100)
    : 0;

  return (
    <div className="space-y-4">

      {/* ── search keywords ── */}
      {searchKeywords?.length ? (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Search size={15} className="text-mango-mid" />
            <h2 className="text-lg! font-semibold text-foreground">
              How Customers Find You
            </h2>
            <span className="ml-auto text-xs text-muted-foreground font-mono">
              last 3 months
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Exact words customers typed into Google Search or Maps that led them
            to your listing. Some may be competitor names — Google showed your
            business alongside them.
          </p>

          <div className="space-y-2">
            {searchKeywords.map((kw, i) => {
              const max = searchKeywords[0]?.impressions ?? 1;
              const pct = Math.round((kw.impressions / max) * 100);
              const tag = TAG_CONFIG[kw.type] ?? TAG_CONFIG.generic;

              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-4 font-mono shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground flex-1 truncate">
                    {kw.keyword}
                  </span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border shrink-0 ${tag.color}`}>
                    {tag.label}
                  </span>
                  <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden shrink-0">
                    <div
                      className="h-full bg-leaf-main rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono w-12 text-right shrink-0">
                    {kw.impressions.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* legend */}
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-3">
            {(Object.entries(TAG_CONFIG) as [SearchKeyword["type"], typeof TAG_CONFIG[SearchKeyword["type"]]][]).map(
              ([type, { label, color }]) => (
                <div key={type} className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${color}`}>
                    {label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {type === "direct"      && "searched your name"}
                    {type === "high_intent" && "ready to visit/book"}
                    {type === "generic"     && "broad search, found by location"}
                    {type === "competitor"  && "searched another business"}
                  </span>
                </div>
              )
            )}
          </div>

          {/* direct % insight */}
          {directPct < 10 && (
            <div className="mt-3 flex items-start gap-2 text-xs text-mango-orange bg-mango-orange/5 border border-mango-orange/20 rounded-lg px-3 py-2">
              <Info size={12} className="mt-0.5 shrink-0" />
              <span>
                Only <strong>{directPct}%</strong> of impressions come from people
                searching your name directly — most find you by accident.
                Consider building brand awareness.
              </span>
            </div>
          )}
          {directPct >= 30 && (
            <div className="mt-3 flex items-start gap-2 text-xs text-leaf-main bg-leaf-main/5 border border-leaf-main/20 rounded-lg px-3 py-2">
              <CheckCircle size={12} className="mt-0.5 shrink-0" />
              <span>
                <strong>{directPct}%</strong> of impressions are direct name searches —
                strong brand recognition.
              </span>
            </div>
          )}
        </div>
      ) : null}

      {/* ── photos + posts side by side ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* photos */}
        {photos && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Image size={15} className="text-mango-orange" />
              <h2 className="text-lg! font-semibold text-foreground">Photos</h2>
              {photos.total < 10 ? (
                <span className="ml-auto flex items-center gap-1 text-xs text-amber-500 font-medium">
                  <AlertTriangle size={12} />
                  Low
                </span>
              ) : (
                <span className="ml-auto flex items-center gap-1 text-xs text-leaf-main font-medium">
                  <CheckCircle size={12} />
                  Good
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Photos on your Google listing. Owner photos are uploaded by you —
              customer photos are uploaded by visitors on Google Maps or with reviews.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total photos</span>
                <span className={`text-2xl font-bold ${
                  photos.total < 10 ? "text-amber-500" : "text-leaf-main"
                }`}>
                  {photos.total}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Owner</p>
                  <p className="text-base font-semibold text-foreground">{photos.owner}</p>
                  <p className="text-[10px] text-muted-foreground/60">uploaded by you</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  <p className="text-base font-semibold text-foreground">{photos.customer}</p>
                  <p className="text-[10px] text-muted-foreground/60">uploaded by visitors</p>
                </div>
              </div>

              {photos.lastPhotoDate && (
                <div className="flex items-center gap-2 pt-1 border-t border-border">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Last photo added:{" "}
                    {new Date(photos.lastPhotoDate).toLocaleDateString("en-US", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </span>
                </div>
              )}

              {photos.total < 10 && (
                <p className="text-xs text-amber-500/80 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                  Add {10 - photos.total} more photos — Google recommends at least
                  10 owner photos for better visibility
                </p>
              )}
            </div>
          </div>
        )}

        {/* posts */}
        {posts && (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={15} className="text-mango-mid" />
              <h2 className="text-lg! font-semibold text-foreground">Posts</h2>
              {posts.totalPosts === 0 ? (
                <span className="ml-auto flex items-center gap-1 text-xs text-destructive font-medium">
                  <AlertTriangle size={12} />
                  No posts
                </span>
              ) : posts.daysSinceLastPost !== null && posts.daysSinceLastPost > 30 ? (
                <span className="ml-auto flex items-center gap-1 text-xs text-destructive font-medium">
                  <AlertTriangle size={12} />
                  Stale
                </span>
              ) : (
                <span className="ml-auto flex items-center gap-1 text-xs text-leaf-main font-medium">
                  <CheckCircle size={12} />
                  Active
                </span>
              )}
            </div>

            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Posts are updates you publish on your Google listing — offers, events,
              announcements. Regular posting improves ranking and keeps customers engaged.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Recent posts found</span>
                <span className={`text-2xl font-bold ${
                  posts.totalPosts === 0 ? "text-destructive" : "text-foreground"
                }`}>
                  {posts.totalPosts}
                </span>
              </div>

              {posts.lastPostDate && (
                <div className="flex items-center gap-2">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Last post:{" "}
                    {new Date(posts.lastPostDate).toLocaleDateString("en-US", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                    {posts.daysSinceLastPost !== null && (
                      <span className={`ml-1 font-medium ${
                        posts.daysSinceLastPost > 30
                          ? "text-destructive"
                          : "text-leaf-main"
                      }`}>
                        ({posts.daysSinceLastPost}d ago)
                      </span>
                    )}
                  </span>
                </div>
              )}

              {posts.lastPostType && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Type:</span>
                  <span className="text-xs font-medium text-foreground capitalize">
                    {posts.lastPostType.toLowerCase()}
                  </span>
                </div>
              )}

              {posts.lastPostSummary && (
                <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2 line-clamp-2">
                  "{posts.lastPostSummary}"
                </p>
              )}

              {posts.totalPosts === 0 && (
                <p className="text-xs text-destructive/80 bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                  No posts found — post weekly (offers, updates, photos) to
                  improve your Google ranking
                </p>
              )}

              {posts.totalPosts > 0 &&
                posts.daysSinceLastPost !== null &&
                posts.daysSinceLastPost > 30 && (
                <p className="text-xs text-amber-500/80 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
                  Last post was {posts.daysSinceLastPost} days ago — Google
                  favors listings that post at least once a week
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}