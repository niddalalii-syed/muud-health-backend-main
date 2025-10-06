const pool = require('./index');
const bcrypt = require('bcrypt');

async function seedDatabase() {
  try {
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('securepass456', 10);

    await pool.query(`
      INSERT INTO users (username, password) VALUES
      ('alice', $1),
      ('bob', $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING id
    `, [hashedPassword1, hashedPassword2]);

    const userResult = await pool.query('SELECT id, username FROM users WHERE username IN ($1, $2)', ['alice', 'bob']);
    const users = userResult.rows;
    const aliceId = users.find(u => u.username === 'alice')?.id;
    const bobId = users.find(u => u.username === 'bob')?.id;

    if (!aliceId || !bobId) {
      throw new Error('Failed to retrieve user IDs');
    }

    // Seed Journal Entries
    await pool.query(`
      INSERT INTO journal_entries (user_id, entry_text, mood_rating, timestamp) VALUES
      ($1, 'Feeling optimistic today!', 5, '2025-05-28T10:00:00Z'),
      ($1, 'Had a tough day.', 3, '2025-05-28T18:00:00Z'),
      ($2, 'Great workout session!', 4, '2025-05-28T15:00:00Z')
      ON CONFLICT DO NOTHING
    `, [aliceId, bobId]);

    // Seed Contacts
    await pool.query(`
      INSERT INTO contacts (user_id, contact_name, contact_email) VALUES
      ($1, 'Charlie', 'charlie@example.com'),
      ($1, 'Dana', 'dana@example.com'),
      ($2, 'Eve', 'eve@example.com')
      ON CONFLICT DO NOTHING
    `, [aliceId, bobId]);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seedDatabase();