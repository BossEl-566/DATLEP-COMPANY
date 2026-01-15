export default function ChartIcon({ className = "w-6 h-6" }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M7 16l3-3 3 3 5-5" />
      <path d="M14 8l-3 3-3-3" />
    </svg>
  );
}