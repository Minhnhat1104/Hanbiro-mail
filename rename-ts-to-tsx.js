import fs from "fs"
import path from "path"

/**
 * Phát hiện JSX:
 * - <Component />
 * - <Component></Component>
 * - <>...</> (Fragment)
 */
const jsxRegex = /(<[A-Z][A-Za-z0-9]*\b)|(<\/[A-Z][A-Za-z0-9]*>)|(<>\s*)|(\s*<\/>)/

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      walk(fullPath)
      continue
    }

    // Chỉ xử lý .ts (không đụng .d.ts)
    if (!fullPath.endsWith(".ts") || fullPath.endsWith(".d.ts")) {
      continue
    }

    const content = fs.readFileSync(fullPath, "utf8")

    // Chỉ đổi khi phát hiện JSX
    if (jsxRegex.test(content)) {
      const newPath = fullPath.replace(/\.ts$/, ".tsx")
      fs.renameSync(fullPath, newPath)
      console.log(`✔ ${fullPath} → ${newPath}`)
    }
  }
}

walk("src")
console.log("Done")
