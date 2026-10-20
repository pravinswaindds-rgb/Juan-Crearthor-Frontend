interface IconContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: "cyan" | "pink" | "blue";
  className?: string;
}

const sizeStyles = {
  sm: "w-10 h-10 rounded-lg",
  md: "w-12 h-12 rounded-xl",
  lg: "w-20 h-20 rounded-full",
};

const colorStyles = {
  cyan: "bg-cyan/10",
  pink: "bg-pink/10",
  blue: "bg-blue/10",
};

export default function IconContainer({
  children,
  size = "md",
  color = "cyan",
  className = "",
}: IconContainerProps) {
  const classes = `${sizeStyles[size]} ${colorStyles[color]} flex items-center justify-center ${className}`;

  return <div className={classes}>{children}</div>;
}
