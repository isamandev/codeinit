const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src");

const allowedSharedImport = (fromFile, importPath) => {
  // shared must not import from features
  if (
    importPath.startsWith("@features/") &&
    fromFile.includes(path.join("src", "shared"))
  ) {
    return false;
  }
  // feature must not import from other features
  if (importPath.startsWith("@features/")) {
    const fromFeature =
      fromFile.split(path.sep).indexOf("features") !== -1
        ? fromFile.split(path.sep)[
            fromFile.split(path.sep).indexOf("features") + 1
          ]
        : null;
    const toFeature = importPath.split("/")[1];
    if (fromFeature && toFeature && fromFeature !== toFeature) return false;
  }
  return true;
};

const walk = (dir) => {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) {
      files = files.concat(walk(full));
    } else if (it.isFile() && /\.tsx?$/.test(it.name)) {
      files.push(full);
    }
  }
  return files;
};

const files = walk(SRC);
const violations = [];

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const importRegex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(src)) !== null) {
    const imp = match[1];
    if (imp.startsWith("@features/") || imp.startsWith("@shared/")) {
      if (!allowedSharedImport(file, imp)) {
        violations.push({ file, imp });
      }
    }
  }
}

if (violations.length) {
  console.error("\nArchitectural boundary violations found:");
  for (const v of violations) {
    console.error(` - ${path.relative(ROOT, v.file)} imports ${v.imp}`);
  }
  process.exit(2);
} else {
  console.log("No architectural boundary violations detected.");
}
