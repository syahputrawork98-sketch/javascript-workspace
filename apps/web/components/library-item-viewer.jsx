"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Button } from "@javascript-workspace/ui";
import { renderMarkdownToElements } from "@/lib/markdown-renderer";

function isRenderableImage(extension) {
  return [".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp"].includes((extension || "").toLowerCase());
}

export default function LibraryItemViewer({
  item,
  section,
  backHref,
  backLabel,
  markdown,
  readme,
  files,
  assetUrl,
}) {
  const isMarkdownItem = item.kind === "markdown";
  const isExampleItem = item.kind === "example";
  const isAssetItem = item.kind === "asset";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">{section.title}</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-slate-900">
          {item.code} - {item.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{item.summary}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500">{item.sourcePath}</p>
      </section>

      {isMarkdownItem ? (
        <section className="rounded-2xl border border-slate-300 bg-white p-6">
          <article className="reader-prose">{renderMarkdownToElements(markdown)}</article>
        </section>
      ) : null}

      {isExampleItem ? (
        <>
          <section className="rounded-2xl border border-slate-300 bg-white p-6">
            <p className="mb-4 text-sm uppercase tracking-[0.16em] text-slate-500">Penjelasan Example</p>
            <article className="reader-prose">{renderMarkdownToElements(readme)}</article>
          </section>

          {files.length ? (
            <section className="grid gap-4">
              {files.map((file) => (
                <article key={file.sourcePath} className="overflow-hidden rounded-2xl border border-slate-300 bg-white">
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{file.name}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{file.language}</p>
                    </div>
                    <a
                      href={file.rawUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm text-teal-700 underline underline-offset-2"
                    >
                      Buka file
                    </a>
                  </div>
                  <pre className="overflow-x-auto bg-slate-950 p-4 text-sm leading-6 text-slate-100">
                    <code>{file.content}</code>
                  </pre>
                </article>
              ))}
            </section>
          ) : null}
        </>
      ) : null}

      {isAssetItem ? (
        <section className="rounded-2xl border border-slate-300 bg-white p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Preview Asset</p>
              <p className="text-sm text-slate-700">Ekstensi: {item.assetExtension || "unknown"}</p>
            </div>
            <a
              href={assetUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-sm text-teal-700 underline underline-offset-2"
            >
              Buka asset asli
            </a>
          </div>

          {isRenderableImage(item.assetExtension) ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <img src={assetUrl} alt={item.title} className="mx-auto h-auto max-w-full" />
            </div>
          ) : (
            <p className="text-sm text-slate-700">
              Asset ini belum memiliki preview inline. Gunakan tautan di atas untuk membukanya langsung.
            </p>
          )}
        </section>
      ) : null}

      <div className="flex items-center gap-3">
        <Button asChild variant="outline">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      </div>
    </main>
  );
}
