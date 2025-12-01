const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Membership = require('../models/Membership');

// @route   GET /api/memberships
// @desc    Get all membership applications
// @access  Public (should be protected with auth in production)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const memberships = await Membership.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: memberships.length,
      data: memberships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   GET /api/memberships/:id
// @desc    Get single membership application
// @access  Public (should be protected with auth in production)
router.get('/:id', async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership application not found'
      });
    }
    
    res.json({
      success: true,
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   POST /api/memberships
// @desc    Submit membership application
// @access  Public
router.post('/',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('membershipType').isIn(['individual', 'family', 'student', 'senior'])
      .withMessage('Valid membership type is required'),
    body('consent').equals('true').withMessage('Consent is required')
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
      const membership = await Membership.create(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Membership application submitted successfully',
        data: membership
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  }
);

// @route   PUT /api/memberships/:id
// @desc    Update membership status
// @access  Public (should be protected with auth in production)
router.put('/:id', async (req, res) => {
  try {
    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Membership application updated successfully',
      data: membership
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// @route   DELETE /api/memberships/:id
// @desc    Delete membership application
// @access  Public (should be protected with auth in production)
router.delete('/:id', async (req, res) => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);
    
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: 'Membership application not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Membership application deleted successfully'
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
