import Medicine from '../models/Medicine.js';

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private (Doctor)
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({})
      .select('_id drugName manufacturer category price consumeType description')
      .limit(100) // Limit to prevent timeout
      .sort({ drugName: 1 })
      .lean(); // Convert to plain JavaScript objects

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medicines',
      error: error.message
    });
  }
};

// @desc    Get medicine by ID
// @route   GET /api/medicines/:id
// @access  Private
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.status(200).json({
      success: true,
      medicine
    });
  } catch (error) {
    console.error('Error fetching medicine:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medicine'
    });
  }
};

// @desc    Search medicines by name or category
// @route   GET /api/medicines/search?q=keyword
// @access  Private
const searchMedicines = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Prioritize drugName matches, then search other fields
    const medicines = await Medicine.find({
      drugName: { $regex: q, $options: 'i' }
    })
      .select('_id drugName manufacturer category price consumeType description countInStock')
      .limit(50)
      .sort({ drugName: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error('Error searching medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search medicines',
      error: error.message
    });
  }
};

// @desc    Search medicines by starting letters (autocomplete)
// @route   GET /api/medicines/autocomplete?q=keyword
// @access  Private
const autocompleteMedicines = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    console.log(`[Medicine Autocomplete] Searching for: "${q}"`);

    // Always search the entire database with each keystroke
    // Escape special regex characters to prevent regex injection
    const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    let startsWith = [];
    let contains = [];

    // First, search for medicines that start with the typed letters (prioritized)
    // This searches the FULL database every time, not filtered results
    // Wrapped in try-catch to handle corrupted BSON data gracefully
    try {
      const cursor = Medicine.find({
        drugName: { $regex: `^${escapedQuery}`, $options: 'i' }
      })
        .select('_id drugName manufacturer category price consumeType description countInStock')
        .limit(50)
        .sort({ drugName: 1 })
        .cursor();

      // Process documents one by one to skip corrupted entries
      for await (const doc of cursor) {
        try {
          // Convert to plain object and validate
          const medicine = doc.toObject();
          if (medicine && medicine.drugName && typeof medicine.drugName === 'string') {
            startsWith.push(medicine);
          }
        } catch (docError) {
          console.warn(`[Medicine Autocomplete] Skipping corrupted document:`, docError.message);
          continue;
        }
      }

      console.log(`[Medicine Autocomplete] Found ${startsWith.length} medicines starting with "${q}"`);
    } catch (queryError) {
      console.error(`[Medicine Autocomplete] Error in startsWith query:`, queryError.message);
      // Continue with empty results for this query
    }

    // If we have enough results from "starts with", return them
    if (startsWith.length >= 50) {
      return res.status(200).json({
        success: true,
        count: startsWith.length,
        medicines: startsWith
      });
    }

    // If not enough results, also search for medicines that contain the search term anywhere
    try {
      const startsWithIds = startsWith.map(m => m._id);
      const cursor = Medicine.find({
        drugName: { $regex: escapedQuery, $options: 'i' },
        _id: { $nin: startsWithIds } // Exclude already found medicines
      })
        .select('_id drugName manufacturer category price consumeType description countInStock')
        .limit(50 - startsWith.length)
        .sort({ drugName: 1 })
        .cursor();

      // Process documents one by one to skip corrupted entries
      for await (const doc of cursor) {
        try {
          const medicine = doc.toObject();
          if (medicine && medicine.drugName && typeof medicine.drugName === 'string') {
            contains.push(medicine);
          }
        } catch (docError) {
          console.warn(`[Medicine Autocomplete] Skipping corrupted document:`, docError.message);
          continue;
        }
      }

      console.log(`[Medicine Autocomplete] Found ${contains.length} additional medicines containing "${q}"`);
    } catch (queryError) {
      console.error(`[Medicine Autocomplete] Error in contains query:`, queryError.message);
      // Continue with empty results for this query
    }

    const medicines = [...startsWith, ...contains];

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error('Error autocompleting medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to autocomplete medicines. There may be corrupted data in the database.',
      error: error.message
    });
  }
};

export {
  getAllMedicines,
  getMedicineById,
  searchMedicines,
  autocompleteMedicines
};
