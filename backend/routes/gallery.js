const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Gallery = require('../models/Gallery');

// @route   GET /api/gallery
// @desc    Get all gallery categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const galleries = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json({
      success: true,
      count: galleries.length,
      data: galleries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   GET /api/gallery/:id
// @desc    Get single gallery category
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery category not found'
      });
    }
    
    res.json({
      success: true,
      data: gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   POST /api/gallery
// @desc    Create new gallery category
// @access  Public (should be protected with auth in production)
router.post('/',
  [
    body('category').trim().notEmpty().withMessage('Category name is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    try {
      const gallery = await Gallery.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Gallery category created successfully',
        data: gallery
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Category already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/gallery/:id
// @desc    Update gallery category
// @access  Public (should be protected with auth in production)
router.put('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Gallery category updated successfully',
      data: gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery category
// @access  Public (should be protected with auth in production)
router.delete('/:id', async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Gallery category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   POST /api/gallery/:id/images
// @desc    Add image to gallery category
// @access  Public (should be protected with auth in production)
router.post('/:id/images', async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery category not found'
      });
    }
    
    gallery.images.push(req.body);
    await gallery.save();
    
    res.json({
      success: true,
      message: 'Image added successfully',
      data: gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

module.exports = router;
