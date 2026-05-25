import { BookOpen, LogIn, Search, User } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky w-[80vw] top-0 z-40 border-b border-line/20 rounded border-white bg-canvas/68 backdrop-blur-glass shadow">
      <div className="mx-auto flex h-16 w-full max-w-[1480px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-md">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-ink text-canvas">
            <BookOpen className="size-5" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-black tracking-wide">KDAG Atlas</span>
            <span className="block text-xs text-muted">Blog Explorer</span>
          </span>
        </Link>

        <div className="mx-auto hidden h-10 min-w-0 max-w-xl flex-1 items-center gap-2 rounded-md border border-line/20 bg-panel/44 px-3 text-sm text-muted backdrop-blur-glass md:flex">
          <Search className="size-4 shrink-0" />
          <span className="truncate">Search title, author, tag, or domain</span>
          <kbd className="ml-auto rounded border border-line/24 px-2 py-0.5 text-[11px] text-muted">Ctrl K</kbd>
        </div>

        <nav className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <NavLink
            to={isAuthenticated ? "/profile" : "/login"}
            className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-line/25 bg-panel/50 px-3 text-sm font-semibold transition hover:border-glow/50"
          >
            {isAuthenticated ? <User className="size-4" /> : <LogIn className="size-4" />}
            <span className="hidden sm:inline">{isAuthenticated ? user?.name || "Profile" : "Login"}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
