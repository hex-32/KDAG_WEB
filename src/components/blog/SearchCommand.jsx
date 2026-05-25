import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

export default function SearchCommand({ posts, search = false, theme }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const close = () => {
    search = false;
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (search) {
      setOpen(true);
    }
  }, [search]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return posts.slice(0, 6);
    return posts
      .filter((post) =>
        [post.title, post.author, post.domain, ...post.tags].some((value) => value.toLowerCase().includes(needle)),
      )
      .slice(0, 8);
  }, [posts, query]);

  const goToPost = (id) => {
    setOpen(false);
    setQuery("");
    navigate(`/posts/${id}`);
  };

  return (
    <>
    
    <Modal open={open} title="Search" onClose={() => close()} theme={theme}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <Input autoFocus value={query} theme={theme} onChange={(event) => setQuery(event.target.value)} className="pl-10" />
      </div>
      <div className="mt-4 max-h-80 overflow-auto">
        {results.map((post) => (
          <button
            key={post.id}
            className="focus-ring flex w-full items-center justify-between gap-4 rounded-md px-3 py-3 text-left transition hover:bg-ink/10 dark:hover:bg-white/10"
            onClick={() => goToPost(post.id)}
            type="button"
          >
            <span>
              <span className="block font-semibold">{post.title}</span>
              <span className="text-sm text-muted">
                {post.author} / {post.domain}
              </span>
            </span>
            <span className="rounded-md bg-glow/12 px-2 py-1 text-xs font-semibold text-ink">{post.tags[0]}</span>
          </button>
        ))}
      </div>
    </Modal>
    <button onClick={() => setOpen(true)} className={`fixed bottom-6 right-6 w-14 h-14 rounded-full text-white shadow-lg hover:scale-105 z-50 transition
      bg-black`}>
        <Search size={28} className=" translate-y-0 translate-x-3.5" />
      </button>
    </>
  );
}
