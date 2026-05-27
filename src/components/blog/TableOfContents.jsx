import { useEffect, useState } from "react";

function extractHeadings(content = "") {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace(/^##\s+/, ""));
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function TableOfContents({ content, theme }) {
  const headings = extractHeadings(content);
  const [active, setActive] = useState(headings[0] ? slugify(headings[0]) : null);

  useEffect(() => {
    if (!headings.length) return;
    const ids = headings.map((h) => slugify(h));

    const onScroll = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
          current = id;
        }
      }
      setActive(current);
    };

    // run after layout
    requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="surface sticky top-20 rounded-lg p-4 border border-opacity-20">
      <h2 className="mb-3 text-md font-bold uppercase tracking-[0.18em] text-muted">Contents</h2>

      <div className="relative pl-6">
        {/* vertical line */}
        <div className="absolute left-3 top-10 bottom-4 w-px bg-ink/10" />

        <div className="space-y-2">
          {headings.map((heading) => {
            const id = slugify(heading);
            const isActive = id === active;
            return (
              <a
                key={heading}
                href={`#${id}`}
                className={`group flex items-center rounded-md px-2 py-1.5 text-sm transition ${
                  isActive
                    ? "bg-glow/16 text-ink font-semibold"
                    : "text-muted hover:bg-ink/10 hover:text-ink dark:hover:bg-white/10"
                }`}
              >
                <span
                  aria-hidden
                  className={`-ml-6 mr-2 h-3 w-3 flex-shrink-0 rounded-full border-2 transition-colors ${
                    isActive
                      ? theme === "dark"
                        ? "bg-white border-ink"
                        : "bg-black/50 border-ink"
                      : "bg-transparent border-ink/40 group-hover:bg-ink/10"
                  }`}
                />

                <span>{heading}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
