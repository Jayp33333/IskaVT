import { Hero } from "../components/Home/Hero";
import { Features } from "../components/Home/Features";
import { NavBar } from "../components/Home/NavBar";

export default function HomePage() {
  return (
    <div className="bg-[#0e0e0e] text-white absolute inset-0">
      <NavBar />
      <Hero />
      <Features />
    </div>
  );
}
