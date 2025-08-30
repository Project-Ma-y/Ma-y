// src/App.tsx
import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";

if (import.meta.env.PROD && window.location.protocol === "http:") {
  window.location.replace(
    `https://${window.location.host}${window.location.pathname}${window.location.search}`
  );
}

export default function App() {
  return (
  <RouterProvider router={router} />
  );
}
