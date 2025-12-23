import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to sanitize strings - remove invalid UTF-8 and control characters
function sanitizeString(str) {
  if (!str) return '';
  
  // Convert to string if not already
  str = String(str);
  
  // Replace problematic characters
  return str
    // Remove null bytes and control characters
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    // Replace common problematic Unicode characters with ASCII equivalents
    .replace(/[\u2018\u2019]/g, "'")  // Smart quotes to regular quotes
    .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes
    .replace(/\u2013|\u2014/g, '-')   // En/em dash to hyphen
    .replace(/\u2026/g, '...')        // Ellipsis
    .replace(/[\u0080-\u009F]/g, '')  // Remove additional control characters
    // Remove any remaining non-printable ASCII
    .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '')
    .trim();
}

// Helper function to parse CSV
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => sanitizeString(h.replace(/"/g, '')));
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(sanitizeString(current.replace(/"/g, '')));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(sanitizeString(current.replace(/"/g, '')));
    
    if (values.length === headers.length) {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index];
      });
      data.push(obj);
    }
  }
  
  return data;
}

// Read all CSV files
const archivePath = path.join(__dirname, '../../archive');

const medicineCSV = fs.readFileSync(path.join(archivePath, 'medicine.csv'), 'utf-8');
const dosageFormCSV = fs.readFileSync(path.join(archivePath, 'dosage form.csv'), 'utf-8');
const drugClassCSV = fs.readFileSync(path.join(archivePath, 'drug class.csv'), 'utf-8');
const genericCSV = fs.readFileSync(path.join(archivePath, 'generic.csv'), 'utf-8');
const indicationCSV = fs.readFileSync(path.join(archivePath, 'indication.csv'), 'utf-8');
const manufacturerCSV = fs.readFileSync(path.join(archivePath, 'manufacturer.csv'), 'utf-8');

// Parse all CSVs
const medicines = parseCSV(medicineCSV);
const dosageForms = parseCSV(dosageFormCSV);
const drugClasses = parseCSV(drugClassCSV);
const generics = parseCSV(genericCSV);
const indications = parseCSV(indicationCSV);
const manufacturers = parseCSV(manufacturerCSV);

// Create lookup maps
const dosageFormMap = {};
dosageForms.forEach(df => {
  dosageFormMap[df['dosage form id']] = df['dosage form name'];
});

const drugClassMap = {};
drugClasses.forEach(dc => {
  drugClassMap[dc['drug class id']] = dc['drug class name'];
});

const genericMap = {};
generics.forEach(g => {
  genericMap[g['generic id']] = {
    name: g['generic name'],
    drugClass: g['drug class'],
    indication: g['indication']
  };
});

const indicationMap = {};
indications.forEach(ind => {
  indicationMap[ind['indication id']] = ind['indication name'];
});

const manufacturerMap = {};
manufacturers.forEach(m => {
  manufacturerMap[m['manufacturer id']] = m['manufacturer name'];
});

// Generate price randomly between 10 and 500
function generatePrice() {
  return Math.floor(Math.random() * 490) + 10;
}

// Extract dosage form from the medicine data
function extractDosageForm(medicine) {
  const dosageForm = medicine['dosage form'] || '';
  return dosageForm || 'Tablet';
}

// Create medicines seed data matching Medicine.js schema
const medicinesSeedData = medicines.map((medicine, index) => {
  const genericName = sanitizeString(medicine['generic'] || '');
  const manufacturerName = sanitizeString(medicine['manufacturer'] || 'Generic');
  const brandName = sanitizeString(medicine['brand name'] || `Medicine ${index + 1}`);
  const strength = sanitizeString(medicine['strength'] || '');
  const type = sanitizeString(medicine['type'] || 'allopathic');
  
  // Extract price from package container field
  let price = generatePrice();
  const packageContainer = medicine['package container'] || '';
  const priceMatch = packageContainer.match(/৳\s*([\d.,]+)/);
  if (priceMatch) {
    const priceStr = priceMatch[1].replace(/,/g, '');
    price = parseFloat(priceStr) || generatePrice();
  }
  
  // Build better description
  let description = 'Pharmaceutical product for medical use';
  if (genericName) {
    description = genericName;
    if (strength) {
      description += ` - ${strength}`;
    }
  }
  description = sanitizeString(description);
  
  return {
    drugName: brandName,
    manufacturer: manufacturerName,
    image: '',
    description: description,
    consumeType: sanitizeString(extractDosageForm(medicine)),
    expirydate: null,
    price: price,
    sideEffects: 'Consult your doctor for complete information about side effects.',
    disclaimer: 'This medicine should be used as directed by a healthcare professional.',
    category: type,
    countInStock: Math.floor(Math.random() * 500) + 50
  };
});

// Write to JSON file
const outputPath = path.join(__dirname, 'medicineData.json');
fs.writeFileSync(outputPath, JSON.stringify(medicinesSeedData, null, 2));

console.log(`Successfully created medicine seed data with ${medicinesSeedData.length} medicines`);
console.log(`Output file: ${outputPath}`);
console.log(`Sample medicine:`, JSON.stringify(medicinesSeedData[0], null, 2));
