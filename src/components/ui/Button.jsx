export default function Button({ children, className = "", variant = "primary", ...props }) {
  const variants = {
    primary:
      "bg-white text-slate-900 dark:bg-slate-900 dark:text-white hover:opacity-95",
    ghost:
      "bg-white/6 dark:bg-white/6 text-slate-900 dark:text-white hover:bg-white/10 dark:hover:bg-white/10",
    glass:
      "bg-white/8 dark:bg-white/6 text-slate-900 dark:text-white border border-white/10 hover:bg-white/12",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border-2 border-gray-300 bg-transparent text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/6 dark:hover:text-black",
  };

  return (
    <button
      className={`focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
