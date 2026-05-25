import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      className="focus-ring inline-flex size-10 items-center justify-center rounded-md border border-line/25 bg-panel/50 text-ink transition hover:border-glow/50"
      onClick={toggleTheme}
      title="Toggle theme"
      aria-label="Toggle theme"
      type="button"
    >
      <Icon className="size-4" />
    </button>
  );
}

