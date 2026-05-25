import { useMemo, useState } from "react";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState(() => {
    const stored = localStorage.getItem("kdag_bookmarks");
    return stored ? JSON.parse(stored) : [];
  });

  const bookmarkSet = useMemo(() => new Set(bookmarks), [bookmarks]);

  const toggleBookmark = (id) => {
    setBookmarks((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("kdag_bookmarks", JSON.stringify(next));
      return next;
    });
  };

  return { bookmarks, bookmarkSet, toggleBookmark };
}

