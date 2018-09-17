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

for (let filePath of filePaths) {
  try {
    const buf = fs.readFileSync(filePath);
    const outFilePath = filePath + ".js";
    const f = fs.createWriteStream(outFilePath);
    f.end(`const buffer = new ArrayBuffer(${buf.length});\nconst array = new Uint8Array(buffer);\narray.set([${buf.join()}]);\nmodule.exports = array;\n`);
  } catch(e) {
    console.error(`Error writing ${filePath}`, e);
  }
}
