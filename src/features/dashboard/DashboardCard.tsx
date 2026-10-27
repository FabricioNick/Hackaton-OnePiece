interface DashboardCardProps {
  title: string;
  value: string | number;
}

export const DashboardCard = ({ title, value }: DashboardCardProps) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-center">
      <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">{title}</h3>
      <div className="text-3xl font-black text-amber-500">{value}</div>
    </div>
  );
};