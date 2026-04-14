const express = require("express");
const router = express.Router();
const Confession = require('../models/Confession');
const advancedResults = require('../middlewares/advancedResults');

const { 
    getAllConfessions, 
    getConfessionById, 
    createConfession,
    deleteConfession,    
    addReaction,
} = require('../controllers/contentController');

const { isValidId } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');

router.route('/')
    .get(advancedResults(Confession, { path: 'user', select: 'name email' }), getAllConfessions)
    .post(protect, createConfession);

router.route('/:id')
    .get(isValidId, getConfessionById)
    .delete(isValidId, protect, deleteConfession);

router.route('/:id/react').post(protect, addReaction);


module.exports = router;