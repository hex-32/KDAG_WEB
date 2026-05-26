import { useState, useEffect } from "react";
import AtlasView from "../components/atlas/AtlasView";
import BlogGrid from "../components/blog/BlogGrid";
import FeaturedPost from "../components/blog/FeaturedPost";
import FilterBar from "../components/blog/FilterBar";
import SearchCommand from "../components/blog/SearchCommand";
import MobileFilterDrawer from "../components/layout/MobileFilterDrawer";
import Sidebar from "../components/layout/Sidebar";
import { useBookmarks } from "../hooks/useBookmarks";
import { useFilters } from "../hooks/useFilters";
import { usePosts } from "../hooks/usePosts";
import Header from "../components/Header";
import { Loader } from 'lucide-react';

export default function Home() {
  const getInitial = () => {
      if (typeof window === 'undefined') return 'light'
      return (
        localStorage.getItem('theme') ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      )
    }
    
  const [theme, setTheme] = useState(getInitial)
  const { posts, status, source } = usePosts();
  const filters = useFilters(posts);
  const { bookmarkSet, toggleBookmark } = useBookmarks();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrollY, setScrollY] = useState(window.scrollY);
  const [show, setShow] = useState(true);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const featured = posts[posts.length - 1] || null;
  const handleShow = (val) => {
    setShow(val);
  }
  if (status === "loading") {
    return (
      <div className="grid min-h-[100vh] place-items-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header show={true} small={scrollY > 60} home={false} posts={posts} />
      
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)] pl-[30px] pr-[30px]">
        <Sidebar
          posts={posts}
          domains={filters.domains}
          tags={filters.tags}
          onDomain={filters.toggleDomain}
          onTag={filters.toggleTag}
          onClear={filters.clearFilters}
          onl = {handleShow}
        />

        <div className={`min-w-0 space-y-4 translate-y-20 transition-transform duration-300 ease ${!show && "-translate-x-[10%]"}`}>
          <FeaturedPost post={featured} theme={theme} />
          <div className="border rounded-lg">
          <FilterBar
            query={filters.query}
            setQuery={filters.setQuery}
            resultCount={filters.filteredPosts.length}
            source={source}
            view={filters.view}
            setView={filters.setView}
            onOpenFilters={() => setDrawerOpen(true)}
          />
          </div>


          <BlogGrid posts={filters.filteredPosts} bookmarkSet={bookmarkSet} onBookmark={toggleBookmark} 
          theme={theme}/>

        </div>
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        posts={posts}
        domains={filters.domains}
        tags={filters.tags}
        onDomain={filters.toggleDomain}
        onTag={filters.toggleTag}
        onClear={filters.clearFilters}
        theme ={theme}
      />
      <div className="h-24 " />
    </>
  );
}
