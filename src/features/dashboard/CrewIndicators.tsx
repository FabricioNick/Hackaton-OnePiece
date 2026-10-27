import { DashboardCard } from './DashboardCard';

interface IndicatorsProps {
  bountiesCollected: number;
  crewRank: string;
  logPoseStatus: string;
}

export const CrewIndicators = ({ bountiesCollected, crewRank, logPoseStatus }: IndicatorsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <DashboardCard title="Rango de Tripulación" value={crewRank} />
      <DashboardCard title="Recompensas (Beries)" value={`B$ ${bountiesCollected.toLocaleString()}`} />
      <DashboardCard title="Estado del Log Pose" value={logPoseStatus} />
    </div>
  );
};