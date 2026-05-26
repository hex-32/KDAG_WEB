import { useContext, useState, useEffect } from "react";
// import ProfileSidebar from "./ProfileSidebar";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ppo from "../assets/ppo.png";
import logo from "../assets/logo.png";
import ThemeToggle from "./ThemeToggle";
import ppob from "../assets/ppob.png";
import SearchCommand from "./blog/SearchCommand";
import { useBookmarks } from "../hooks/useBookmarks";
import { XIcon } from "lucide-react";
import { Plus } from "lucide-react";
import CreatePostModal from "./CreatePostModal";

function Header({ show = false, small = false, home = false, posts = [] }) {
    const [open, setOpen] = useState(false);
    const[search, setSearch] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const ss = () => {
        if (search === false) {
            setSearch(true);
        }
        else {            
            setSearch(false);
        }
    }
    const [fetchedUser, setFetchedUser] = useState(null);
    const isLoggedIn = !!localStorage.getItem("token");
    const getInitial = () => {
        if (typeof window === 'undefined') return 'light'
        return (
            localStorage.getItem('theme') ||
            (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        )
    }

    const [theme, setTheme] = useState(getInitial)

    const navigate = useNavigate();
    const { bookmarks, bookmarkSet, refreshBookmarks } = useBookmarks();
    useEffect(() => {
        // Close sidebar on route change
        const handleRouteChange = () => setOpen(false);
        window.addEventListener("popstate", handleRouteChange);
        return () => window.removeEventListener("popstate", handleRouteChange);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape" && open) setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const setTh = (val) => {
        val ? setTheme('dark') : setTheme('light');
    }

    useEffect(() => {
        if (typeof document === 'undefined') return;
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    useEffect(() => {
        if (!show) { setOpen(false); }
    }, [show]);

    return (
        <>
            <header
                className={` fixed top-0 left-1/2 -translate-x-1/2 z-50  ${show
                    ? small ? "translate-y-[6px] w-11/12" : "w-full" : "w-full translate-y-[-100%]"}
                    } flex justify-between items-center px-6 py-4 text-white transition-all duration-500 ease border-white/10 border-2 backdrop-blur-sm ${small ? "rounded-2xl" : ""} 
                    ${theme === 'dark' ? "bg-black/70" : "bg-white/70"} shadow-lg`}
            >

                {/* LEFT SECTION */}
                <div className="flex items-center gap-4">
                    <img src={logo} alt="PPO Logo" className="w-[60px] -mt-1" />
                    <div
                        className="flex flex-col leading-tight hover:cursor-pointer"
                        onClick={() => navigate("/")}
                    >

                        <img src={ppo} alt="PPO Logo" className="w-[200px]" hidden={theme === 'light'} />
                        <img src={ppob} alt="PPO Logo" className="w-[200px]" hidden={theme === 'dark'} />
                        {/* <span className={`text-[9px] tracking-[1px] ${theme === 'dark' ? "text-white/70": "text-black/70"}`}>
                            &nbsp;&nbsp;Your One-Stop AI/ML Research Hub
                        </span> */}
                    </div>
                </div>

                {/* CENTER NAVIGATION */}
                {(window.innerWidth < 768) ? "" : home ? (
                    <></>
                ) : (
                    <div className={`hidden h-10 min-w-0 max-w-xl ml-4 mr-4 flex-1 items-center gap-2 rounded-md border border-line/20 bg-panel/44 px-3 text-sm text-muted backdrop-blur-glass md:flex hover:scale-105 hover:cursor-pointer ${theme === 'dark' ? "text-white" : "text-black"} transition-all duration-300`}
                        onClick={ss}
                        >
                        <Search className=" size-4 shrink-0" />
                        <span className="truncate" >Double Click to Search</span>
                        <kbd className="ml-auto rounded border border-line/24 px-2 py-0.5 text-[11px] text-muted" >Ctrl K</kbd>
                    </div>
                )}

                {/* RIGHT SECTION */}
                <div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle
                            val={setTh}
                        />
                        {!home && (
                            <button onClick={() => setCreateOpen(true)} className={`flex items-center gap-2 px-3 py-2 rounded-full ${theme === 'dark' ? 'bg-white/10 text-white ' : 'bg-black/10 text-black'} transition hover:scale-[1.05] transition-all duration-300 ease`}>
                                <Plus />
                            </button>
                        )}
                        {!home && (
                            <button
                                onClick={() => { refreshBookmarks(); setOpen(true); }}
                                className={`flex items-center ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20 text-black/70'} gap-2 px-5 py-2 rounded-full backdrop-blur-md transition  hover:scale-[1.05] text-sm font-medium`}
                            >
                                Show Bookmarks
                            </button>
                        )}
                    </div>
                </div>
            </header>
                <SearchCommand posts={posts} search={search} theme={theme} home={home} />

                <CreatePostModal open={createOpen} onClose={() => setCreateOpen(false)} onSubmit={(payload) => { console.log('Created post payload', payload); }} theme={theme} posts={posts} />


                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={() => setOpen(false)} />
                        <div className={`relative w-full max-w-lg mx-4 rounded-lg p-6 shadow-lg backdrop-blur-md ${theme === 'dark' ? 'bg-black/80 text-white' : 'bg-white/95 text-black'} animate-slide-in`}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Bookmarked Posts</h3>
                                <button className="text-sm opacity-80 hover:scale-110" onClick={() => setOpen(false)}><XIcon /></button>
                            </div>
                            <div className="space-y-3 max-h-72 overflow-auto">
                                {posts && posts.filter((p) => bookmarkSet.has(p.id)).length === 0 ? (
                                    <div className="text-sm text-muted">No bookmarks yet.</div>
                                ) : (
                                    posts.filter((p) => bookmarkSet.has(p.id)).map((p) => (
                                        <div key={p.id} className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="font-medium">{p.title}</div>
                                                <div className="text-sm text-muted">{p.author}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => { navigate(`/posts/${p.id}`); setOpen(false); }} className={`text-sm font-medium -translate-x-2 ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'} hover:scale-110`}>Open</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
        </>
    );
}

export default Header;