const Blog = require('../models/Confession');
const path = require('path');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getAllBlogs = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.createBlog = asyncHandler(async(req, res, next) => { 
    req.body.user = req.user.id;
    const blog = await Blog.create(req.body);

    res.status(201).json({
        success: true,
        data: blog
    });
});

exports.blogPhotoUpload = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new ErrorResponse(`Blog not found with ${req.params.id} ID`, 404));
    }

    if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('You are not authorized to do so', 401));
    }

    if (!req.files) {
        return next(new ErrorResponse('Please select a file', 400));
    }

    const file = req.files.file;

    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please just upload image file', 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse('Please upload an image less than 3MB', 400));
    }

    file.name = `photo_${blog._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse('Error moving file', 500));
        }

        await Blog.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        });
    });
});

exports.getBlogById = asyncHandler(async(req, res, next) => {
    const blog = await Blog.findById(req.params.id).populate({
        path: 'user',
        select: 'name email'
    });

    if (!blog) {
        return next(new ErrorResponse(`Blog not found with ${req.params.id} ID`, 404));
    }

    res.status(200).json({ success: true, data: blog });
});

exports.deleteBlog = asyncHandler(async(req, res, next) => {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(new ErrorResponse("No blog found to delete!", 404));
    }

    if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('You are not authorized to do so', 401));
    }

    await blog.deleteOne();

    res.status(200).json({ success: true, message: "Blog successfully deleted!", data: blog });
});

exports.updateBlog = asyncHandler(async(req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!blog) {
        return next(new ErrorResponse("No blog found to update!", 404));
    }

    if (blog.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('You are not authorized to do so', 401));
    }

    res.status(200).json({
        success: true,
        message: "Blog updated successfully!",
        data: blog 
    });
});