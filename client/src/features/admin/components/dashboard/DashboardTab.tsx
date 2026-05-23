import { useAdmin } from "../../context/AdminContext";
import { LatestVisitorsList } from "./LatestVisitorsList";
import { StatsGrid } from "./StatsGrid";
import { TopDestinationsList } from "./TopDestinationsList";
import { VisitorsBarChart } from "./VisitorsBarChart";
import { VisitorTypePieChart } from "./VisitorTypePieChart";

export function DashboardTab() {
  const { data } = useAdmin();

  if (!data.stats) return null;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Monitor, analyze, and manage visitor data with comprehensive insights.
        </p>
      </div>

      <StatsGrid />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <VisitorsBarChart />
        <VisitorTypePieChart />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <LatestVisitorsList />
        <TopDestinationsList />
      </section>
    </>
  );
}
