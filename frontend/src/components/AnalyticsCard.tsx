interface AnalyticsCard {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

const AnalyticsCard = ({ title, value, icon: Icon, color }: AnalyticsCard) => {
  return (
    <div
      className={`bg-zinc-200 rounded-lg p-6 shadow-lg overflow-hidden relative ${color}`}
    >
      <div className="flex justify-between items-center">
        <div className="z-10">
          <p className="mb-1 font-bold">{title}</p>
          <h3 className="text-3xl font-bold text-zinc-800">{value}</h3>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br opacity-30" />
      <div className="absolute -bottom-4 -right-4 lg:opacity-10 opacity-25">
        <Icon className="h-28 w-28" />
      </div>
    </div>
  );
};

export default AnalyticsCard;
