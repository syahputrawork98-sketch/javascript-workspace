import { notFound, redirect } from "next/navigation";
import { getBookByLegacyId, libraryBooks } from "@/lib/library";

export async function generateStaticParams() {
  return libraryBooks.map((book) => ({ bookId: `${book.rack.code}-${book.slug}` }));
}

export async function generateMetadata({ params }) {
  const { bookId } = await params;
  const book = getBookByLegacyId(bookId);

  if (!book) return { title: "Buku Tidak Ditemukan | JavaScript Workspace" };

  return { title: `${book.rack.code} / ${book.code} - ${book.title} | JavaScript Workspace` };
}

export default async function BookDetailPage({ params }) {
  const { bookId } = await params;
  const book = getBookByLegacyId(bookId);

  if (!book) notFound();

  redirect(`/racks/${book.rack.slug}/books/${book.slug}`);
}
