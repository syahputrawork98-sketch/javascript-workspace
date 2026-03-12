import fs from "node:fs";
import path from "node:path";
import { bookCatalogSchema } from "@javascript-workspace/schemas";
import { resolveLearningHubRoot } from "./learning-hub-path";
import {
  extractFirstHeading,
  extractMaterialSummary,
  extractMaterialTitle,
  extractSummary,
  extractVersionAndDateFromChangelog,
  inferMaterialCode,
  inferMaterialOrder,
  MATERIAL_TYPE_BY_DIR,
  pickContentDirectory,
  readFileIfExists,
  sortByLeadingNumberThenName,
  stripLeadingCode,
  titleFromSlug,
} from "./library-helpers";

const LEGACY_DIRECTORY = "v1";
const BOOK_DIRECTORY_PATTERN = /^(\d{2})-/;

function collectMaterials(hubRoot, bookDirName) {
  const bookAbsolutePath = path.join(hubRoot, LEGACY_DIRECTORY, bookDirName);
  const contentDirName = pickContentDirectory(bookAbsolutePath);
  if (!contentDirName) return [];

  const contentAbsolutePath = path.join(bookAbsolutePath, contentDirName);
  const files = fs
    .readdirSync(contentAbsolutePath, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => fileName.endsWith(".md"))
    .filter((fileName) => fileName.toLowerCase() !== "readme.md")
    .sort(sortByLeadingNumberThenName);

  return files.map((fileName) => {
    const fileAbsolutePath = path.join(contentAbsolutePath, fileName);
    const type = MATERIAL_TYPE_BY_DIR[contentDirName] || "topic";
    const slug = path.basename(fileName, ".md");
    return {
      id: slug,
      slug,
      code: inferMaterialCode(fileName, type),
      order: inferMaterialOrder(fileName),
      title: extractMaterialTitle(fileAbsolutePath, fileName),
      summary: extractMaterialSummary(fileAbsolutePath),
      type,
      sourcePath: `${LEGACY_DIRECTORY}/${bookDirName}/${contentDirName}/${fileName}`,
    };
  });
}

function collectBook(hubRoot, bookDirName) {
  const bookAbsolutePath = path.join(hubRoot, LEGACY_DIRECTORY, bookDirName);
  const code = (bookDirName.match(BOOK_DIRECTORY_PATTERN)?.[1] || "").trim();
  const readmeText = readFileIfExists(path.join(bookAbsolutePath, "README.md"));
  const changelogText = readFileIfExists(path.join(bookAbsolutePath, "CHANGELOG.md"));
  const heading = extractFirstHeading(readmeText);
  const title = heading ? stripLeadingCode(heading) : titleFromSlug(bookDirName);
  const summary = extractSummary(readmeText) || `Materi ${title} dari arsip JavaScript Learning Hub v1.`;
  const versionAndDate = extractVersionAndDateFromChangelog(changelogText) || {
    version: "v1.0.0",
    releaseDate: "unknown",
  };
  const materials = collectMaterials(hubRoot, bookDirName);
  if (!materials.length) return null;

  return {
    id: `v1-${bookDirName}`,
    slug: bookDirName,
    rack: {
      id: LEGACY_DIRECTORY,
      slug: LEGACY_DIRECTORY,
      code: "v1",
      title: "Arsip Learning Hub v1",
      summary: "Katalog versi lama yang dipertahankan sebagai arsip pembelajaran.",
      sourcePath: LEGACY_DIRECTORY,
      readmePath: `${LEGACY_DIRECTORY}/README.md`,
    },
    code: code || "00",
    title,
    version: versionAndDate.version,
    releaseDate: versionAndDate.releaseDate,
    summary,
    materials,
  };
}

function collectBooksFromLearningHubV1() {
  const hubRoot = resolveLearningHubRoot();
  const legacyRoot = path.join(hubRoot, LEGACY_DIRECTORY);
  if (!fs.existsSync(legacyRoot)) return [];

  const rawBooks = fs
    .readdirSync(legacyRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((dirName) => BOOK_DIRECTORY_PATTERN.test(dirName))
    .sort(sortByLeadingNumberThenName)
    .map((bookDirName) => collectBook(hubRoot, bookDirName))
    .filter((book) => book !== null);

  try {
    return bookCatalogSchema.parse(rawBooks);
  } catch {
    return [];
  }
}

export const archiveBooks = collectBooksFromLearningHubV1();

export function getArchiveBookById(id) {
  return archiveBooks.find((book) => book.id === id) || null;
}
