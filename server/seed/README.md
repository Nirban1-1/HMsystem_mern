# Medicine Seed Data

This folder contains scripts and data for seeding the medicine database from CSV files.

## Files

- **medicineData.json**: Combined JSON seed file containing 1000 medicines from the CSV data
- **parseMedicineCSV.js**: Script to parse CSV files and generate medicineData.json
- **seedMedicines.js**: Script to seed the database with medicine data

## CSV Source Files (archive folder)

The following CSV files from the archive folder are combined:
- `medicine.csv` - Main medicine data (brand names, types, dosage forms, etc.)
- `manufacturer.csv` - Manufacturer information
- `generic.csv` - Generic drug information
- `dosage form.csv` - Dosage form types
- `drug class.csv` - Drug classifications
- `indication.csv` - Medical indications

## Medicine Schema

Each medicine entry follows the Medicine.js model:
```javascript
{
  drugName: String,        // Brand name of the medicine
  manufacturer: String,     // Manufacturer company name
  image: String,           // Image URL (empty by default)
  description: String,     // Generic name + strength
  consumeType: String,     // Dosage form (Tablet, Syrup, Injection, etc.)
  expirydate: Date,       // Expiry date (null by default)
  price: Number,          // Price in currency
  sideEffects: String,    // Side effects information
  disclaimer: String,     // Usage disclaimer
  category: String,       // Medicine category (allopathic, herbal)
  countInStock: Number    // Available quantity
}
```

## Usage

### 1. Regenerate JSON from CSV (optional)
```bash
cd server/seed
node parseMedicineCSV.js
```

### 2. Seed the Database
```bash
cd server/seed
node seedMedicines.js
```

Make sure your `.env` file has the `MONGO_URI` configured before seeding.

## Data Statistics

- **Total medicines**: 1000 medicines
- **Categories**: allopathic, herbal
- **Dosage forms**: Tablet, Capsule, Syrup, Injection, and many more
- **Price range**: 1.43 - 500 (based on actual CSV data)
- **Stock range**: 50 - 550 units (randomly generated)

## Notes

- The parser extracts real prices from the CSV package container field
- Generic names and strengths are combined for accurate descriptions
- Manufacturer names are preserved from the original CSV data
- The data represents real pharmaceutical products from Bangladesh market
