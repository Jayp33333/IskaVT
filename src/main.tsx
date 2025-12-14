import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// 🔒 Safely silence iframe-related warning
window.addEventListener("error", (e) => {
  if (
    typeof e.message === "string" &&
    e.message.includes("Not in an iframe")
  ) {
    e.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
