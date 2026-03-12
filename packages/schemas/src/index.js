import { z } from "zod";

export const rackSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  code: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  sourcePath: z.string().min(1),
  readmePath: z.string().min(1),
});

export const materialSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  code: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: z.string().min(1),
  summary: z.string().min(1),
  type: z.enum(["chapter", "topic", "exercise", "reference"]),
  sourcePath: z.string().min(1),
});

export const bookSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  rack: rackSchema,
  code: z.string().min(1),
  title: z.string().min(1),
  version: z.string().min(1),
  releaseDate: z.string().min(1),
  summary: z.string().min(1),
  materials: z.array(materialSchema).min(1),
});

export const bookCatalogSchema = z.array(bookSchema);

export const librarySectionSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  sourcePath: z.string().min(1),
  readmePath: z.string().nullable(),
  itemCount: z.number().int().nonnegative(),
});

export const libraryItemFileSchema = z.object({
  name: z.string().min(1),
  sourcePath: z.string().min(1),
  language: z.string().min(1),
});

export const libraryItemSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  section: z.enum(["chapters", "topics", "exercises", "examples", "assets", "docs"]),
  kind: z.enum(["markdown", "example", "asset"]),
  code: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: z.string().min(1),
  summary: z.string().min(1),
  sourcePath: z.string().min(1),
  readmePath: z.string().nullable(),
  assetExtension: z.string().nullable(),
  files: z.array(libraryItemFileSchema),
});

export const libraryBookSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  rack: rackSchema,
  code: z.string().min(1),
  title: z.string().min(1),
  version: z.string().min(1),
  releaseDate: z.string().min(1),
  summary: z.string().min(1),
  sourcePath: z.string().min(1),
  readmePath: z.string().min(1),
  changelogPath: z.string().nullable(),
  sections: z.array(librarySectionSchema),
  items: z.array(libraryItemSchema),
});

export const libraryCatalogSchema = z.object({
  root: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    sourcePath: z.string().min(1),
    readmePath: z.string().min(1),
  }),
  racks: z.array(rackSchema),
  books: z.array(libraryBookSchema),
});
