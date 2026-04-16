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
    reportConfession,
    getAdminContent,
    updateConfession,    
    hardDeleteConfession
} = require('../controllers/contentController');

const { isValidId } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/auth');

router.route('/')
    .get(advancedResults(Confession, { path: 'user', select: 'username avatar' }, { isDeleted: false }), getAllConfessions)
    .post(protect, createConfession);

router.route('/:id')
    .get(isValidId, protect, getConfessionById)
    .delete(isValidId, protect, deleteConfession) 
    .patch(isValidId, protect, updateConfession);

router.route('/:id/report').post(protect, reportConfession);
router.route('/:id/react').post(protect, addReaction);

router.get('/admin/all', protect, authorize('admin'), getAdminContent);

router.delete('/:id/hard-delete', isValidId, protect, authorize('admin'), hardDeleteConfession);

module.exports = router;