import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

export default function BlogGrid({ posts, bookmarkSet, onBookmark, theme }) {
  if (posts.length === 0) {
    return (
      <div className="surface grid min-h-80 place-items-center rounded-lg p-8 text-center">
        <div>
          <p className="text-lg font-semibold">No matching posts</p>
          <p className="mt-2 text-sm text-muted">Try a different search or remove a filter.</p>
        </div>
      </div>
    );
  }

  const pageSize = 4;
  const items = [...posts].reverse();
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const [initial, setInitial] = useState(0);

  useEffect(() => {
    if (initial === 0) {
      setInitial(1);
      return;
    }
    const blogGrid = document.getElementById("blog-grid");
    if (blogGrid) {
      blogGrid.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  const start = page * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <>
      <motion.div layout id="blog-grid" className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {pageItems.map((post) => (
          <motion.div key={post.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <BlogCard post={post} bookmarked={bookmarkSet.has(post.id)} onBookmark={onBookmark} theme={theme} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          onClick={() => canPrev && setPage((p) => p - 1)}
          aria-label="Previous posts"
          className={`p-2 rounded-full transition ${canPrev ? 'hover:scale-105' : 'opacity-40 cursor-not-allowed'}`}
          disabled={!canPrev}
        >
          <ArrowLeftCircle size={36} />
        </button>

        <div className="text-sm text-muted">Page {page + 1} of {totalPages}</div>

        <button
          onClick={() => canNext && setPage((p) => p + 1)}
          aria-label="Next posts"
          className={`p-2 rounded-full transition ${canNext ? 'hover:scale-105' : 'opacity-40 cursor-not-allowed'}`}
          disabled={!canNext}
        >
          <ArrowRightCircle size={36} />
        </button>
      </div>
    </>
  );
}

