
import { Viverse } from "@react-three/viverse";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExperienceScene from "./pages/ExperienceScene";
import HomePage from "./pages/HomePage";

export default function App() {

  return (
    <Viverse clientId={import.meta.env.VITE_VIVERSE_APP_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/experience" element={<ExperienceScene />} />
        </Routes>
      </Router>
    </Viverse>
  );
}
