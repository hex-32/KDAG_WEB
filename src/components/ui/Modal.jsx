import React, { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import Button from "./Button";

export default function Modal({ open, title, children, onClose, theme }) {
  const [isMounted, setIsMounted] = useState(open);
  const [animClass, setAnimClass] = useState(open ? "animate-slide-in" : "");
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (open) {
      setIsMounted(true);
      // start enter animation on next frame
      requestAnimationFrame(() => setAnimClass("animate-slide-in"));
    } else if (isMounted) {
      setAnimClass("animate-slide-out");
      // match duration from tailwind.config.cjs (150ms)
      timeoutRef.current = setTimeout(() => setIsMounted(false), 150);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isMounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 backdrop-blur-sm"
      onClick={(e) => {
        // close only when clicking the backdrop, not the panel
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        className={`w-full border max-w-2xl rounded-2xl p-4  ${theme === 'dark' ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-glass ${animClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button variant="ghost" className="size-[20px ] px-0" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

