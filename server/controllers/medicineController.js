import Medicine from '../models/Medicine.js';

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private (Doctor)
const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({})
      .select('_id drugName manufacturer category price consumeType description')
      .sort({ drugName: 1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error('Error fetching medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medicines'
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

    const medicines = await Medicine.find({
      $or: [
        { drugName: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { manufacturer: { $regex: q, $options: 'i' } }
      ]
    })
      .select('_id drugName manufacturer category price consumeType description')
      .limit(20)
      .sort({ drugName: 1 });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    console.error('Error searching medicines:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search medicines'
    });
  }
};

export {
  getAllMedicines,
  getMedicineById,
  searchMedicines
};
