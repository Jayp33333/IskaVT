import { Search, X } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import type { AdminTab } from "../../types";

export const ADMIN_BRAND = "#660B05";
export const ADMIN_BRAND_HOVER = "#8C1007";

export const adminCardClass =
  "rounded-2xl border border-gray-200/80 bg-white/90 shadow-sm shadow-gray-200/50 backdrop-blur-sm";

export const ADMIN_TAB_META: Record<
  AdminTab,
  { title: string; subtitle: string }
> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Overview and analytics",
  },
  visitors: {
    title: "Visitors",
    subtitle: "Logbook records",
  },
  messages: {
    title: "Messages",
    subtitle: "Contact inbox",
  },
  feedback: {
    title: "Tour Feedback",
    subtitle: "Tour ratings & comments",
  },
};

type PageHeaderProps = {
  title?: string;
  description?: ReactNode;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {title && (
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:hidden">
            {title}
          </h1>
        )}
        {description && (
          <p className={`text-sm text-gray-500 ${title ? "mt-1" : ""}`}>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}

type AdminCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md";
};

export function AdminCard({
  children,
  className = "",
  padding = "md",
}: AdminCardProps) {
  const pad =
    padding === "none" ? "" : padding === "sm" ? "p-4" : "p-5 sm:p-6";
  return (
    <section className={`${adminCardClass} ${pad} ${className}`.trim()}>
      {children}
    </section>
  );
}

type AdminCardHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
};

export function AdminCardHeader({
  title,
  subtitle,
  action,
  className = "",
}: AdminCardHeaderProps) {
  return (
    <div
      className={`mb-4 flex flex-wrap items-start justify-between gap-3 ${className}`.trim()}
    >
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function AdminButton({
  variant = "secondary",
  size = "md",
  className = "",
  children,
  ...props
}: AdminButtonProps) {
  const sizeClass =
    size === "sm"
      ? "px-3 py-1.5 text-xs rounded-lg"
      : "px-4 py-2 text-sm rounded-xl";

  const variantClass = {
    primary:
      "bg-[#660B05] text-white hover:bg-[#8C1007] shadow-sm shadow-[#660B05]/20",
    secondary:
      "border border-gray-200 bg-white text-gray-700 hover:border-[#660B05]/30 hover:bg-[#660B05]/5 hover:text-[#660B05]",
    ghost:
      "text-[#660B05] hover:bg-[#660B05]/10",
    danger:
      "border border-red-200 bg-white text-red-700 hover:bg-red-50 hover:border-red-300",
  }[variant];

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type AdminSearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  containerClassName?: string;
};

export function AdminSearchInput({
  value,
  onChange,
  onClear,
  containerClassName = "",
  className = "",
  ...props
}: AdminSearchInputProps) {
  return (
    <div className={`relative w-full sm:min-w-[220px] sm:max-w-xs ${containerClassName}`}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border border-gray-200 bg-gray-50/80 py-2 pl-10 pr-10 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-[#660B05] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#660B05]/15 ${className}`}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => (onClear ? onClear() : onChange(""))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#660B05]"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

type FilterPillsProps<T extends string> = {
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  formatLabel?: (value: T) => string;
};

export function FilterPills<T extends string>({
  value,
  options,
  onChange,
  formatLabel = (v) => v,
}: FilterPillsProps<T>) {
  return (
    <div
      className="inline-flex max-w-full overflow-x-auto rounded-xl border border-gray-200 bg-gray-50/80 p-0.5"
      role="group"
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all ${
              active
                ? "bg-white text-[#660B05] shadow-sm ring-1 ring-gray-200/80"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {formatLabel(opt)}
          </button>
        );
      })}
    </div>
  );
}

type AdminPaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  size?: "sm" | "md";
};

export function AdminPagination({
  page,
  totalPages,
  onPrev,
  onNext,
  size = "md",
}: AdminPaginationProps) {
  const btnSize = size === "sm" ? "sm" : "md";
  return (
    <div className="flex items-center gap-2">
      <AdminButton size={btnSize} variant="secondary" onClick={onPrev} disabled={page <= 1}>
        Prev
      </AdminButton>
      <span className="px-2 text-xs text-gray-600 tabular-nums sm:text-sm">
        {page} / {totalPages}
      </span>
      <AdminButton
        size={btnSize}
        variant="secondary"
        onClick={onNext}
        disabled={page >= totalPages}
      >
        Next
      </AdminButton>
    </div>
  );
}

type AdminEmptyStateProps = {
  message: string;
  className?: string;
};

export function AdminEmptyState({ message, className = "" }: AdminEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-12 text-center ${className}`}
    >
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
}

type UnreadBadgeProps = {
  count: number;
};

export function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count <= 0) return null;
  return (
    <span className="ml-2 inline-flex items-center gap-1.5 text-[#660B05]">
      <span className="h-2 w-2 rounded-full bg-[#660B05] animate-pulse" />
      <span className="text-xs font-semibold">
        {count} unread
      </span>
    </span>
  );
}

type DetailBackBarProps = {
  onBack: () => void;
  label?: string;
};

export function DetailBackBar({ onBack, label = "Back to list" }: DetailBackBarProps) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="mb-4 flex items-center gap-2 text-sm font-medium text-[#660B05] hover:text-[#8C1007] lg:hidden"
    >
      <span aria-hidden>←</span>
      {label}
    </button>
  );
}
