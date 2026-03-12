import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@javascript-workspace/ui";
import { getBookBySlugs, getItemsBySection, getSectionFromBook, libraryBooks } from "@/lib/library";
import { loadLibraryText } from "@/lib/learning-hub-content";
import { renderMarkdownToElements } from "@/lib/markdown-renderer";

export async function generateStaticParams() {
  return libraryBooks.flatMap((book) =>
    book.sections.map((section) => ({
      rackId: book.rack.slug,
      bookId: book.slug,
      section: section.slug,
    }))
  );
}

export async function generateMetadata({ params }) {
  const { rackId, bookId, section } = await params;
  const book = getBookBySlugs(rackId, bookId);
  const currentSection = book ? getSectionFromBook(book, section) : null;

  if (!book || !currentSection) return { title: "Section Tidak Ditemukan | JavaScript Focuspace" };

  return { title: `${currentSection.title} | ${book.title} | JavaScript Focuspace` };
}

export default async function BookSectionPage({ params }) {
  const { rackId, bookId, section } = await params;
  const book = getBookBySlugs(rackId, bookId);

  if (!book) notFound();

  const currentSection = getSectionFromBook(book, section);
  if (!currentSection) notFound();

  const sectionItems = getItemsBySection(book, currentSection.slug);
  const sectionMarkdown = currentSection.readmePath
    ? await loadLibraryText(currentSection.readmePath, "# Section belum tersedia")
    : "";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">
          {book.rack.code} / {book.code} / {currentSection.slug}
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-slate-900">{currentSection.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">{currentSection.summary}</p>
        <div className="mt-5">
          <Button asChild variant="outline">
            <Link href={`/racks/${book.rack.slug}/books/${book.slug}`}>Kembali ke Buku</Link>
          </Button>
        </div>
      </section>

      {sectionMarkdown ? (
        <section className="rounded-2xl border border-slate-300 bg-white p-6">
          <p className="mb-4 text-sm uppercase tracking-[0.16em] text-slate-500">Pengantar Section</p>
          <article className="reader-prose">{renderMarkdownToElements(sectionMarkdown)}</article>
        </section>
      ) : null}

      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <div className="mb-5">
          <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Daftar Item</p>
          <h2 className="mt-1 text-2xl font-medium text-slate-900">{sectionItems.length} item di section ini</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sectionItems.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{item.code}</p>
              <h3 className="mt-2 text-xl font-medium text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-700">{item.summary}</p>
              <p className="mt-4 text-sm text-slate-600">{item.kind}</p>
              <div className="mt-5">
                <Button asChild variant="outline">
                  <Link href={`/racks/${book.rack.slug}/books/${book.slug}/sections/${currentSection.slug}/${item.slug}`}>
                    Buka Item
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
