import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const ignoredDirectories = new Set([".git", "node_modules"]);
const textExtensions = new Set([".html", ".css", ".js", ".mjs", ".md", ".yml", ".yaml", ".json"]);
const findings = [];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".") && entry.name !== ".github") return [];
    if (ignoredDirectories.has(entry.name)) return [];
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function add(type, file, detail) {
  findings.push({ type, file: relative(file), detail });
}

const files = walk(root);
const htmlFiles = files.filter((file) => path.extname(file).toLowerCase() === ".html");

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const attributePattern = /(?:href|src)=["']([^"']+)["']/gi;
  for (const match of html.matchAll(attributePattern)) {
    const rawReference = match[1].trim();
    if (!rawReference || rawReference.startsWith("#")) continue;
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(rawReference)) continue;

    const cleanReference = decodeURIComponent(rawReference.split("#")[0].split("?")[0]);
    if (!cleanReference) continue;
    let target = path.resolve(path.dirname(file), cleanReference);
    if (cleanReference.endsWith("/")) target = path.join(target, "index.html");
    if (!fs.existsSync(target)) add("missing-local-reference", file, rawReference);
  }
}

const secretPatterns = [
  /\bsk-[A-Za-z0-9_-]{20,}\b/g,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
];

for (const file of files.filter((candidate) => textExtensions.has(path.extname(candidate).toLowerCase()))) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of secretPatterns) {
    if (pattern.test(text)) add("possible-secret", file, pattern.source);
    pattern.lastIndex = 0;
  }
}

const requiredNotices = [
  {
    file: path.join(root, "students", "marcus", "index.html"),
    text: "本主页全部内容版权归 MARCUS 所有",
  },
  {
    file: path.join(root, "student-cases", "marcus-zhujiang-racing.html"),
    text: "仅作为 AI Coding 学习与作品展示案例",
  },
];

for (const notice of requiredNotices) {
  if (!fs.existsSync(notice.file)) {
    add("missing-required-file", notice.file, notice.text);
    continue;
  }
  const content = fs.readFileSync(notice.file, "utf8");
  if (!content.includes(notice.text)) add("missing-required-notice", notice.file, notice.text);
}

if (findings.length > 0) {
  console.error(`Static site checks failed with ${findings.length} finding(s):`);
  for (const finding of findings) {
    console.error(`- [${finding.type}] ${finding.file}: ${finding.detail}`);
  }
  process.exit(1);
}

console.log(`Static site checks passed: ${htmlFiles.length} HTML files and ${files.length} repository files checked.`);

