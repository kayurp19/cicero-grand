interface LogoProps {
  className?: string;
  textClassName?: string;
}

export function Logo({ className = '', textClassName = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
        />
        <path
          d="M11 13 Q16 8 21 13 M11 19 Q16 24 21 19"
          stroke="currentColor"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <span className={`font-display text-[1.35rem] leading-none tracking-tight ${textClassName}`}>
        Cicero Grand
      </span>
    </div>
  );
}
