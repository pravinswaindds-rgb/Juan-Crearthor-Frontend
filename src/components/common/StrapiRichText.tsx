import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/strapi";

interface TextNode {
  type?: "text";
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface LinkNode {
  type: "link";
  url: string;
  children: TextNode[];
}

interface ListItemNode {
  type: "list-item";
  children: (TextNode | LinkNode)[];
}

interface BlockNode {
  type:
    | "paragraph"
    | "heading"
    | "list"
    | "list-item"
    | "quote"
    | "code"
    | "image"
    | "link";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  format?: "ordered" | "unordered";
  url?: string;
  image?: {
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  children?: (TextNode | LinkNode | ListItemNode)[];
}

export interface StrapiRichTextProps {
  content: any;
  className?: string;
}

function renderTextNode(child: TextNode | LinkNode, key: number | string) {
  if (child.type === "link") {
    return (
      <Link
        key={key}
        href={child.url}
        target={child.url.startsWith("http") ? "_blank" : undefined}
        rel={child.url.startsWith("http") ? "noopener noreferrer" : undefined}
        className="text-[#a2f4fd] underline hover:text-white transition-colors"
      >
        {child.children?.map((c, i) => renderTextNode(c, i))}
      </Link>
    );
  }

  let text: React.ReactNode = child.text ?? "";

  if (child.bold) {
    text = (
      <strong key={`b-${key}`} className="text-white font-semibold">
        {text}
      </strong>
    );
  }
  if (child.italic) {
    text = (
      <em key={`i-${key}`} className="italic text-white/90">
        {text}
      </em>
    );
  }
  if (child.underline) {
    text = (
      <u key={`u-${key}`} className="underline">
        {text}
      </u>
    );
  }
  if (child.strikethrough) {
    text = (
      <s key={`s-${key}`} className="line-through opacity-75">
        {text}
      </s>
    );
  }
  if (child.code) {
    text = (
      <code
        key={`c-${key}`}
        className="px-1.5 py-0.5 rounded bg-white/10 text-[#a2f4fd] font-mono text-[0.9em]"
      >
        {text}
      </code>
    );
  }

  return <React.Fragment key={key}>{text}</React.Fragment>;
}

function renderBlock(block: BlockNode, index: number) {
  if (!block) return null;

  switch (block.type) {
    case "paragraph": {
      // If the paragraph is empty or just whitespace
      const isEmpty =
        !block.children ||
        block.children.length === 0 ||
        block.children.every((c: any) => !c.text || c.text.trim() === "");

      if (isEmpty) {
        return <div key={index} className="h-4" />;
      }

      return (
        <p
          key={index}
          className="mb-4 text-[#cefafe]/90 leading-[28px] text-[16px] md:text-[18px]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {block.children?.map((child, i) => renderTextNode(child as TextNode, i))}
        </p>
      );
    }

    case "heading": {
      const level = block.level || 2;
      const Tag = `h${level}` as const;

      let headingClasses =
        "text-white font-bold uppercase tracking-wide mt-8 mb-4";
      let headingStyle: React.CSSProperties = {
        fontFamily: "var(--font-anton)",
      };

      if (level === 1) {
        headingClasses += " text-[32px] md:text-[40px] leading-[44px]";
      } else if (level === 2) {
        headingClasses += " text-[26px] md:text-[32px] leading-[36px]";
      } else if (level === 3) {
        headingClasses += " text-[22px] md:text-[26px] leading-[30px]";
      } else {
        headingClasses += " text-[18px] md:text-[22px] leading-[26px]";
        headingStyle = { fontFamily: "var(--font-dm-sans)", fontWeight: 700 };
      }

      return (
        <Tag key={index} className={headingClasses} style={headingStyle}>
          {block.children?.map((child, i) =>
            renderTextNode(child as TextNode, i)
          )}
        </Tag>
      );
    }

    case "list": {
      const isOrdered = block.format === "ordered";
      const ListTag = isOrdered ? "ol" : "ul";

      return (
        <ListTag
          key={index}
          className={`flex flex-col gap-3 my-4 ${
            isOrdered ? "list-decimal pl-6" : "pl-1"
          }`}
        >
          {block.children?.map((item: any, i) => (
            <li
              key={i}
              className={`flex items-start gap-3 text-[#cefafe]/90 leading-[26px] text-[16px] md:text-[17px]`}
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {!isOrdered && (
                <span className="w-[6px] h-[6px] rounded-full bg-[#a2f4fd] mt-[10px] shrink-0" />
              )}
              <div className="flex-1">
                {item.children?.map((child: any, j: number) =>
                  renderTextNode(child, j)
                )}
              </div>
            </li>
          ))}
        </ListTag>
      );
    }

    case "quote": {
      return (
        <blockquote
          key={index}
          className="border-l-4 border-[#a2f4fd] pl-5 py-2 my-6 italic text-white/90 bg-white/[0.02] rounded-r-lg"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {block.children?.map((child, i) =>
            renderTextNode(child as TextNode, i)
          )}
        </blockquote>
      );
    }

    case "code": {
      return (
        <pre
          key={index}
          className="p-4 my-6 rounded-xl bg-black/60 border border-white/10 overflow-x-auto text-[#a2f4fd] font-mono text-[14px]"
        >
          <code>
            {block.children?.map((child: any) => child.text || "").join("")}
          </code>
        </pre>
      );
    }

    case "image": {
      const imageUrl = block.image ? getStrapiMedia(block.image.url) : null;
      if (!imageUrl) return null;
      return (
        <div
          key={index}
          className="relative w-full my-8 rounded-2xl overflow-hidden border border-white/10"
        >
          <Image
            src={imageUrl}
            alt={block.image?.alternativeText || "Article image"}
            width={block.image?.width || 1200}
            height={block.image?.height || 675}
            className="w-full h-auto object-cover"
          />
        </div>
      );
    }

    default:
      return null;
  }
}

/**
 * Parses markdown-like text lines (e.g. headers, bold, bullets) if string format is returned
 */
function renderStringContent(text: string) {
  // If text looks like HTML
  if (/<[a-z][\s\S]*>/i.test(text)) {
    return (
      <div
        className="strapi-html-content text-[#cefafe]/90 leading-[28px] text-[16px] md:text-[18px] space-y-4"
        style={{ fontFamily: "var(--font-dm-sans)" }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  }

  // Split into paragraphs by double newlines or single newlines
  const paragraphs = text.split(/\n\n+/);

  return (
    <div
      className="space-y-4 text-[#cefafe]/90 leading-[28px] text-[16px] md:text-[18px]"
      style={{ fontFamily: "var(--font-dm-sans)" }}
    >
      {paragraphs.map((para, i) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Check if paragraph starts with heading markdown (#, ##, ###)
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const headingText = headingMatch[2];
          return (
            <h3
              key={i}
              className="text-white font-bold uppercase tracking-wide mt-6 mb-3 text-[22px] md:text-[26px]"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              {headingText}
            </h3>
          );
        }

        // Check if it's a list of lines with bullet prefixes (- or *)
        const lines = trimmed.split("\n");
        const isBulletList = lines.every((l) => /^\s*[-*•]\s+/.test(l));

        if (isBulletList) {
          return (
            <ul key={i} className="flex flex-col gap-3 my-3 pl-1">
              {lines.map((line, j) => {
                const itemContent = line.replace(/^\s*[-*•]\s+/, "");
                return (
                  <li key={j} className="flex items-start gap-3">
                    <span className="w-[6px] h-[6px] rounded-full bg-[#a2f4fd] mt-[10px] shrink-0" />
                    <div className="flex-1">{renderFormattedInline(itemContent)}</div>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Render normal paragraph with preserved inline line breaks
        return (
          <p key={i} className="whitespace-pre-line leading-[28px]">
            {renderFormattedInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Handles inline formatting like **bold**, *italic*, and `code`
 */
function renderFormattedInline(str: string): React.ReactNode {
  // Simple regex parser for **bold** and *italic*
  const parts = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="italic text-white/90">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded bg-white/10 text-[#a2f4fd] font-mono text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function StrapiRichText({ content, className = "" }: StrapiRichTextProps) {
  if (!content) return null;

  // If content is an array of Strapi Blocks
  if (Array.isArray(content)) {
    return (
      <div className={`strapi-rich-text ${className}`}>
        {content.map((block, i) => renderBlock(block, i))}
      </div>
    );
  }

  // If content is an object with Description / Content
  if (typeof content === "object") {
    const raw =
      content.Description ||
      content.Content ||
      content.text ||
      content.description ||
      content.content;
    if (raw) {
      return <StrapiRichText content={raw} className={className} />;
    }
    return null;
  }

  // If content is a string
  if (typeof content === "string") {
    return (
      <div className={`strapi-rich-text ${className}`}>
        {renderStringContent(content)}
      </div>
    );
  }

  return null;
}
