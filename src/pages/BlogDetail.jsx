import { ArrowLeft, Bookmark, Calendar, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import ReadingProgress from "../components/blog/ReadingProgress";
import RelatedPosts from "../components/blog/RelatedPosts";
import TableOfContents from "../components/blog/TableOfContents";
import Button from "../components/ui/Button";
import { useBookmarks } from "../hooks/useBookmarks";
import { usePost } from "../hooks/usePost";
import { formatDate } from "../utils/formatDate";
import { readingTime } from "../utils/readingTime";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import {Loader} from 'lucide-react';

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function BlogDetail() {
  const [scrollY, setScrollY] = useState(window.scrollY);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const { id } = useParams();
  const { posts, status } = usePost({ id });
  const { bookmarkSet, toggleBookmark } = useBookmarks();
  const post = posts.find((item) => item.id === id);
  const getInitial = () => {
    if (typeof window === 'undefined') return 'light'
    return (
      localStorage.getItem('theme') ||
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    )
  }
    
  const [theme, setTheme] = useState(getInitial)

  if (status === "loading") {
    return (
      <div className="grid min-h-[100vh] place-items-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="surface rounded-lg p-8">
        <p className="text-lg font-semibold">Post not found</p>
        <Link to="/" className="mt-4 inline-flex">
          <Button>Back to explorer</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header show={true} small={scrollY > 100} home={true} read={true} />
      <ReadingProgress />
      <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] px-4 lg:px-8">
        <div className="min-w-0 mt-24 mb-20 mx-auto w-full max-w-4xl">
          <div className="surface overflow-hidden rounded-lg">
            <img src={post.cover} alt="" className="max-h-[440px] w-full object-cover" />
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-glow/16 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
                  {post.domain}
                </span>
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-md px-2.5 py-1 text-xs font-semibold text-muted bg-transparent dark:bg-white/6">
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="max-w-4xl font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-5xl">
                {post.title}
              </h1>

              <div className="mt-4 mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="size-4" />
                  {post.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  {formatDate(post.date)}
                </span>
                <span>{readingTime(post.content)} min read</span>
                <button
                  className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-line/25 px-3 py-1.5 transition hover:border-citron/50"
                  onClick={() => toggleBookmark(post.id)}
                  type="button"
                >
                  <Bookmark className="size-6" fill={bookmarkSet.has(post.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="article-body mt-6">
                <ReactMarkdown
                  components={{
                    h2: ({ children }) => (
                      <h2 id={slugify(String(children))} className="mt-8 scroll-mt-28 text-2xl md:text-3xl font-bold leading-tight">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 id={slugify(String(children))} className="mt-6 text-xl font-semibold">
                        {children}
                      </h3>
                    ),
                    p: ({ children }) => <p className="text-base md:text-lg leading-7 text-gray-800 dark:text-gray-200">{children}</p>,
                    li: ({ children }) => <li className="ml-6 list-disc text-base md:text-lg text-gray-800 dark:text-gray-200">{children}</li>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 pl-4 italic text-lg text-muted">{children}</blockquote>,
                    img: ({ node, ...props }) => <img className="my-6 rounded-md" {...props} />,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          
        </div>

        <aside className="hidden lg:block">
          <div className="translate-y-[10vh] sticky top-20 mb-40 p-4">
          <TableOfContents content={post.content} theme={theme} />
          </div>
        </aside>
      </article>
      <RelatedPosts current={post} posts={posts} className="mr-20 ml-20" />
    </>
  );
}
