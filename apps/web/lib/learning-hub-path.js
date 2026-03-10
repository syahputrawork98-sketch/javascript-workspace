import path from "node:path";

export function resolveLearningHubRoot() {
  if (process.env.LEARNING_HUB_PATH) {
    return path.resolve(process.env.LEARNING_HUB_PATH);
  }

  return path.resolve(process.cwd(), "..", "..", "..", "JavaScript-Learning-Hub");
}

export function ensureInsideRoot(rootPath, targetPath) {
  const normalizedRoot = path.resolve(rootPath);
  const normalizedTarget = path.resolve(targetPath);
  return normalizedTarget.startsWith(normalizedRoot);
}
