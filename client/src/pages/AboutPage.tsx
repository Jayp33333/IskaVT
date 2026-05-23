import { NavBar } from "../components/Home/NavBar";
import { About } from "../components/Home/About";
import { Footer } from "../components/Home/Footer";

export default function AboutPage() {
  return (
    <div className="bg-[#FFFDF5] absolute inset-0 min-h-screen">
      <NavBar />
      <main className="pt-20">
        <About />
      </main>
      <Footer />
    </div>
  );
}
