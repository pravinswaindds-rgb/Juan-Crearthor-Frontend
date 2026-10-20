interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "cyan" | "pink" | "green";
}

const variantStyles = {
  default: "text-white/70 border-white/10 bg-white/[0.04]",
  cyan: "text-[#A2F4FD] border-[#A2F4FD33] bg-[#F6CFFF15]",
  pink: "text-[#F6CFFF] border-[#F6CFFF33] bg-[#F6CFFF15]",
  green: "text-[#A4F4CF] border-[#A4F4CF33] bg-[#A4F4CF15]",
};

export default function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  const classes = `px-4 py-2 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`;

  return <span className={classes}>{children}</span>;
}
