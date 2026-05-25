import { useEffect, useState } from "react";
import { postsApi } from "../api/postsApi";

export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [source, setSource] = useState("api");

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      setStatus("loading");
      try {
        const data = await postsApi.getPosts();
        if (!active) return;
        setPosts(Array.isArray(data) ? data : data.posts);
        setSource("api");
        setStatus("ready");
      } catch {
        const response = await fetch("/data.json");
        const data = await response.json();
        if (!active) return;
        setPosts(data);
        setSource("local");
        setStatus("ready");
      }
    }

    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  return { posts, status, source };
}

