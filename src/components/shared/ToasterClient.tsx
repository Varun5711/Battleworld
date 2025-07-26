"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterClient() {
  return <Toaster
  toastOptions={{
    duration: 5000,
    style: {
      background: "#0f0f0f", // Dark Doom background
      color: "#f87171",      // Blood red for errors by default
      border: "1px solid #7f1d1d",
      fontFamily: "monospace",
      fontSize: "0.9rem",
      boxShadow: "0 0 10px #7f1d1d",
    },
    success: {
      style: {
        background: "#0f1f0f",
        color: "#86efac",      // Muted green for approvals
        border: "1px solid #166534",
        boxShadow: "0 0 10px #166534",
      },
    },
    error: {
      style: {
        background: "#1f0f0f",
        color: "#f87171",
        border: "1px solid #7f1d1d",
        boxShadow: "0 0 10px #7f1d1d",
      },
    },
  }}
/>
}