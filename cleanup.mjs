import { rm } from "fs/promises";
import { existsSync } from "fs";

const targets = [
  "app/api/lab-reports",
  "app/api/patients",
  "app/dashboard/patients",
  "app/api/setup",
];

console.log("Cleanup शुरू...\n");

for (const path of targets) {
  if (existsSync(path)) {
    await rm(path, { recursive: true, force: true });
    console.log(`हटाया: ${path}`);
  } else {
    console.log(`नहीं मिला: ${path}`);
  }
}

console.log("\nFile cleanup पूरा।");