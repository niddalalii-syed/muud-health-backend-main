const pool = require('../db');

exports.addContact = async (req, res) => {
  const { contact_name, contact_email } = req.body;
  const user_id = req.user.user_id;

  if (!contact_name || !contact_email) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO contacts (user_id, contact_name, contact_email) VALUES ($1, $2, $3) RETURNING id',
      [user_id, contact_name, contact_email]
    );
    res.status(201).json({ success: true, contact_id: result.rows[0].id });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getContactsByUser = async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const result = await pool.query(
      'SELECT * FROM contacts WHERE user_id = $1 ORDER BY id ASC',
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
