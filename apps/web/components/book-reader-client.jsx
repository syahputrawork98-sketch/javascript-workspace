"use client";

import Link from "next/link";
import { Button } from "@javascript-workspace/ui";
import { renderMarkdownToElements } from "@/lib/markdown-renderer";

function materialTypeLabel(type) {
  if (type === "chapter") return "Bab";
  if (type === "topic") return "Topik";
  if (type === "exercise") return "Latihan";
  return "Referensi";
}

export default function BookReaderClient({ backHref, backLabel, book, selectedMaterialId, markdown }) {
  const selectedMaterial =
    book.materials.find((material) => material.id === selectedMaterialId) || book.materials[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="xl:sticky xl:top-20 xl:self-start">
        <section className="rounded-[1.6rem] border border-[#d8ddd2] bg-[#fbfaf5] p-5 shadow-[0_10px_28px_rgba(15,23,42,0.04)]">
          <div className="border-b border-[#e3e7dc] pb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Arsip v1</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{book.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Struktur lama tetap dipertahankan sebagai arsip referensi dan evolusi pembelajaran.
            </p>
          </div>

          <nav className="mt-5 flex max-h-[420px] flex-col gap-2 overflow-y-auto pr-1">
            {book.materials.map((material, index) => {
              const active = material.id === selectedMaterial.id;
              return (
                <Link
                  key={material.id}
                  href={`${backHref}/${book.id}?material=${material.id}`}
                  className={[
                    "rounded-[1rem] border px-3 py-3 text-sm transition-colors",
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-[#e4e8de] bg-white text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="text-xs uppercase tracking-[0.16em] opacity-70">{material.code}</div>
                  <div className="mt-1 font-medium">{material.title}</div>
                  <div className={active ? "mt-2 text-xs uppercase text-slate-300" : "mt-2 text-xs uppercase text-slate-500"}>
                    {materialTypeLabel(material.type)} / urutan {material.order || index + 1}
                  </div>
                </Link>
              );
            })}
          </nav>
        </section>
      </aside>

      <section className="rounded-[1.8rem] border border-[#d8ddd2] bg-white p-6 shadow-[0_12px_32px_rgba(15,23,42,0.05)] md:p-8">
        <div className="border-b border-[#e6eadf] pb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Legacy Reader</p>
          <p className="mt-3 text-sm uppercase tracking-[0.14em] text-slate-500">{materialTypeLabel(selectedMaterial.type)}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{selectedMaterial.title}</h1>
          <p className="mt-2 text-sm text-slate-500">{selectedMaterial.code}</p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700">{selectedMaterial.summary}</p>
        </div>

        <div className="mt-6 rounded-[1.4rem] border border-[#e7ebe2] bg-[#fffefb] px-5 py-6 md:px-8 md:py-8">
          <article className="reader-prose focuspace-prose mx-auto">{renderMarkdownToElements(markdown)}</article>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={backHref}>{backLabel}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
