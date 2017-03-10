const markdownpdf = require("markdown-pdf")
const fs = require('fs')

fs.createReadStream(__dirname + "/Dossier de projet - RackAClefs.md")
  .pipe(markdownpdf())
  .pipe(fs.createWriteStream(__dirname + "/Dossier de projet - RackAClefs.pdf"))
