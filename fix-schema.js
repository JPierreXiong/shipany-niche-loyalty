const fs = require('fs');
const path = require('path');

const filePath = 'D:/AIsoftware/niche_loyalty/src/config/db/schema.ts';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Keep only first 784 lines (0-783)
const cleanedLines = lines.slice(0, 784);
const cleanedContent = cleanedLines.join('\n');

fs.writeFileSync(filePath, cleanedContent, 'utf8');
console.log('✅ Schema.ts cleaned! Removed Digital Heirloom tables.');
console.log(`Original lines: ${lines.length}, New lines: ${cleanedLines.length}`);



