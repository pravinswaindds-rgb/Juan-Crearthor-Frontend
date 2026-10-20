export default function BlogTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-3 mt-8">
      {tags.map((tag, idx) => (
        <span
          key={`${tag}-${idx}`}
          className="inline-flex items-center h-8 rounded-full px-4 transition-colors hover:bg-white/10"
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: "12px",
            fontWeight: 500,
            color: "#a2f4fd",
            background: "rgba(255,255,255,0.039)",
            border: "1px solid rgba(255,255,255,0.102)",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
