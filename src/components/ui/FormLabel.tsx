interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
}

export default function FormLabel({
  children,
  className = "",
  required = false,
  ...props
}: FormLabelProps) {
  const classes = `block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2 ${className}`;

  return (
    <label className={classes} {...props}>
      {children}
      {required && <span className="text-cyan ml-0.5">*</span>}
    </label>
  );
}
