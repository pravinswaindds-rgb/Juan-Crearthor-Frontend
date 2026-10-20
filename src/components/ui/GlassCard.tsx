interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function GlassCard({
  children,
  className = "",
  hover = true,
  padding = "md",
}: GlassCardProps) {
  const hoverClass = hover
    ? "hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:border-cyan/30 hover:bg-white/[0.04]"
    : "";
  const classes = `glass-card rounded-2xl ${paddingStyles[padding]} transition-all ${hoverClass} ${className}`;

  return <div className={classes}>{children}</div>;
}
