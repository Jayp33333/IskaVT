type SectionVariant = "cream" | "white" | "maroon" | "dark";

const variantClasses: Record<SectionVariant, string> = {
  cream: "bg-cream",
  white: "bg-white",
  maroon: "bg-maroon text-white",
  dark: "bg-ink text-white",
};

type SectionProps = {
  id?: string;
  variant?: SectionVariant;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  bleed?: boolean;
};

export function Section({
  id,
  variant = "cream",
  className = "",
  containerClassName = "",
  children,
  bleed = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24 xl:px-20 ${variantClasses[variant]} ${className}`}
    >
      <div
        className={
          bleed
            ? containerClassName
            : `container relative z-10 mx-auto max-w-6xl ${containerClassName}`
        }
      >
        {children}
      </div>
    </section>
  );
}
