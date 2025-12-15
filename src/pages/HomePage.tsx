import { Hero } from "../components/Home/Hero";
import { Features } from "../components/Home/Features";

export default function HomePage() {
  return (
    <div
      style={{
        background: "#0e0e0e",
        color: "white",
        position: "absolute",
        inset: 0,
      }}
    >
      {/* Hero Section */}
      <Hero />
      {/* Feature Section */}
      <Features />

      {/* About Section */}
    </div>
  );
}
