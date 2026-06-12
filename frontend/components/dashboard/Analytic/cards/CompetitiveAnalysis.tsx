import {
  BarChart2,
  AlertTriangle,
} from "lucide-react";

interface Props {
  competitiveAnalysis: any;
}

export default function CompetitiveAnalysis({
  competitiveAnalysis,
}: Props) {
  if (!competitiveAnalysis) return null;

  return (
    <div className="bg-[#111318] border border-slate-800 rounded-xl p-5">

      <div className="flex items-center gap-2 mb-4">
        <BarChart2
          size={15}
          className="text-sky-400"
        />

        <h2 className="text-sm font-semibold text-white">
          Competitive Analysis
        </h2>
      </div>

      {/* content */}

    </div>
  );
}