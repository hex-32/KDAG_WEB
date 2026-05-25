import { Link } from "react-router-dom";

export default function AtlasView({ posts, onDomain }) {
  const width = 980;
  const height = 560;
  const center = { x: width / 2, y: height / 2 };
  const nodes = posts.map((post, index) => {
    const angle = (index / Math.max(posts.length, 1)) * Math.PI * 2 - Math.PI / 2;
    const radius = 190 + (index % 3) * 38;
    return {
      post,
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    };
  });

  const domains = [...new Set(posts.map((post) => post.domain))].slice(0, 6);

  return (
    <div className="glass overflow-hidden rounded-lg p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {domains.map((domain) => (
          <button
            key={domain}
            className="focus-ring rounded-md border border-line/30 bg-panel/45 px-3 py-1.5 text-xs font-bold text-muted transition hover:border-glow/45 hover:text-ink"
            onClick={() => onDomain(domain)}
            type="button"
          >
            {domain}
          </button>
        ))}
      </div>
      <div className="overflow-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-h-[420px] w-full min-w-[760px]" role="img">
          <defs>
            <linearGradient id="atlas-line" x1="0" x2="1">
              <stop offset="0%" stopColor="rgb(var(--glow))" stopOpacity="0.45" />
              <stop offset="100%" stopColor="rgb(var(--coral))" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {nodes.map((node) => (
            <line
              key={`${node.post.id}-line`}
              x1={center.x}
              y1={center.y}
              x2={node.x}
              y2={node.y}
              stroke="url(#atlas-line)"
              strokeWidth="1.2"
            />
          ))}
          <circle cx={center.x} cy={center.y} r="72" fill="rgb(var(--glow) / 0.16)" stroke="rgb(var(--glow) / 0.55)" />
          <text x={center.x} y={center.y - 6} textAnchor="middle" fill="rgb(var(--ink))" fontSize="22" fontWeight="800">
            KDAG
          </text>
          <text x={center.x} y={center.y + 18} textAnchor="middle" fill="rgb(var(--muted))" fontSize="13" fontWeight="700">
            Atlas
          </text>
          {nodes.map((node) => (
            <g key={node.post.id}>
              <circle cx={node.x} cy={node.y} r="54" fill="rgb(var(--panel) / 0.72)" stroke="rgb(var(--line) / 0.5)" />
              <foreignObject x={node.x - 48} y={node.y - 38} width="96" height="80">
                <Link
                  to={`/posts/${node.post.id}`}
                  className="flex h-full w-full flex-col items-center justify-center rounded-md px-2 text-center text-[10px] font-bold leading-tight text-ink"
                >
                  <span className="line-clamp-3">{node.post.title}</span>
                  <span className="mt-1 rounded bg-citron/20 px-1.5 py-0.5 text-[9px] text-ink">
                    {node.post.tags[0]}
                  </span>
                </Link>
              </foreignObject>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
