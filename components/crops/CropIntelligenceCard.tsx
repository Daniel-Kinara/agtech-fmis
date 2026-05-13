import { calculateHarvestReadiness } from "@/utils/crop-intelligence";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CropIntelligenceCard = ({ crop }: { crop: any }) => {
  const { progress, status, daysRemaining } = calculateHarvestReadiness(crop.planted_at, crop.duration);

  return (
    <div className={`p-4 border rounded-lg ${progress > 90 ? 'border-emerald-500 bg-emerald-50/50' : ''}`}>
      <div className="flex justify-between items-center">
        <span className="font-medium text-sm text-muted-foreground">{crop.name}</span>
        <span className="text-xs font-bold uppercase">{status}</span>
      </div>
      <div className="mt-2 text-2xl font-bold">{progress}% Mature</div>
      <p className="text-xs text-muted-foreground mt-1">
        {daysRemaining > 0 ? `${daysRemaining} days until estimated harvest` : "Optimized for market listing"}
      </p>
    </div>
  );
};