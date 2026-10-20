import Link from "next/link";

interface BlogSidebarTagsProps {
  tags: string[];
  currentTags?: string[];
  title?: string;
}

export default function BlogSidebarTags({
  tags,
  currentTags = [],
  title = "New Tags:",
}: BlogSidebarTagsProps) {
  if (!tags || tags.length === 0) return null;

  const currentLowerSet = new Set(currentTags.map((t) => t.toLowerCase().trim()));

  return (
    <div
      className="p-6 rounded-3xl"
      style={{
        background: "rgba(255,255,255,0.0196)",
        border: "1px solid rgba(162,244,253,0.133)",
      }}
    >
      <h3
        className="mb-5 uppercase"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "12px",
          fontWeight: 600,
          lineHeight: "12px",
          letterSpacing: "4px",
          color: "#a2f4fd",
        }}
      >
        {title}
      </h3>

      <div className="flex flex-wrap gap-2.5">
        {tags.map((tag, idx) => {
          const isCurrent = currentLowerSet.has(tag.toLowerCase().trim());
          return (
            <Link
              key={`${tag}-${idx}`}
              href="/blog"
              title={`Browse articles tagged with ${tag}`}
              className={`inline-flex items-center rounded-full px-3.5 py-1.5 transition-all text-[12px] font-medium leading-none ${
                isCurrent
                  ? "bg-[#a2f4fd]/15 text-[#a2f4fd] border border-[#a2f4fd]/40 shadow-[0_0_12px_rgba(162,244,253,0.15)]"
                  : "bg-white/[0.03] text-zinc-300 border border-white/10 hover:border-[#a2f4fd]/40 hover:text-[#a2f4fd] hover:bg-white/[0.08] hover:scale-105 active:scale-95"
              }`}
              style={{
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {tag}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
