function parseCodeFence(line) {
  const match = line.trim().match(/^```(\w+)?/);
  return match ? (match[1] || "") : null;
}

function renderInlineText(text, keyPrefix) {
  const codeParts = text.split(/(`[^`]+`)/g).filter(Boolean);

  return codeParts.map((part, codeIndex) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-code-${codeIndex}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-900"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkParts = part.split(/(\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
    return (
      <span key={`${keyPrefix}-text-${codeIndex}`}>
        {linkParts.map((segment, linkIndex) => {
          const match = segment.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (!match) return <span key={`${keyPrefix}-plain-${codeIndex}-${linkIndex}`}>{segment}</span>;

          const label = match[1];
          const href = match[2];
          return (
            <a
              key={`${keyPrefix}-link-${codeIndex}-${linkIndex}`}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
            >
              {label}
            </a>
          );
        })}
      </span>
    );
  });
}

export function renderMarkdownToElements(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];

  let inCodeBlock = false;
  let codeLang = "";
  let codeLines = [];
  let listType = null;
  let listItems = [];
  let paragraphLines = [];

  function flushParagraph(key) {
    if (!paragraphLines.length) return;
    blocks.push(
      <p key={`p-${key}`} className="text-[15px] leading-8 text-slate-700">
        {renderInlineText(paragraphLines.join(" "), `p-${key}`)}
      </p>
    );
    paragraphLines = [];
  }

  function flushList(key) {
    if (!listItems.length || !listType) return;

    if (listType === "ul") {
      blocks.push(
        <ul key={`ul-${key}`} className="ml-6 list-disc space-y-2 text-slate-700">
          {listItems.map((item, idx) => (
            <li key={`ul-item-${key}-${idx}`} className="text-[15px] leading-7">
              {renderInlineText(item, `ul-${key}-${idx}`)}
            </li>
          ))}
        </ul>
      );
    } else {
      blocks.push(
        <ol key={`ol-${key}`} className="ml-6 list-decimal space-y-2 text-slate-700">
          {listItems.map((item, idx) => (
            <li key={`ol-item-${key}-${idx}`} className="text-[15px] leading-7">
              {renderInlineText(item, `ol-${key}-${idx}`)}
            </li>
          ))}
        </ol>
      );
    }

    listType = null;
    listItems = [];
  }

  function flushCodeBlock(key) {
    if (!codeLines.length) return;
    blocks.push(
      <div key={`code-wrap-${key}`} className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
        {codeLang ? (
          <div className="border-b border-slate-800 px-3 py-2 text-xs font-medium uppercase tracking-wide text-slate-300">
            {codeLang}
          </div>
        ) : null}
        <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100">
          <code>{codeLines.join("\n")}</code>
        </pre>
      </div>
    );
    codeLines = [];
    codeLang = "";
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    const fenceLang = parseCodeFence(line);

    if (fenceLang !== null) {
      flushParagraph(i);
      flushList(i);

      if (inCodeBlock) {
        flushCodeBlock(i);
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = fenceLang;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (!trimmed) {
      flushParagraph(i);
      flushList(i);
      continue;
    }

    if (trimmed === "---") {
      flushParagraph(i);
      flushList(i);
      blocks.push(<hr key={`hr-${i}`} className="my-4 border-slate-200" />);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (orderedMatch) {
      flushParagraph(i);
      if (listType && listType !== "ol") flushList(i);
      listType = "ol";
      listItems.push(orderedMatch[1]);
      continue;
    }

    const unorderedMatch = trimmed.match(/^-\s+(.+)/);
    if (unorderedMatch) {
      flushParagraph(i);
      if (listType && listType !== "ul") flushList(i);
      listType = "ul";
      listItems.push(unorderedMatch[1]);
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph(i);
      flushList(i);
      blocks.push(
        <blockquote key={`quote-${i}`} className="border-l-4 border-slate-300 bg-slate-50 px-4 py-3 text-slate-700">
          {renderInlineText(trimmed.slice(2), `quote-${i}`)}
        </blockquote>
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph(i);
      flushList(i);
      blocks.push(
        <h3 key={`h3-${i}`} className="mt-8 text-xl font-medium text-slate-900">
          {renderInlineText(trimmed.slice(4), `h3-${i}`)}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph(i);
      flushList(i);
      blocks.push(
        <h2 key={`h2-${i}`} className="mt-10 border-b border-slate-200 pb-2 text-2xl font-medium text-slate-900">
          {renderInlineText(trimmed.slice(3), `h2-${i}`)}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph(i);
      flushList(i);
      blocks.push(
        <h1 key={`h1-${i}`} className="mt-2 text-3xl font-medium tracking-tight text-slate-900">
          {renderInlineText(trimmed.slice(2), `h1-${i}`)}
        </h1>
      );
      continue;
    }

    paragraphLines.push(trimmed);
  }

  flushParagraph("end");
  flushList("end");
  if (inCodeBlock) flushCodeBlock("end");

  return blocks;
}
