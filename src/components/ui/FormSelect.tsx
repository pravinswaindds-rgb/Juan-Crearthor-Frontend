interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}

export default function FormSelect({
  label,
  options,
  placeholder,
  error,
  className = "",
  id,
  ...props
}: FormSelectProps) {
  const selectClasses = `w-full bg-[#0b0e14] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan/50 transition-colors ${className}`;

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
      <select id={id} className={selectClasses} style={{ backgroundColor: "#0b0e14", color: "#ffffff" }} {...props}>
        {placeholder && (
          <option value="" disabled style={{ backgroundColor: "#0b0e14", color: "rgba(255, 255, 255, 0.5)" }}>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{ backgroundColor: "#0b0e14", color: "#ffffff", padding: "8px" }}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
