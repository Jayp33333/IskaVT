import { Hero } from "../components/Home/Hero";
import { Features } from "../components/Home/Features";
import { NavBar } from "../components/Home/NavBar";
import { About } from "../components/Home/About";
import { Contact } from "../components/Home/Contact";
import { Footer } from "../components/Home/Footer";

export default function HomePage() {
  return (
    <div className="bg-white absolute inset-0">
      <NavBar />
      <Hero />
      <Features />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
