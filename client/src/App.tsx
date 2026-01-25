import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExperienceScene from "./pages/ExperienceScene";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experience" element={<ExperienceScene />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
