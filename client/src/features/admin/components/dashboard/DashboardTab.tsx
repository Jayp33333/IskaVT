import { useAdmin } from "../../context/AdminContext";
import { LatestFeedbackList } from "./LatestFeedbackList";
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
      <StatsGrid />

      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <VisitorsBarChart />
        <VisitorTypePieChart />
      </section>

      <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <LatestVisitorsList />
        <LatestFeedbackList />
        <TopDestinationsList />
      </section>
    </>
  );
}
