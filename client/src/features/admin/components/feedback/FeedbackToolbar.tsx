import { RefreshCw } from "lucide-react";
import type { FeedbackFilter } from "../../types";
import {
  AdminButton,
  AdminSearchInput,
  FilterPills,
  PageHeader,
  UnreadBadge,
} from "../common/adminUi";

type FeedbackToolbarProps = {
  filter: FeedbackFilter;
  search: string;
  unreadCount: number;
  onFilterChange: (filter: FeedbackFilter) => void;
  onSearchChange: (search: string) => void;
  onRefresh: () => void;
};

const FILTERS: readonly FeedbackFilter[] = ["all", "unread", "read"] as const;

export function FeedbackToolbar({
  filter,
  search,
  unreadCount,
  onFilterChange,
  onSearchChange,
  onRefresh,
}: FeedbackToolbarProps) {
  return (
    <PageHeader
      description={
        <>
          Ratings and comments submitted during the virtual tour experience.
          <UnreadBadge count={unreadCount} />
        </>
      }
      actions={
        <>
          <FilterPills value={filter} options={FILTERS} onChange={onFilterChange} />
          <AdminSearchInput
            placeholder="Search feedback..."
            value={search}
            onChange={onSearchChange}
          />
          <AdminButton variant="secondary" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </AdminButton>
        </>
      }
    />
  );
}
