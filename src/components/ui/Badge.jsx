export default function Badge({ children, active = false, className = "", ...props }) {
  return (
    <button
      className={`focus-ring inline-flex min-h-8 items-center rounded-md border px-3 text-xs font-semibold transition ${
        active
          ? "border-sky-400 bg-sky-500/20 text-sky-700 dark:text-white"
          : "border-line/30 bg-transparent text-muted hover:border-white/20 hover:bg-white/2  dark:hover:bg-white/6"
      } ${className}`}
      {...props}  
    >
      {children}
    </button>
  );
}

