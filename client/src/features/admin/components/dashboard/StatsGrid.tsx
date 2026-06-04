import { useAdmin } from "../../context/AdminContext";
import { StarRatingDisplay } from "../common/StarRatingDisplay";
import { StatCard } from "./StatCard";

export function StatsGrid() {
  const { data } = useAdmin();
  const stats = data.stats;
  if (!stats) return null;

  const activeCount = data.latestEntries.filter((e) => !e.timeOut).length;
  const feedbackStats = data.feedbackStats;
  const hasFeedback = (feedbackStats?.totalCount ?? 0) > 0;
  const averageRating = feedbackStats?.averageRating ?? null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
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
      <StatCard
        label="Average Rating"
        value={
          hasFeedback && averageRating != null ? (
            <div className="flex flex-col gap-2">
              <span>{averageRating.toFixed(1)}</span>
              <StarRatingDisplay
                rating={Math.round(averageRating)}
                size="md"
                showLabel
              />
            </div>
          ) : (
            <span className="text-2xl text-gray-400">—</span>
          )
        }
        description={
          hasFeedback
            ? `From ${feedbackStats!.totalCount} tour feedback submission${
                feedbackStats!.totalCount === 1 ? "" : "s"
              }`
            : "No tour feedback yet"
        }
        trend="neutral"
        trendLabel={hasFeedback ? "All time" : undefined}
      />
    </section>
  );
}
