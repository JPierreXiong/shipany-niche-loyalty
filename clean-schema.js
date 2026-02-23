const fs = require('fs');

const filePath = 'D:/AIsoftware/niche_loyalty/src/config/db/schema.ts';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Keep lines 0-803 (first 804 lines, index 0-803)
const cleanedLines = lines.slice(0, 804);

// Remove the trailing comment section and add a clean ending
let finalLines = cleanedLines;

// Find the last meaningful line (before the deletion comments)
for (let i = cleanedLines.length - 1; i >= 0; i--) {
  if (cleanedLines[i].includes('已删除 - Digital Heirloom')) {
    finalLines = cleanedLines.slice(0, i);
    break;
  }
}

const cleanedContent = finalLines.join('\n');
fs.writeFileSync(filePath, cleanedContent, 'utf8');

console.log('✅ Schema.ts cleaned successfully!');
console.log(`Original lines: ${lines.length}`);
console.log(`Cleaned lines: ${finalLines.length}`);



