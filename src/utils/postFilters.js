export function getDomains(posts) {
  return [...new Set(posts.map((post) => post.domain))].sort();
}

export function getTags(posts) {
  return [...new Set(posts.flatMap((post) => post.tags))].sort();
}

export function filterPosts(posts, { query, domains, tags }) {
  const normalizedQuery = query.trim().toLowerCase();
  return posts.filter((post) => {
    const matchesQuery =
      !normalizedQuery ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.author.toLowerCase().includes(normalizedQuery);
    const matchesDomain = domains.length === 0 || domains.includes(post.domain);
    const matchesTags = tags.length === 0 || tags.every((tag) => post.tags.includes(tag));
    return matchesQuery && matchesDomain && matchesTags;
  });
}

