interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function FormTextarea({
  label,
  error,
  className = "",
  id,
  ...props
}: FormTextareaProps) {
  const textareaClasses = `w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan/50 transition-colors resize-none ${className}`;

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2"
        >
          {label}
        </label>
      )}
      <textarea id={id} className={textareaClasses} {...props} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
