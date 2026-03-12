"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { Button } from "@javascript-workspace/ui";
import { renderMarkdownToElements } from "@/lib/markdown-renderer";

function ExampleSection({ examples }) {
  const [activeExamplePath, setActiveExamplePath] = useState(examples[0]?.sourcePath || "");
  const activeExample = examples.find((example) => example.sourcePath === activeExamplePath) || examples[0];
  const [activeFilePath, setActiveFilePath] = useState(activeExample?.files[0]?.sourcePath || "");
  const activeFile = activeExample?.files.find((file) => file.sourcePath === activeFilePath) || activeExample?.files[0];

  function selectExample(sourcePath) {
    const nextExample = examples.find((example) => example.sourcePath === sourcePath) || examples[0];
    setActiveExamplePath(sourcePath);
    setActiveFilePath(nextExample?.files[0]?.sourcePath || "");
  }

  if (!examples.length) {
    return (
      <section id="examples" className="focuspace-surface">
        <p className="focuspace-section-label">Examples</p>
        <h2 className="focuspace-section-title">Contoh runnable</h2>
        <p className="mt-4 text-sm leading-7 text-slate-700">Example untuk chapter ini masih belum tersedia.</p>
      </section>
    );
  }

  return (
    <section id="examples" className="focuspace-surface">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="focuspace-section-label">Examples</p>
          <h2 className="focuspace-section-title">Contoh runnable yang terhubung dengan materi</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            Fokuskan pembacaan ke satu example set aktif agar alurnya tidak pecah. Ganti file hanya saat memang
            ingin melihat variasi perilaku.
          </p>
        </div>
        {activeExample?.readmeRawUrl ? (
          <a
            href={activeExample.readmeRawUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm text-teal-700 underline underline-offset-2"
          >
            Buka README asli
          </a>
        ) : null}
      </div>

      {examples.length > 1 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {examples.map((example, index) => {
            const active = example.sourcePath === activeExample?.sourcePath;
            return (
              <button
                key={example.sourcePath}
                type="button"
                onClick={() => selectExample(example.sourcePath)}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-teal-300 bg-teal-700 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                {`Example Set ${index + 1}`}
              </button>
            );
          })}
        </div>
      ) : null}

      {activeExample ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-[1.35rem] border border-[#e5e8df] bg-[#f8f6ee] px-5 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Example Aktif</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{activeExample.title}</h3>
              </div>
              <span className="rounded-full border border-[#d9dfd0] bg-white px-3 py-1 text-xs font-medium text-slate-700">
                {activeExample.files.length} file
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">{activeExample.summary}</p>
          </div>

          <div className="rounded-[1.35rem] border border-[#e5e8df] bg-white px-5 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Catatan Penggunaan</p>
            <div className="reader-prose mt-3">{renderMarkdownToElements(activeExample.readme)}</div>
          </div>

          <div className="rounded-[1.35rem] border border-[#e5e8df] bg-white p-4 md:p-5">
            <div className="flex flex-wrap gap-2">
              {activeExample.files.map((file, index) => {
                const active = file.sourcePath === activeFile?.sourcePath;
                return (
                  <button
                    key={file.sourcePath}
                    type="button"
                    onClick={() => setActiveFilePath(file.sourcePath)}
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100",
                    ].join(" ")}
                  >
                    {activeExample.files.length === 3 ? `Example ${index + 1}` : file.name}
                  </button>
                );
              })}
            </div>

            {activeFile ? (
              <article className="mt-5 overflow-hidden rounded-[1.25rem] border border-slate-300 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activeFile.name}</p>
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{activeFile.language}</p>
                  </div>
                  <a
                    href={activeFile.rawUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-teal-700 underline underline-offset-2"
                  >
                    Buka file asli
                  </a>
                </div>
                <pre className="overflow-x-auto bg-slate-950 p-4 text-sm leading-7 text-slate-100 md:p-5">
                  <code>{activeFile.content}</code>
                </pre>
              </article>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default function ChapterReaderShell({ book, bundle, markdown, visuals, examples }) {
  const { current, chapterEntries, previousEntry, nextEntry } = bundle;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-[2rem] border border-[#d8dece] bg-[linear-gradient(135deg,#f9f3e2_0%,#edf5f0_48%,#f8efe8_100%)] p-8 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
        <p className="text-xs uppercase tracking-[0.22em] text-teal-800">
          {book.rack.code} / {book.code} / {current.code}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{current.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-700">{current.summary}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={`/racks/${book.rack.slug}/books/${book.slug}`}>Kembali ke Buku</Link>
          </Button>
          {previousEntry ? (
            <Button asChild variant="ghost">
              <Link href={`/racks/${book.rack.slug}/books/${book.slug}/sections/${previousEntry.section}/${previousEntry.slug}`}>
                Chapter Sebelumnya
              </Link>
            </Button>
          ) : null}
          {nextEntry ? (
            <Button asChild variant="ghost">
              <Link href={`/racks/${book.rack.slug}/books/${book.slug}/sections/${nextEntry.section}/${nextEntry.slug}`}>
                Chapter Berikutnya
              </Link>
            </Button>
          ) : null}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-20 xl:self-start">
          <div className="space-y-5 rounded-[1.6rem] border border-[#dce2d4] bg-[#fffdf8] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)]">
            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Buku Ini</p>
              <nav className="mt-3 flex max-h-[300px] flex-col gap-2 overflow-y-auto pr-1">
                {chapterEntries.map((entry) => {
                  const active = entry.id === current.id;
                  return (
                    <Link
                      key={entry.id}
                      href={`/racks/${book.rack.slug}/books/${book.slug}/sections/${entry.section}/${entry.slug}`}
                      className={[
                        "rounded-xl border px-3 py-3 text-sm transition-colors",
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <div className="text-xs uppercase tracking-[0.16em] opacity-70">{entry.code}</div>
                      <div className="mt-1 font-medium">{entry.title}</div>
                    </Link>
                  );
                })}
              </nav>
            </section>

            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Di Chapter Ini</p>
              <div className="mt-3 flex flex-col gap-2 text-sm">
                <a href="#materi" className="rounded-xl bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">Materi</a>
                <a href="#gambar" className="rounded-xl bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">Gambar</a>
                <a href="#examples" className="rounded-xl bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">Examples</a>
              </div>
            </section>

            <section>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Status</p>
              <div className="mt-3 grid gap-2 text-sm text-slate-700">
                <div className="rounded-xl border border-[#e0e6d8] bg-white px-3 py-2">{visuals.length} visual</div>
                <div className="rounded-xl border border-[#e0e6d8] bg-white px-3 py-2">{examples.length} example set</div>
                <div className="rounded-xl border border-[#e0e6d8] bg-white px-3 py-2">Mode baca aktif</div>
              </div>
            </section>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="sticky top-16 z-10 rounded-[1.25rem] border border-[#dbe1d4] bg-[rgba(255,253,248,0.88)] p-3 shadow-[0_10px_26px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="flex flex-wrap gap-2">
              <a href="#materi" className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50">Materi</a>
              <a href="#gambar" className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50">Gambar</a>
              <a href="#examples" className="rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50">Examples</a>
            </div>
          </section>

          <section id="materi" className="focuspace-surface">
            <p className="focuspace-section-label">Materi</p>
            <h2 className="focuspace-section-title">Penjelasan utama chapter</h2>
            <div className="mt-6 rounded-[1.5rem] border border-[#e6eadf] bg-[#fffefb] px-5 py-6 md:px-8 md:py-8">
              <div className="reader-prose focuspace-prose mx-auto">{renderMarkdownToElements(markdown)}</div>
            </div>
          </section>

          <section id="gambar" className="focuspace-surface">
            <p className="focuspace-section-label">Gambar</p>
            <h2 className="focuspace-section-title">Visual pendukung chapter</h2>

            {visuals.length ? (
              <div className="mt-6 grid gap-5">
                {visuals.map((visual) => (
                  <figure key={visual.sourcePath} className="overflow-hidden rounded-[1.5rem] border border-[#e2e7da] bg-[#fcfbf6]">
                    <div className="border-b border-[#e2e7da] px-5 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{visual.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">Visual map chapter</p>
                        </div>
                        <a
                          href={visual.rawUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm text-teal-700 underline underline-offset-2"
                        >
                          Buka asset asli
                        </a>
                      </div>
                    </div>
                    <div className="p-5 md:p-6">
                      <img
                        src={visual.rawUrl}
                        alt={visual.title}
                        className="mx-auto h-auto max-w-full rounded-[1rem] border border-[#e2e7da] bg-white p-4"
                      />
                    </div>
                    <figcaption className="border-t border-[#e2e7da] bg-white px-5 py-4 text-sm leading-7 text-slate-700">
                      Diagram ini dipakai untuk membantu membaca hubungan konsep di chapter ini secara lebih visual.
                    </figcaption>
                  </figure>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-[1.35rem] border border-dashed border-[#dce2d4] bg-[#fffef9] px-5 py-6 text-sm leading-7 text-slate-700">
                Visual chapter ini masih dalam proses penyusunan.
              </div>
            )}
          </section>

          <ExampleSection examples={examples} />
        </div>
      </div>
    </main>
  );
}
