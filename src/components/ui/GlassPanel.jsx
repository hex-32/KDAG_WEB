export default function GlassPanel({ children, className = "" }) {
  return <div className={`glass rounded-lg ${className}`}>{children}</div>;
}

