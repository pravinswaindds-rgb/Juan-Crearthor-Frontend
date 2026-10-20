import Image from "next/image";
import Link from "next/link";

export default function RelatedArticles({
  articles,
}: {
  articles: {
    slug: string;
    title: string;
    category: string;
    date: string;
    image: string;
  }[];
}) {
  return (
    <div
      className="p-6 rounded-3xl"
      style={{
        background: "rgba(255,255,255,0.0196)",
        border: "1px solid rgba(162,244,253,0.133)",
      }}
    >
      <h3
        className="mb-6 uppercase"
        style={{
          fontFamily: "var(--font-dm-sans)",
          fontSize: "12px",
          fontWeight: 600,
          lineHeight: "12px",
          letterSpacing: "4px",
          color: "#a2f4fd",
        }}
      >
        RELATED ARTICLES
      </h3>

      <div className="flex flex-col gap-6">
        {articles.map((article, idx) => (
          <Link
            key={article.slug || `related-${idx}`}
            href={`/blog/${article.slug}`}
            className="flex gap-4 group"
          >
            <div
              className="relative w-[76px] h-[76px] rounded-[16px] bg-white/5 shrink-0 overflow-hidden"
            >
              {article.image ? (
                <Image
                  src={article.image}
                  alt={article.title || "Article image"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="76px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan/10 to-magenta/10" />
              )}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span
                className="mb-1 uppercase"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  color: "rgba(162,244,253,0.8)",
                }}
              >
                {article.category}
              </span>
              <h4
                className="line-clamp-2 group-hover:text-[#a2f4fd] transition-colors"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#cefafe",
                  lineHeight: "20px",
                }}
              >
                {article.title}
              </h4>
              <span
                className="mt-1"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  fontSize: "10px",
                  color: "#5e6670",
                }}
              >
                {article.date}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
