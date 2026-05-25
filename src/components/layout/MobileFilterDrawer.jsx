import { SlidersHorizontal, X } from "lucide-react";
import { getDomains, getTags } from "../../utils/postFilters";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function MobileFilterDrawer({ open, onClose, posts, domains, tags, onDomain, onTag, onClear, theme }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <button
        className="absolute inset-0 bg-black/45 dark:bg-black/50 backdrop-blur-sm"
        type="button"
        aria-label="Close filters"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 max-h-[82vh] overflow-auto rounded-t-lg p-5 bg-white/60 dark:bg-black/60 backdrop-blur-md border-t border-white/10">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            <h2 className="text-base font-bold">Filters</h2>
          </div>
          <button  className="size-9 px-0 hover:scale-105" onClick={onClose} >
            <X className="size-7" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <h3 className="mb-2 text-sm font-semibold">Domains</h3>
            <div className="flex flex-wrap gap-2">
              {getDomains(posts).map((domain) => (
                <Badge key={domain} active={domains.includes(domain)} onClick={() => onDomain(domain)}>
                  {domain}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {getTags(posts).map((tag) => (
                <Badge key={tag} active={tags.includes(tag)} onClick={() => onTag(tag)}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="primary" className="w-full" onClick={onClear}>
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}

