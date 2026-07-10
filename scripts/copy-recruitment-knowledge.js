const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "content", "recruitment-faq.md");
const dest = path.join(root, "functions", "knowledge.md");

fs.copyFileSync(src, dest);
console.log("Copied content/recruitment-faq.md → functions/knowledge.md");
