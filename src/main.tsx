import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./app/globals.css";

/** Titik masuk React: muat tema global lalu render aplikasi. */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
