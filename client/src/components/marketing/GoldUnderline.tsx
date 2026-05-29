type GoldUnderlineProps = {
  className?: string;
};

export function GoldUnderline({ className = "" }: GoldUnderlineProps) {
  return (
    <svg
      className={`absolute -bottom-1 left-0 w-full sm:-bottom-2 ${className}`}
      viewBox="0 0 300 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 15Q150 5 295 15"
        stroke="var(--color-gold)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
