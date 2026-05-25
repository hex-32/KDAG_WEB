import { motion } from "framer-motion";
import BlogCard from "./BlogCard";

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

  return (
    <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {posts.map((post) => (
        <motion.div key={post.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <BlogCard post={post} bookmarked={bookmarkSet.has(post.id)} onBookmark={onBookmark} theme={theme} />
        </motion.div>
      ))}
    </motion.div>
  );
}

