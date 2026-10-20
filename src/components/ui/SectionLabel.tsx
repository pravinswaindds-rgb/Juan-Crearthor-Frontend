interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  responsive?: boolean;
}

export default function SectionLabel({
  children,
  className = "",
  responsive = false,
}: SectionLabelProps) {
  const baseClasses = "font-semibold tracking-[0.3em] uppercase";
  const sizeClasses = responsive
    ? "text-xs sm:text-sm"
    : "text-xs";
  const colorClasses = "text-[#a2f4fd]";
  const classes = `${baseClasses} ${sizeClasses} ${colorClasses} ${className}`;

  return <p className={classes}>{children}</p>;
}
