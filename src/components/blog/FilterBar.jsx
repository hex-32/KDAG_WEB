import { Grid2X2, Network, SlidersHorizontal, Search } from "lucide-react";
import Button from "../ui/Button";
import Input from "../ui/Input";

export default function FilterBar({ query, setQuery, resultCount, source, view, setView, onOpenFilters }) {
  return (
    <div className="glass rounded-lg p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or author within sorted results..."
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="glass" className="h-11 xl:hidden" onClick={onOpenFilters} aria-label="Open filters">
            <SlidersHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
        <span>{resultCount} results</span>
        <span className="text-line">/</span>
        <span>{source === "api" ? "API data" : "Local data"}</span>
      </div>
    </div>
  );
}

