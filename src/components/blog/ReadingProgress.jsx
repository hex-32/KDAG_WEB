import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const article = document.querySelector(".article-body");
      if (article) {
        const rect = article.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const height = article.scrollHeight;
        // Start the bar when article enters viewport and finish when bottom leaves
        const scrolled = window.scrollY + window.innerHeight - top;
        const denom = height ;
        const pct = denom <= 0 ? 0 : Math.max(0, Math.min(100, Math.round((scrolled / denom) * 100)));
        setProgress(pct);
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max <= 0 ? 0 : Math.min(100, Math.round((window.scrollY / max) * 100)));
      }
    };

    // ensure first calculation runs after layout
    requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[9999] h-1 w-full bg-transparent pointer-events-none">
      <div
        className="h-full bg-cyan-500 dark:bg-cyan-400 transition-[width]"
        style={{ width: `${progress}%`, transition: "width 120ms linear" }}
        aria-hidden
      />
    </div>
  );
}

