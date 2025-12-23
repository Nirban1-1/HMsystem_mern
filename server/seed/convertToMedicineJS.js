import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the JSON file
const jsonData = JSON.parse(fs.readFileSync(path.join(__dirname, 'medicineData.json'), 'utf-8'));

// Create the JavaScript file content
const jsContent = `const sampleMedicins = ${JSON.stringify(jsonData, null, 2)};\n\nexport { sampleMedicins as data };\n`;

// Write to medicine.js
fs.writeFileSync(path.join(__dirname, 'medicine.js'), jsContent);

console.log(`✅ Successfully converted ${jsonData.length} medicines to medicine.js`);
