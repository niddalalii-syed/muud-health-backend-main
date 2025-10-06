const pool = require('../db');

exports.createEntry = async (req, res) => {
  const { entry_text, mood_rating, timestamp } = req.body;
  const user_id = req.user.user_id; // Extracted from JWT

  if (!entry_text || !mood_rating || !timestamp) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO journal_entries (user_id, entry_text, mood_rating, timestamp) VALUES ($1, $2, $3, $4) RETURNING id',
      [user_id, entry_text, mood_rating, timestamp]
    );
    res.status(201).json({ success: true, entry_id: result.rows[0].id });
  } catch (error) {
    console.error('Error inserting journal entry:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getEntriesByUser = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const result = await pool.query(
      'SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY timestamp DESC',
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
