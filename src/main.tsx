import React from "react";
import ReactDOM from "react-dom/client";
import { TripRoadbook } from "@/components/trip-roadbook";
import "@/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TripRoadbook />
  </React.StrictMode>,
);
