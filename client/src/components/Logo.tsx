import markWhite from '/brand/cicero-grand-mark-white.png';
import markDark from '/brand/cicero-grand-mark-dark.png';

interface LogoProps {
  className?: string;
  textClassName?: string;
  /** "light" = white mark + light text (for dark hero/footer); "dark" = dark mark + dark text (for cream surfaces) */
  variant?: 'light' | 'dark';
  /** Show the wordmark next to the icon. Default true. */
  showWordmark?: boolean;
}

export function Logo({
  className = '',
  textClassName = '',
  variant = 'light',
  showWordmark = true,
}: LogoProps) {
  const mark = variant === 'light' ? markWhite : markDark;
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src={mark}
        width={290}
        height={369}
        alt={showWordmark ? '' : 'Cicero Grand - Syracuse North'}
        className="h-9 w-auto select-none"
        draggable={false}
      />
      {showWordmark && (
        <span
          className={`font-display text-[1.3rem] leading-none tracking-tight ${textClassName}`}
        >
          Cicero Grand<span className="block text-[0.75em] mt-0.5"> - Syracuse North</span>
        </span>
      )}
    </div>
  );
}
