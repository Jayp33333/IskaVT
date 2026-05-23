import { useAdmin } from "../../context/AdminContext";
import { StatCard } from "./StatCard";

export function StatsGrid() {
  const { data } = useAdmin();
  const stats = data.stats;
  if (!stats) return null;

  const activeCount = data.latestEntries.filter((e) => !e.timeOut).length;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        variant="primary"
        label="Total Visitors"
        value={stats.monthCount}
        description="Total visitors this month"
        trend="up"
      />
      <StatCard
        label="Today"
        value={stats.todayCount}
        description="Visitors logged in today"
        trend="up"
      />
      <StatCard
        label="This Week"
        value={stats.weekCount}
        description="Visitors from Monday until today"
        trend="up"
      />
      <StatCard
        label="Active Sessions"
        value={activeCount}
        description="Currently active visitors"
        trend="neutral"
        trendLabel="In Progress"
      />
    </section>
  );
}
