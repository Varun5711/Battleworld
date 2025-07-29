"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterClient() {
  return (
    <Toaster
      toastOptions={{
        duration: 4000,
        style: {
          background: "rgba(15, 15, 15, 0.95)", // Semi-transparent dark base
          color: "#cbd5e1",                    // Slate-gray text for default
          border: "1px solid #64748b",         // Slate border
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: "0.85rem",
          borderRadius: "12px",                // Premium rounded corners
          padding: "14px 18px",
          boxShadow: "0 0 16px rgba(100, 116, 139, 0.5)", // Subtle glow
          backdropFilter: "blur(6px)",
        },
        success: {
          style: {
            background: "#0f1f0f",
            color: "#86efac",
            border: "1px solid #22c55e",
            boxShadow: "0 0 12px #22c55e88",
            borderRadius: "12px",
          },
        },
        error: {
          style: {
            background: "#1f0f0f",
            color: "#f87171",
            border: "1px solid #ef4444",
            boxShadow: "0 0 12px #ef444488",
            borderRadius: "12px",
          },
        },
        loading: {
          style: {
            background: "#1e293b",
            color: "#93c5fd",
            border: "1px solid #3b82f6",
            boxShadow: "0 0 12px #3b82f666",
            borderRadius: "12px",
          },
        },
      }}
    />
  );
}