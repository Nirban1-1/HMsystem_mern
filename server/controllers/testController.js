// controllers/testController.js
import Test from "../models/Test.js";

export const searchTests = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Query is required" });
    }

    const regex = new RegExp(q, "i");
    const tests = await Test.find({ name: regex }).limit(20);

    // Return consistent response shape similar to other autocomplete endpoints
    res.status(200).json({ tests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
