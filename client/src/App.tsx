import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
import { SuperAdminProtectedRoute } from "./components/SuperAdminProtectedRoute";
import { FeedbackSettingsProvider } from "./context/FeedbackSettingsContext";
import ExperienceScene from "./pages/ExperienceScene";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import SuperAdminLoginPage from "./pages/SuperAdminLoginPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import AboutOverviewPage from "./pages/AboutOverviewPage";
import ContactPage from "./pages/ContactPage";
import FeaturesPage from "./pages/FeaturesPage";
import ProgramsPage from "./pages/ProgramsPage";
import FaqPage from "./pages/FaqPage";
import HandbookPage from "./pages/HandbookPage";
import DevelopersPage from "./pages/DevelopersPage";
import { UpdatePrompt } from "./components/UpdatePrompt";

export default function App() {
  return (
    <Router>
      <FeedbackSettingsProvider>
      <UpdatePrompt />
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
        <Route path="/resources/handbook" element={<HandbookPage />} />
        <Route path="/resources/developers" element={<DevelopersPage />} />
        <Route path="/experience" element={<ExperienceScene />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
        <Route
          path="/super-admin"
          element={
            <SuperAdminProtectedRoute>
              <SuperAdminDashboard />
            </SuperAdminProtectedRoute>
          }
        />
      </Routes>
      </FeedbackSettingsProvider>
    </Router>
  );
}
