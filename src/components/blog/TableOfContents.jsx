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

export default function TableOfContents({ content }) {
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
        // consider a heading active when it's near the top (account for fixed header)
        if (rect.top <= 120) {
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
      <div className="space-y-2">
        {headings.map((heading) => {
          const id = slugify(heading);
          const isActive = id === active;
          return (
            <a
              key={heading}
              href={`#${id}`}
              className={`block rounded-md px-2 py-1.5 text-sm transition ${
                isActive
                  ? "bg-glow/16 text-ink font-semibold"
                  : "text-muted hover:bg-ink/10 hover:text-ink dark:hover:bg-white/10"
              }`}
            >
              {heading}
            </a>
          );
        })}
      </div>
    </div>
  );
}
