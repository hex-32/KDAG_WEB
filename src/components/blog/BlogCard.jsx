import { Bookmark, Calendar, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { readingTime } from "../../utils/readingTime";
import Badge from "../ui/Badge";

export default function BlogCard({ post, bookmarked = false, onBookmark, theme }) {
  return (
    <article className={`group surface overflow-hidden rounded-lg transition duration-300 hover:-translate-y-1 hover:border-glow/45 hover:shadow-float
      border ${theme === "dark" ? "border-white/20" : "border-dark/20"}`}>
      <Link to={`/posts/${post.id}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-ink/10">
          <img
            src={post.cover}
            alt=""
            className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <Badge className="pointer-events-none">{post.domain}</Badge>
          <button
            className={`focus-ring grid size-9 shrink-0 place-items-center rounded-md border transition ${
              bookmarked ? "border-citron/70 bg-citron/18 text-ink" : "border-line/25 bg-panel/40 text-muted"
            }`}
            onClick={() => onBookmark(post.id)}
            aria-label="Toggle bookmark"
            type="button"
          >
            <Bookmark className="size-4" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>

        <Link to={`/posts/${post.id}`} className="focus-ring rounded-md">
          <h2 className="line-clamp-2 font-display text-2xl font-bold leading-tight">{post.title}</h2>
        </Link>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{post.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-md bg-ink/10 px-2.5 py-1 text-xs font-semibold text-muted dark:bg-white/10">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-3.5" />
            {post.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            {formatDate(post.date)}
          </span>
          
        </div>
      </div>
    </article>
  );
}
