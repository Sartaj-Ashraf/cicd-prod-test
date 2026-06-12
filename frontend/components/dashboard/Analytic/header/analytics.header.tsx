import { Shield } from "lucide-react";
interface ReputationHeaderProps {
  reputationScore: number;
}
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
    const r = size / 2 - 8;
    const circ = 2 * Math.PI * r;
    const fill = (score / 100) * circ;
    const color =
        score >= 80 ? "#34d399" : score >= 60 ? "#38bdf8" : score >= 40 ? "#fbbf24" : "#f87171";

    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={6} />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={color}
                strokeWidth={10}
                strokeDasharray={`${fill} ${circ - fill}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s ease" }}
            />
        </svg>
    );
}
export default function ReputationHeader({
  reputationScore,
}: ReputationHeaderProps) {
  return (
   <header className="grid grid-cols-1 lg:grid-cols-3 items-center gap-8 w-full">
    <div className="flex flex-col gap-2 col-span-2" >
      <div className="flex items-center  gap-2 mb-1">
        {/* Pulse dot using your leaf-main variable */}
      <div className="w-2 h-2 rounded-full bg-leaf-main animate-pulse" />

      <span className="text-[10px] font-mono text-leaf-main tracking-[0.2em] uppercase">
        Live Analytics
      </span>
    </div>

    <h1 className="text-6xl! tracking-tight text-heading">
      Reputation <br/> Intelligence
    </h1>

    <p className="text-medium text-muted-foreground mt-1">
      AI-powered review analytics · Google Places data
    </p>
  </div>

  <div className="flex flex-col items-center justify-center gap-2 col-span-1 self-end">
    <div className="relative">
      <ScoreRing score={reputationScore} size={250}/>

      <div className="absolute inset-0 flex items-center justify-center">
         <p className="text-6xl! font-bold text-leaf-main">
        {reputationScore}
      </p>
        
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs text-muted-foreground">
        Reputation Score
      </p>
    </div>
  </div>
</header>
  );
}