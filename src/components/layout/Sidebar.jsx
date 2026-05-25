import { ArrowRightCircle, RotateCcw } from "lucide-react";
import { getDomains, getTags } from "../../utils/postFilters";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import GlassPanel from "../ui/GlassPanel";
import { ArrowLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function Sidebar({ posts, domains, tags, onDomain, onTag, onClear, onl }) {
  const allDomains = getDomains(posts);
  const [show, setShow] = useState(true);
  const [manualOverride, setManualOverride] = useState(false);
  const allTags = getTags(posts);
  const oncl = () => {
    setShow(false);
    onl(false);
    setManualOverride(true);
  }
  const onclp = () => {
    setShow(true);
    onl(true);
    setManualOverride(true);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      if (manualOverride) return; // user used arrows — stop auto toggling
      const y = window.scrollY || 0;
      if (y > 200 && show) {
        setShow(false);
        onl(false);
      } else if (y <= 200 && !show) {
        setShow(true);
        onl(true);
      }
    };
    // check once on mount
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [show, onl, manualOverride]);

  return (
    <aside className="hidden xl:block">
      <GlassPanel className={`sticky top-20 p-4 translate-y-4 transition-transform duration-300 ${!show && "-translate-x-[100%]"}`}>
        <div className={`inline-flex items-center gap-2 rounded-md border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-ink`}>
        <div className={`translate-y-0 max-h-[80vh] overflow-y-auto no-scrollbar transition-transform duration-300 `}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <ArrowLeftIcon className="size-5 text-muted hover:cursor-pointer hover:scale-110" onClick={oncl} />
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-muted">Filters</h2>
          <Button variant="ghost" className="px-0" onClick={onClear} aria-label="Clear filters">
            <RotateCcw className="size-4" />
          </Button>
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Domains</h3>
            <div className="flex flex-wrap gap-2">
              {allDomains.map((domain) => (
                <Badge key={domain} active={domains.includes(domain)} onClick={() => onDomain(domain)}>
                  {domain}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge key={tag} active={tags.includes(tag)} onClick={() => onTag(tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        </div>
        {/* <ArrowRightCircle className={`size-5 text-muted absolute top-4 right-4 hover:cursor-pointer hover:scale-110 transition-transform duration-300 ${show ? "rotate-180" : ""}`} onClick={() => setShow(true)} /> */}
      </div>
      </GlassPanel>
      <ArrowRightCircle className="size-8 fixed -translate-y-[40vh] translate-x-3 hover:cursor-pointer" hidden={show} onClick={() => onclp()}/>
    </aside>
  );
}

