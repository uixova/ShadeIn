const express = require("express");
const router = express.Router();
const Blog = require('../models/Blog');
const advancedResults = require('../middlewares/advancedResults');

const { 
    getAllBlogs, 
    getBlogById, 
    createBlog,
    deleteBlog,    
    updateBlog,    
    blogPhotoUpload 
} = require('../controllers/blogController');

const { isValidId } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');

router.route('/')
    .get(advancedResults(Blog, { path: 'user', select: 'name email' }), getAllBlogs)
    .post(protect, createBlog);

router.route('/:id')
    .get(isValidId, getBlogById)
    .put(isValidId, protect, updateBlog)
    .delete(isValidId, protect, deleteBlog);

router.put('/:id/photo', isValidId, protect, blogPhotoUpload);

module.exports = router;