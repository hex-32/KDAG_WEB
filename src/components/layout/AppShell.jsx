import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppShell() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto w-full max-w-[1480px] px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

