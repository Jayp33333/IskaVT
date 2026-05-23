import type { AggregatedTimelinePoint, VisitorPeriod } from "../types";

type TimelinePoint = { date: string; count: number };

function aggregateDaily(timeline: TimelinePoint[]): AggregatedTimelinePoint[] {
  return timeline.slice(-7).map((item) => ({
    ...item,
    label: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
  }));
}

function aggregateWeekly(timeline: TimelinePoint[]): AggregatedTimelinePoint[] {
  const weeklyMap = new Map<
    string,
    { count: number; startDate: string; weekNum: number }
  >();

  timeline.forEach((item) => {
    const date = new Date(item.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());

    const weekKey = `${weekStart.getFullYear()}-${String(
      weekStart.getMonth() + 1
    ).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;

    if (!weeklyMap.has(weekKey)) {
      const yearStart = new Date(date.getFullYear(), 0, 1);
      const daysSinceYearStart = Math.floor(
        (date.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000)
      );
      const weekNum = Math.ceil(
        (daysSinceYearStart + yearStart.getDay() + 1) / 7
      );

      weeklyMap.set(weekKey, {
        count: 0,
        startDate: weekKey,
        weekNum,
      });
    }

    weeklyMap.get(weekKey)!.count += item.count;
  });

  return Array.from(weeklyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([, data]) => {
      const weekStartDate = new Date(data.startDate);
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekStartDate.getDate() + 6);

      const formatDate = (d: Date) =>
        d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      return {
        date: data.startDate,
        count: data.count,
        label: `${formatDate(weekStartDate)} - ${formatDate(weekEndDate)}`,
      };
    });
}

function aggregateMonthly(timeline: TimelinePoint[]): AggregatedTimelinePoint[] {
  const monthlyMap = new Map<string, number>();

  timeline.forEach((item) => {
    const date = new Date(item.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + item.count);
  });

  return Array.from(monthlyMap.entries())
    .slice(-12)
    .map(([key, count]) => ({
      date: `${key}-01`,
      count,
      label: new Date(`${key}-01`).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
    }));
}

function aggregateYearly(timeline: TimelinePoint[]): AggregatedTimelinePoint[] {
  const yearlyMap = new Map<number, number>();

  timeline.forEach((item) => {
    const year = new Date(item.date).getFullYear();
    yearlyMap.set(year, (yearlyMap.get(year) || 0) + item.count);
  });

  return Array.from(yearlyMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, count]) => ({
      date: `${year}-01-01`,
      count,
      label: String(year),
    }));
}

export function aggregateTimelineData(
  timeline: TimelinePoint[],
  period: VisitorPeriod
): AggregatedTimelinePoint[] {
  if (!timeline.length) return [];

  switch (period) {
    case "daily":
      return aggregateDaily(timeline);
    case "weekly":
      return aggregateWeekly(timeline);
    case "monthly":
      return aggregateMonthly(timeline);
    case "yearly":
      return aggregateYearly(timeline);
    default:
      return [];
  }
}
