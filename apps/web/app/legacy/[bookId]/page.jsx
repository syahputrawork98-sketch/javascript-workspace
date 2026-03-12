import { notFound } from "next/navigation";
import BookReaderClient from "@/components/book-reader-client";
import { archiveBooks, getArchiveBookById } from "@/lib/archive";
import { loadMaterialMarkdown } from "@/lib/learning-hub-content";

export async function generateStaticParams() {
  return archiveBooks.map((book) => ({ bookId: book.id }));
}

export async function generateMetadata({ params }) {
  const { bookId } = await params;
  const book = getArchiveBookById(bookId);

  if (!book) return { title: "Arsip Tidak Ditemukan | JavaScript Focuspace" };

  return { title: `v1 / ${book.code} - ${book.title} | JavaScript Focuspace` };
}

export default async function LegacyBookDetailPage({ params, searchParams }) {
  const { bookId } = await params;
  const query = await searchParams;
  const book = getArchiveBookById(bookId);

  if (!book) notFound();

  const selectedMaterialId = query.material || book.materials[0]?.id;
  const selectedMaterial =
    book.materials.find((material) => material.id === selectedMaterialId) || book.materials[0];
  const markdown = await loadMaterialMarkdown(selectedMaterial.sourcePath);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-[1.9rem] border border-[#d8ddd2] bg-[linear-gradient(135deg,#f4f2e8_0%,#efefec_100%)] p-7 shadow-[0_14px_38px_rgba(15,23,42,0.05)]">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">v1 archive</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {book.code} - {book.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-700">{book.summary}</p>
      </section>

      <BookReaderClient
        backHref="/legacy"
        backLabel="Kembali ke Arsip v1"
        book={book}
        selectedMaterialId={selectedMaterial.id}
        markdown={markdown}
      />
    </main>
  );
}
