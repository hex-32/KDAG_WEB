import { Link } from "react-router-dom";

export default function RelatedPosts({ current, posts, className }) {
  const related = posts
    .filter((post) => post.id !== current.id)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => current.tags.includes(tag)).length + (post.domain === current.domain ? 1 : 0),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.post);

  // fallback to recent posts if there are no related matches
  let list = related;
  if (list.length === 0) {
    list = posts.filter((p) => p.id !== current.id).slice(0, 3);
  }

  if (list.length === 0) return null;

  return (
    <section className={`mt-10 mb-10 ${className}`}>
      <h2 className="mb-4 font-display text-3xl font-bold">Related Reads</h2>
      <div className="grid gap-3 md:grid-cols-3">
        {list.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
            className="surface flex flex-col rounded-lg overflow-hidden transition hover:shadow-lg"
          >
            <img src={post.cover} alt="" className="h-32 w-full object-cover" />
            <div className="p-3">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{post.domain}</span>
              <h3 className="mt-2 font-semibold leading-snug text-lg">{post.title}</h3>
              <p className="mt-2 text-sm text-muted line-clamp-3">{post.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

