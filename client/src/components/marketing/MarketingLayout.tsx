import { useEffect } from "react";
import { NavBar } from "../Home/NavBar";
import { Footer } from "../Home/Footer";

type MarketingLayoutProps = {
  children: React.ReactNode;
  /** Home hero handles its own top spacing below the fixed nav. */
  hero?: boolean;
};

export function MarketingLayout({ children, hero = false }: MarketingLayoutProps) {
  useEffect(() => {
    document.body.classList.add("marketing-no-shadow");
    return () => document.body.classList.remove("marketing-no-shadow");
  }, []);

  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <NavBar />
      <main className={hero ? undefined : "pt-14 sm:pt-16 lg:pt-[4.5rem] xl:pt-20"}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
