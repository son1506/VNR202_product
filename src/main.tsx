// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./app/styles/index.css";
import "./app/styles/override.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
