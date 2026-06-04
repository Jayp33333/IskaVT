import { RefreshCw } from "lucide-react";
import type { MessageFilter } from "../../types";
import {
  AdminButton,
  AdminSearchInput,
  FilterPills,
  PageHeader,
  UnreadBadge,
} from "../common/adminUi";

type MessagesToolbarProps = {
  filter: MessageFilter;
  search: string;
  unreadCount: number;
  onFilterChange: (filter: MessageFilter) => void;
  onSearchChange: (search: string) => void;
  onRefresh: () => void;
};

const FILTERS: readonly MessageFilter[] = ["all", "unread", "read"] as const;

export function MessagesToolbar({
  filter,
  search,
  unreadCount,
  onFilterChange,
  onSearchChange,
  onRefresh,
}: MessagesToolbarProps) {
  return (
    <PageHeader
      description={
        <>
          Messages submitted through the website contact form.
          <UnreadBadge count={unreadCount} />
        </>
      }
      actions={
        <>
          <FilterPills value={filter} options={FILTERS} onChange={onFilterChange} />
          <AdminSearchInput
            placeholder="Search messages..."
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
