import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ExperienceScene from "./pages/ExperienceScene";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProgramsPage from "./pages/ProgramsPage";
import { defaultAboutSection } from "./components/Home/data/pupLopezContent";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/about" element={<Navigate to={`/about/${defaultAboutSection}`} replace />} />
        <Route path="/about/:section" element={<AboutPage />} />
        <Route path="/experience" element={<ExperienceScene />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
