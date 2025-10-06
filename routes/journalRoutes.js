const express = require('express');
const router = express.Router();
const journalController = require('../controllers/journalController');
const authenticate = require('../middlewares/auth.middleware');

router.post('/entry', authenticate, journalController.createEntry);
router.get('/user', authenticate, journalController.getEntriesByUser);


module.exports = router;
