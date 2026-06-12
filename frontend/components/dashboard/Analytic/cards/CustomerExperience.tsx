import { Users } from "lucide-react";

interface Props {
  customerExperienceAnalysis: any;
}

export default function CustomerExperience({
  customerExperienceAnalysis,
}: Props) {
  if (!customerExperienceAnalysis) return null;

  return (
    <div className="bg-[#111318] border border-slate-800 rounded-xl p-5">

      <div className="flex items-center gap-2 mb-4">
        <Users
          size={15}
          className="text-violet-400"
        />

        <h2 className="text-sm font-semibold text-white">
          Customer Experience
        </h2>
      </div>

      {/* positive themes */}

      {/* negative themes */}

      {/* top topics */}

    </div>
  );
}