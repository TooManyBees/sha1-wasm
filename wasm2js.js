const fs = require('fs');
const path = require('path');

const filePaths = process.argv.slice(2);

const filePath = process.argv[2];
if (filePaths.length) {
  console.log(`Writing ${filePaths.map(p => `'${p}'`).join(', ')} to js`);
} else {
  console.error("Missing required filePath argument");
  process.exit(1);
}

["index.js", "glue.js", "web.js"].forEach(name =>
  fs.copyFileSync(path.join('./build', name), path.join('./dist', name)));

for (let filePath of filePaths) {
  try {
    const buf = fs.readFileSync(filePath);
    const outFilePath = filePath + ".js";
    const f = fs.createWriteStream(outFilePath);
    f.end(`
const buffer = new ArrayBuffer(${buf.length});
const array = new Uint8Array(buffer);
array.set([${buf.join()}]);
module.exports = array;
`);
  } catch(e) {
    console.error(`Error writing ${filePath}`, e);
  }
}
