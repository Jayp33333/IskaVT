import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExperienceScene from "./pages/ExperienceScene";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experience" element={<ExperienceScene />} />
      </Routes>
    </Router>
  );
}
