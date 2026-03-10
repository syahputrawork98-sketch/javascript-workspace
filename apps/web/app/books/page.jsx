import Link from "next/link";
import { Button } from "@javascript-workspace/ui";
import { books } from "@/lib/books";

export const metadata = {
  title: "Daftar Buku | JavaScript Workspace",
};

export default function BooksPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-14">
      <section className="border border-slate-300 bg-white p-4 text-center">
        <p className="text-sm text-slate-500">katalog buku</p>
        <h1 className="text-2xl font-medium text-slate-900">Buku dan Materi JavaScript</h1>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {books.map((book) => (
          <article key={book.id} className="border border-slate-300 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{book.code}</p>
            <h2 className="mt-1 text-xl font-medium text-slate-900">{book.title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {book.version} - {book.releaseDate}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-700">{book.summary}</p>
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm text-slate-600">{book.materials.length} materi</p>
              <Button asChild variant="outline">
                <Link href={`/books/${book.id}`}>Buka Buku</Link>
              </Button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
