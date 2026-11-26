import { useAdmin } from "../../context/adminContextValue";
import { StarRatingDisplay } from "../common/StarRatingDisplay";
import { StatCard, type StatTrend } from "./StatCard";

type TrendProps = {
  trend: StatTrend;
  trendLabel: string;
  trendDescription: string;
};

/**
 * Compares a period-to-date count with the same elapsed span of the previous
 * period (`stats.previous`, computed by the backend). Shows "—" when there is
 * no baseline (older backend, or nothing logged in the previous span).
 */
function compareWithPrevious(
  current: number,
  previous: number | undefined,
  shortVs: string,
  longVs: string
): TrendProps {
  if (previous == null || !Number.isFinite(previous)) {
    return {
      trend: "neutral",
      trendLabel: "—",
      trendDescription: `No comparison data ${longVs}`,
    };
  }
  if (previous <= 0) {
    return {
      trend: "neutral",
      trendLabel: "—",
      trendDescription: `No baseline: no visitors ${longVs}`,
    };
  }

  const pct = Math.round(((current - previous) / previous) * 100);
  const detail = `${current.toLocaleString()} now vs ${previous.toLocaleString()} ${longVs}`;

  if (pct === 0) {
    return {
      trend: "neutral",
      trendLabel: `0% ${shortVs}`,
      trendDescription: `No change: ${detail}`,
    };
  }

  return {
    trend: pct > 0 ? "up" : "down",
    // U+2212 minus sign for a proper typographic negative.
    trendLabel: `${pct > 0 ? "+" : "−"}${Math.abs(pct)}% ${shortVs}`,
    trendDescription: `${Math.abs(pct)}% ${pct > 0 ? "more" : "fewer"}: ${detail}`,
  };
}

export function StatsGrid() {
  const { data } = useAdmin();
  const stats = data.stats;
  if (!stats) return null;

  const previous = stats.previous;
  const hasActiveCount = typeof stats.activeCount === "number";
  // Fallback for an older backend: open sessions among the latest entries only.
  const activeCount =
    stats.activeCount ?? data.latestEntries.filter((e) => !e.timeOut).length;

  const feedbackStats = data.feedbackStats;
  const hasFeedback = (feedbackStats?.totalCount ?? 0) > 0;
  const averageRating = feedbackStats?.averageRating ?? null;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      <StatCard
        variant="primary"
        label="This Month"
        value={stats.monthCount}
        description="Visitors logged since the 1st of this month"
        {...compareWithPrevious(
          stats.monthCount,
          previous?.monthCount,
          "vs last month",
          "at the same point last month"
        )}
      />
      <StatCard
        label="Today"
        value={stats.todayCount}
        description="Visitors logged in today"
        {...compareWithPrevious(
          stats.todayCount,
          previous?.todayCount,
          "vs yesterday",
          "at the same time yesterday"
        )}
      />
      <StatCard
        label="This Week"
        value={stats.weekCount}
        description="Visitors from Monday until today"
        {...compareWithPrevious(
          stats.weekCount,
          previous?.weekCount,
          "vs last week",
          "at the same point last week"
        )}
      />
      <StatCard
        label="Active Sessions"
        value={activeCount}
        description={
          hasActiveCount
            ? "Open sessions started today"
            : "Open sessions among the latest entries"
        }
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
