import React from "react";

export default function ToolButton({ children, handleEvent, title }) {
  return (
    <button
      className="cursor-pointer transition duration-300"
      onClick={handleEvent}
      title={title}
    >
      {children}
    </button>
  );
}
