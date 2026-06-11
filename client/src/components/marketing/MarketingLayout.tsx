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
    document.documentElement.style.colorScheme = "light";
    document.body.classList.add("marketing-site", "marketing-no-shadow");
    return () => {
      document.documentElement.style.colorScheme = "";
      document.body.classList.remove("marketing-site", "marketing-no-shadow");
    };
  }, []);

  return (
    <div className="scheme-light min-h-screen bg-cream text-ink antialiased">
      <NavBar />
      <main className={hero ? undefined : "pt-14 sm:pt-16 lg:pt-[4.5rem] xl:pt-20"}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
