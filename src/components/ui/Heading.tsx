interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  gradient?: boolean;
  className?: string;
}

export default function Heading({
  children,
  level = 2,
  gradient = false,
  className = "",
}: HeadingProps) {
  const baseClasses = "font-[family-name:var(--font-anton)] uppercase leading-[1.1]";

  const sizeClasses: Record<number, string> = {
    1: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
    2: "text-4xl sm:text-5xl md:text-6xl",
    3: "text-[22px] leading-[22px] tracking-normal",
    4: "text-base",
  };

  const gradientClass = gradient ? "gradient-text" : "text-white";
  const classes = `${baseClasses} ${sizeClasses[level]} ${gradientClass} ${className}`;

  if (level === 1) return <h1 className={classes}>{children}</h1>;
  if (level === 2) return <h2 className={classes}>{children}</h2>;
  if (level === 3) return <h3 className={classes}>{children}</h3>;
  return <h4 className={classes}>{children}</h4>;
}
