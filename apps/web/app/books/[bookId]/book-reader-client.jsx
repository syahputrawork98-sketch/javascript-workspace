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

export default function BookReaderClient({ book, selectedMaterialId, markdown }) {
  const selectedMaterial =
    book.materials.find((material) => material.id === selectedMaterialId) || book.materials[0];

  return (
    <div className="grid grid-cols-[240px_minmax(0,1fr)] gap-6">
      <section className="border border-slate-300 bg-white p-4">
        <p className="mb-3 text-center text-xl font-medium text-slate-700">bab</p>
        <nav className="flex flex-col gap-1.5">
          {book.materials.map((material, index) => {
            const active = material.id === selectedMaterial.id;
            return (
              <Link
                key={material.id}
                href={`/books/${book.id}?material=${material.id}`}
                className={[
                  "rounded px-2 py-2 text-sm transition-colors",
                  active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                <p>
                  {index + 1}. {material.title}
                </p>
                <p className={active ? "text-xs uppercase text-slate-300" : "text-xs uppercase text-slate-500"}>
                  {materialTypeLabel(material.type)}
                </p>
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="border border-slate-300 bg-white p-6">
        <p className="mb-2 text-center text-xl font-medium text-slate-900">penjelasan</p>
        <p className="mb-1 text-sm uppercase tracking-wide text-slate-500">{materialTypeLabel(selectedMaterial.type)}</p>
        <h2 className="mb-1 text-2xl font-medium text-slate-900">{selectedMaterial.title}</h2>
        <p className="mb-5 text-sm text-slate-500">Sumber: {selectedMaterial.sourcePath}</p>

        <article className="reader-prose">{renderMarkdownToElements(markdown)}</article>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/books">Kembali ke Daftar Buku</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
