import { NavBar } from "../Home/NavBar";
import { Footer } from "../Home/Footer";

type MarketingLayoutProps = {
  children: React.ReactNode;
  /** Home hero handles its own top spacing below the fixed nav. */
  hero?: boolean;
};

export function MarketingLayout({ children, hero = false }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen bg-cream text-ink antialiased">
      <NavBar />
      <main className={hero ? undefined : "pt-20"}>{children}</main>
      <Footer />
    </div>
  );
}
