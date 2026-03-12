import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@javascript-workspace/ui";
import { getBookBySlugs, libraryBooks } from "@/lib/library";
import { loadLibraryText } from "@/lib/learning-hub-content";
import { renderMarkdownToElements } from "@/lib/markdown-renderer";

export async function generateStaticParams() {
  return libraryBooks.map((book) => ({ rackId: book.rack.slug, bookId: book.slug }));
}

export async function generateMetadata({ params }) {
  const { rackId, bookId } = await params;
  const book = getBookBySlugs(rackId, bookId);

  if (!book) return { title: "Buku Tidak Ditemukan | JavaScript Workspace" };

  return { title: `${book.rack.code} / ${book.code} - ${book.title} | JavaScript Workspace` };
}

export default async function BookDetailPage({ params }) {
  const { rackId, bookId } = await params;
  const book = getBookBySlugs(rackId, bookId);

  if (!book) notFound();

  const readmeMarkdown = await loadLibraryText(book.readmePath, "# Buku belum tersedia");
  const changelogMarkdown = book.changelogPath
    ? await loadLibraryText(book.changelogPath, "# Changelog belum tersedia")
    : "";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
          {book.rack.code} / {book.code}
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-slate-900">{book.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{book.summary}</p>
        <p className="mt-2 text-sm text-slate-500">
          {book.version} - {book.releaseDate}
        </p>
        <div className="mt-5">
          <Button asChild variant="outline">
            <Link href={`/racks/${book.rack.slug}`}>Kembali ke Rak</Link>
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <p className="mb-4 text-sm uppercase tracking-[0.16em] text-slate-500">Pengantar Buku</p>
        <article className="reader-prose">{renderMarkdownToElements(readmeMarkdown)}</article>
      </section>

      {changelogMarkdown ? (
        <section className="rounded-2xl border border-slate-300 bg-white p-6">
          <p className="mb-4 text-sm uppercase tracking-[0.16em] text-slate-500">Changelog</p>
          <article className="reader-prose">{renderMarkdownToElements(changelogMarkdown)}</article>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Section Buku</p>
          <h2 className="mt-1 text-2xl font-medium text-slate-900">Setiap bagian punya halaman sendiri</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {book.sections.map((section) => {
            const firstItem = book.items.find((item) => item.section === section.slug);
            return (
              <article key={section.id} className="rounded-2xl border border-slate-200 p-5">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{section.slug}</p>
                <h3 className="mt-2 text-xl font-medium text-slate-900">{section.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-700">{section.summary}</p>
                <p className="mt-4 text-sm text-slate-600">{section.itemCount} item</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild variant="outline">
                    <Link href={`/racks/${book.rack.slug}/books/${book.slug}/sections/${section.slug}`}>
                      Buka Section
                    </Link>
                  </Button>
                  {firstItem ? (
                    <Button asChild variant="ghost">
                      <Link
                        href={`/racks/${book.rack.slug}/books/${book.slug}/sections/${section.slug}/${firstItem.slug}`}
                      >
                        Item Pertama
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
