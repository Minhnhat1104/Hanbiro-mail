/**
 * Script convert JSON setting theme to SCSS
 * - public/theme/*.json > src/assets/scss/theme/*.scss
 */
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const jsonDir = "./public/theme" // path of folder contain json files
const scssDir = "./src/assets/scss/theme" // path of folder contain scss files

fs.readdir(jsonDir, (err, files) => {
  if (err) {
    console.error("Could not list the directory.", err)
    process.exit(1)
  }

  files.forEach((file, index) => {
    if (path.extname(file) === ".json") {
      const jsonFile = path.join(jsonDir, file)
      const scssFile = path.join(scssDir, `${path.basename(file, ".json")}.scss`)
      execSync(`npx json-to-scss ${jsonFile} ${scssFile}`)
      console.log(`Converted ${jsonFile} to ${scssFile}`)
    }
  })
})
