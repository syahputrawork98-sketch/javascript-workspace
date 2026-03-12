import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@javascript-workspace/ui";
import { getBooksByRackSlug, getRackBySlug, libraryRacks } from "@/lib/library";
import { loadLibraryText } from "@/lib/learning-hub-content";
import { renderMarkdownToElements } from "@/lib/markdown-renderer";

export async function generateStaticParams() {
  return libraryRacks.map((rack) => ({ rackId: rack.slug }));
}

export async function generateMetadata({ params }) {
  const { rackId } = await params;
  const rack = getRackBySlug(rackId);

  if (!rack) return { title: "Rak Tidak Ditemukan | JavaScript Workspace" };

  return { title: `${rack.code} - ${rack.title} | JavaScript Workspace` };
}

export default async function RackDetailPage({ params }) {
  const { rackId } = await params;
  const rack = getRackBySlug(rackId);

  if (!rack) notFound();

  const books = getBooksByRackSlug(rack.slug);
  const rackMarkdown = await loadLibraryText(rack.readmePath, "# Rak belum tersedia");

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">{rack.code}</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-slate-900">{rack.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{rack.summary}</p>
        <div className="mt-5">
          <Button asChild variant="outline">
            <Link href="/racks">Kembali ke Daftar Rak</Link>
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <p className="mb-4 text-sm uppercase tracking-[0.16em] text-slate-500">Penjelasan Rak</p>
        <article className="reader-prose">{renderMarkdownToElements(rackMarkdown)}</article>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Buku di Dalam Rak</p>
          <h2 className="mt-1 text-2xl font-medium text-slate-900">{books.length} buku tersedia</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {books.map((book) => (
            <article key={book.id} className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                {book.rack.code} / {book.code}
              </p>
              <h3 className="mt-2 text-xl font-medium text-slate-900">{book.title}</h3>
              <p className="mt-2 text-sm text-slate-500">
                {book.version} - {book.releaseDate}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-700">{book.summary}</p>
              <p className="mt-4 text-sm text-slate-600">
                {book.sections.length} section / {book.items.length} item
              </p>
              <div className="mt-5">
                <Button asChild variant="outline">
                  <Link href={`/racks/${rack.slug}/books/${book.slug}`}>Buka Buku</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
