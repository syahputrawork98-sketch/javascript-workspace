import Link from "next/link";
import { Button } from "@javascript-workspace/ui";
import { libraryBooks, libraryRacks } from "@/lib/library";

export const metadata = {
  title: "Daftar Rak | JavaScript Workspace",
};

export default function RacksPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <section className="rounded-2xl border border-slate-300 bg-white p-6">
        <p className="text-sm uppercase tracking-[0.16em] text-slate-500">Katalog v2</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-slate-900">Daftar Rak JavaScript Learning Hub</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
          Mulai dari rak terlebih dahulu. Dari sini kita mengikuti struktur v2 secara natural:
          pilih rak, masuk ke buku, lalu turun lagi ke section dan item.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {libraryRacks.map((rack) => {
          const books = libraryBooks.filter((book) => book.rack.slug === rack.slug);
          const itemCount = books.reduce((acc, book) => acc + book.items.length, 0);

          return (
            <article key={rack.id} className="rounded-2xl border border-slate-300 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{rack.code}</p>
              <h2 className="mt-2 text-2xl font-medium text-slate-900">{rack.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{rack.summary}</p>
              <div className="mt-5 flex gap-6 text-sm text-slate-600">
                <span>{books.length} buku</span>
                <span>{itemCount} item</span>
              </div>
              <div className="mt-5">
                <Button asChild variant="outline">
                  <Link href={`/racks/${rack.slug}`}>Masuk ke Rak</Link>
                </Button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
