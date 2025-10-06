const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// ✅ Parse incoming JSON
app.use(express.json());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/journal', require('./routes/journalRoutes'));
app.use('/contacts', require('./routes/contactRoutes'));

app.get('/', (req, res) => {
  res.send('MUUD Health API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
