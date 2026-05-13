export const calculateHarvestReadiness = (plantedAt: string, expectedDays: number) => {
  const start = new Date(plantedAt);
  const today = new Date();
  const elapsed = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  const progress = Math.min((elapsed / expectedDays) * 100, 100);
  const daysRemaining = Math.max(expectedDays - elapsed, 0);

  return {
    progress,
    status: progress >= 90 ? "Harvest Ready" : "Growing",
    daysRemaining
  };
};