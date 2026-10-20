import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}

export default function NavLink({
  href,
  children,
  className = "",
  active = false,
  onClick,
}: NavLinkProps) {
  const baseClasses = "text-sm transition-colors";
  const activeClasses = active ? "text-cyan" : "text-white/70 hover:text-cyan";
  const classes = `${baseClasses} ${activeClasses} ${className}`;

  return (
    <Link href={href} className={classes} onClick={onClick}>
      {children}
    </Link>
  );
}
