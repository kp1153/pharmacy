const fs = require("fs");
const path = require("path");

const BASE = "D:\\farmacy";

// dashboard/page.js में stores tile हटाओ
const dashPath = path.join(BASE, "app\\dashboard\\page.js");
if (fs.existsSync(dashPath)) {
  let content = fs.readFileSync(dashPath, "utf8");
  content = content.replace(
    /\s*\{\s*\n\s*label:\s*"Stores",\s*\n\s*icon:\s*"[^"]*",\s*\n\s*href:\s*"\/dashboard\/stores",\s*\n\s*color:\s*"[^"]*",\s*\n\s*\},/g,
    ""
  );
  fs.writeFileSync(dashPath, content, "utf8");
  console.log("DONE: app\\dashboard\\page.js");
} else {
  console.log("SKIP (not found): app\\dashboard\\page.js");
}

// delete करने वाली files
const toDelete = [
  "app\\api\\activate\\route.js",
  "app\\api\\stores\\route.js",
  "app\\dashboard\\stores\\page.js",
];

for (const f of toDelete) {
  const p = path.join(BASE, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log("DELETED: " + f);
  } else {
    console.log("SKIP (not found): " + f);
  }
}

console.log("\nसब हो गया!");