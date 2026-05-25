import { useMemo, useState } from "react";
import { filterPosts } from "../utils/postFilters";
import { useDebounce } from "./useDebounce";

export function useFilters(posts) {
  const [query, setQuery] = useState("");
  const [domains, setDomains] = useState([]);
  const [tags, setTags] = useState([]);
  const [view, setView] = useState("feed");
  const debouncedQuery = useDebounce(query);

  const filteredPosts = useMemo(
    () => filterPosts(posts, { query: debouncedQuery, domains, tags }),
    [posts, debouncedQuery, domains, tags],
  );

  const toggleDomain = (domain) => {
    setDomains((current) =>
      current.includes(domain) ? current.filter((item) => item !== domain) : [...current, domain],
    );
  };

  const toggleTag = (tag) => {
    setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  const clearFilters = () => {
    setQuery("");
    setDomains([]);
    setTags([]);
  };

  return {
    query,
    setQuery,
    domains,
    tags,
    view,
    setView,
    filteredPosts,
    toggleDomain,
    toggleTag,
    clearFilters,
  };
}

