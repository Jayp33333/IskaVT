import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExperienceScene from "./pages/ExperienceScene";
import HomePage from "./pages/HomePage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/experience" 
          element={
            <ProtectedRoute>
              <ExperienceScene />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
