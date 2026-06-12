import { Flame } from "lucide-react";


interface Props {
  growthOpportunities: any[];
}

export default function GrowthOpportunities({
  growthOpportunities,
}: Props) {
  if (!growthOpportunities?.length)
    return null;

  return (
    <div className="bg-[#111318] border border-slate-800 rounded-xl p-5">

      <div className="flex items-center gap-2 mb-4">
        <Flame
          size={15}
          className="text-orange-400"
        />

        <h2 className="text-sm font-semibold text-white">
          Growth Opportunities
        </h2>
      </div>

      {/* mapped items */}

    </div>
  );
}