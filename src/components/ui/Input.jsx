export default function Input({ className = "", theme, ...props }) {
  return (
    <input
      className={` h-11 w-full border ${theme === 'dark' ? 'border-white/20' : 'border-black/20'} bg-transparent rounded-md px-4 text-sm text-ink placeholder:text-muted  transition  ${className}`}
      {...props}
    />
    
  );
}

