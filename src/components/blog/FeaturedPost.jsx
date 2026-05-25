import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import Button from "../ui/Button";

export default function FeaturedPost({ post }) {
  if (!post) return null;

  return (
    <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] rounded-xl p-6 lg:p-10 hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <div className="glass rounded-lg p-5 sm:p-7 border border-white/20">
        <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-glow/35 bg-glow/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-ink">
          <Sparkles className="size-3.5" />
          Featured
        </div>
        <h1 className="max-w-3xl font-display text-4xl font-black leading-none sm:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">{post.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link to={`/posts/${post.id}`}>
            <Button variant="outline" className="flex items-center gap-2 hover:scale-105">
              Read post
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <span className="text-sm font-medium text-muted">
            {post.author} / {formatDate(post.date)}
          </span>
        </div>
      </div>
      <Link to={`/posts/${post.id}`} className="surface group block overflow-hidden rounded-lg">
        <img
          src={post.cover}
          alt=""
          className="h-full min-h-72 w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
      </Link>
    </section>
  );
}
