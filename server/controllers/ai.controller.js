const aiService = require('../services/ai.service');
const { pool } = require('../config/db.config'); 

exports.generateLetter = async (req, res) => {
  try {
    const { insuredName, letterType, instructions } = req.body;

    if (!insuredName) {
      return res.status(400).json({ message: 'Insured name is required' });
    }

  
    const [rows] = await pool.query(
      'SELECT insured_id, insured_name, contact_phone, contact_email, address FROM insured_info WHERE insured_name = ?',
      [insuredName]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Insured not found' });
    }

    const insured = rows[0];

  
    const text = await aiService.generateLetter({ insured, letterType, instructions });

    res.json({ text });
  } catch (err) {
    console.error('Error generating letter:', err);
    res.status(500).json({ message: 'Failed to generate letter' });
  }
};
