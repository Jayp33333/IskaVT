import { Link } from "react-router-dom";
import { CampusSubtitle } from "../Home/CampusSubtitle";

type PageHeaderProps = {
  title: React.ReactNode;
  description?: string;
  animated?: boolean;
  backLink?: { to: string; label: string };
  className?: string;
};

export function PageHeader({
  title,
  description,
  animated = true,
  backLink,
  className = "",
}: PageHeaderProps) {
  return (
    <header
      className={`mb-10 flex flex-col items-center text-center sm:mb-12 lg:mb-14 ${className}`}
    >
      <CampusSubtitle animated={animated} />
      {backLink && (
        <Link
          to={backLink.to}
          className="mb-4 text-xs font-black uppercase tracking-widest text-maroon transition-colors hover:underline"
        >
          {backLink.label}
        </Link>
      )}
      <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description && (
        <p className="mt-4 max-w-2xl text-sm font-bold text-ink/60 sm:mt-5 sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
