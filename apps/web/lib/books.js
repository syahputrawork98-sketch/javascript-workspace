import fs from "node:fs";
import path from "node:path";
import { bookCatalogSchema } from "@javascript-workspace/schemas";
import { resolveLearningHubRoot } from "./learning-hub-path";

const CONTENT_DIR_BY_PRIORITY = ["chapters", "topics", "exercises"];
const MATERIAL_TYPE_BY_DIR = {
  chapters: "chapter",
  topics: "topic",
  exercises: "exercise",
};

function parseLeadingNumber(value) {
  const match = value.match(/^(\d+)/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

function sortByLeadingNumberThenName(a, b) {
  const diff = parseLeadingNumber(a) - parseLeadingNumber(b);
  if (diff !== 0) return diff;
  return a.localeCompare(b);
}

function titleFromSlug(slug) {
  const cleaned = slug.replace(/^\d+-/, "").replace(/-/g, " ").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words
    .map((word) => {
      if (word.toLowerCase() === "javascript") return "JavaScript";
      if (word.toLowerCase() === "ecmascript") return "ECMAScript";
      if (word.toLowerCase() === "api") return "API";
      return word[0] ? word[0].toUpperCase() + word.slice(1) : word;
    })
    .join(" ");
}

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function extractFirstHeading(markdownText) {
  const line = markdownText.split(/\r?\n/).find((item) => item.startsWith("# "));
  if (!line) return "";
  return line.replace(/^#\s+/, "").trim();
}

function extractSummary(markdownText) {
  const lines = markdownText.split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith("#")) continue;
    if (line.startsWith("- ")) continue;
    if (line.startsWith("```")) continue;
    if (line.startsWith("![")) continue;
    return line;
  }
  return "";
}

function extractVersionAndDateFromChangelog(changelogText) {
  const match = changelogText.match(/v\d+\.\d+\.\d+.*\d{4}-\d{2}-\d{2}/i);
  if (!match) return null;

  const version = match[0].match(/v\d+\.\d+\.\d+/i)?.[0] || "v0.0.0";
  const releaseDate = match[0].match(/\d{4}-\d{2}-\d{2}/)?.[0] || "unknown";
  return { version, releaseDate };
}

function pickContentDirectory(bookAbsolutePath) {
  return CONTENT_DIR_BY_PRIORITY.find((dirName) =>
    fs.existsSync(path.join(bookAbsolutePath, dirName))
  );
}

function extractMaterialTitle(fileAbsolutePath, fileName) {
  const markdown = readFileIfExists(fileAbsolutePath);
  const heading = extractFirstHeading(markdown);
  if (heading) return heading;
  return titleFromSlug(path.basename(fileName, ".md"));
}

function materialTypeForBook(code, contentDirName) {
  if (code === "07") return "reference";
  return MATERIAL_TYPE_BY_DIR[contentDirName] || "topic";
}

function collectMaterials(hubRoot, bookDirName, code) {
  const bookAbsolutePath = path.join(hubRoot, bookDirName);
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
    return {
      id: path.basename(fileName, ".md"),
      title: extractMaterialTitle(fileAbsolutePath, fileName),
      type: materialTypeForBook(code, contentDirName),
      sourcePath: `${bookDirName}/${contentDirName}/${fileName}`,
    };
  });
}

function collectBook(hubRoot, bookDirName) {
  const bookAbsolutePath = path.join(hubRoot, bookDirName);
  const code = (bookDirName.match(/^(\d{2})-/)?.[1] || "").trim();

  const readmePath = path.join(bookAbsolutePath, "README.md");
  const changelogPath = path.join(bookAbsolutePath, "CHANGELOG.md");
  const readmeText = readFileIfExists(readmePath);
  const changelogText = readFileIfExists(changelogPath);

  const heading = extractFirstHeading(readmeText);
  const title = heading
    ? heading.replace(/^\d{2}\s*-\s*/g, "").trim()
    : titleFromSlug(bookDirName);

  const summary = extractSummary(readmeText) || `Materi ${title} dari JavaScript Learning Hub.`;
  const versionAndDate = extractVersionAndDateFromChangelog(changelogText) || {
    version: "v0.0.0",
    releaseDate: "unknown",
  };

  const materials = collectMaterials(hubRoot, bookDirName, code);
  if (!materials.length) return null;

  return {
    id: bookDirName,
    code: code || "00",
    title,
    version: versionAndDate.version,
    releaseDate: versionAndDate.releaseDate,
    summary,
    materials,
  };
}

function collectBooksFromLearningHub() {
  const hubRoot = resolveLearningHubRoot();
  if (!fs.existsSync(hubRoot)) {
    throw new Error(`Learning Hub path not found: ${hubRoot}`);
  }

  const directories = fs
    .readdirSync(hubRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((dirName) => /^\d{2}-/.test(dirName))
    .sort(sortByLeadingNumberThenName);

  const rawBooks = directories
    .map((dirName) => collectBook(hubRoot, dirName))
    .filter((book) => book !== null);

  return bookCatalogSchema.parse(rawBooks);
}

export const books = collectBooksFromLearningHub();

export function getBookById(id) {
  return books.find((book) => book.id === id) || null;
}
