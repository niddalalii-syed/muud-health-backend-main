const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authenticate = require('../middlewares/auth.middleware'); 

// Add a contact
router.post('/add', authenticate, contactController.addContact);

// Get contacts for a user
router.get('/user/:id', authenticate, contactController.getContactsByUser);


module.exports = router;
