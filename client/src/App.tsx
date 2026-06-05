import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import ExperienceScene from "./pages/ExperienceScene";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AboutOverviewPage from "./pages/AboutOverviewPage";
import ContactPage from "./pages/ContactPage";
import FeaturesPage from "./pages/FeaturesPage";
import ProgramsPage from "./pages/ProgramsPage";
import FaqPage from "./pages/FaqPage";
import DevelopersPage from "./pages/DevelopersPage";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/about" element={<AboutOverviewPage />} />
        <Route path="/about/:section" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/resources/faq" element={<FaqPage />} />
        <Route path="/resources/developers" element={<DevelopersPage />} />
        <Route path="/experience" element={<ExperienceScene />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
