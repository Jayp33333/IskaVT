import { NavBar } from "../components/Home/NavBar";
import { Programs } from "../components/Home/Programs";
import { Footer } from "../components/Home/Footer";

export default function ProgramsPage() {
  return (
    <div className="absolute inset-0 min-h-screen bg-[#FFFDF5]">
      <NavBar />
      <main className="pt-20">
        <Programs />
      </main>
      <Footer />
    </div>
  );
}
