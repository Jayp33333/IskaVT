import express from 'express';
import Logbook from '../models/Logbook.js';

const router = express.Router();

// POST /api/logbook - Create a new logbook entry
router.post('/', async (req, res) => {
  try {
    const { fullName, visitorType, purpose, destination, date, timeIn, timeOut } = req.body;

    // Validate required fields
    if (!fullName || !visitorType || !purpose || !destination) {
      return res.status(400).json({ 
        error: 'Missing required fields: fullName, visitorType, purpose, and destination are required' 
      });
    }

    // Create logbook entry
    const logbookEntry = new Logbook({
      fullName,
      visitorType,
      purpose,
      destination,
      date: date ? new Date(date) : new Date(),
      timeIn: timeIn ? new Date(timeIn) : new Date(),
      timeOut: timeOut ? new Date(timeOut) : null
    });

    const savedEntry = await logbookEntry.save();
    
    res.status(201).json({
      success: true,
      message: 'Logbook entry created successfully',
      data: savedEntry
    });
  } catch (error) {
    console.error('Error creating logbook entry:', error);
    res.status(500).json({ 
      error: 'Failed to create logbook entry',
      message: error.message 
    });
  }
});

// GET /api/logbook - Get all logbook entries
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, sortBy = '-createdAt' } = req.query;
    
    const entries = await Logbook.find()
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Logbook.countDocuments();

    res.json({
      success: true,
      data: entries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching logbook entries:', error);
    res.status(500).json({ 
      error: 'Failed to fetch logbook entries',
      message: error.message 
    });
  }
});

// GET /api/logbook/:id - Get a specific logbook entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await Logbook.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Logbook entry not found' });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Error fetching logbook entry:', error);
    res.status(500).json({ 
      error: 'Failed to fetch logbook entry',
      message: error.message 
    });
  }
});

// PATCH /api/logbook/:id/timeout - Update time out for an entry
router.patch('/:id/timeout', async (req, res) => {
  try {
    const entry = await Logbook.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Logbook entry not found' });
    }

    entry.timeOut = new Date();
    const updatedEntry = await entry.save();

    res.json({
      success: true,
      message: 'Time out updated successfully',
      data: updatedEntry
    });
  } catch (error) {
    console.error('Error updating time out:', error);
    res.status(500).json({ 
      error: 'Failed to update time out',
      message: error.message 
    });
  }
});

export default router;
