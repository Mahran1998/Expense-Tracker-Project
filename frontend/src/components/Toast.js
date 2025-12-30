import React from "react";

export default function Toast({ message, type = "info", onClose }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      <span>{message}</span>
      <button className="btn btn-ghost" onClick={onClose} aria-label="Close">
        ✕
      </button>
    </div>
  );
}
