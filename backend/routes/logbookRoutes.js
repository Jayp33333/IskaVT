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

// GET /api/logbook/stats/summary - Get high-level stats for admin dashboard
router.get('/stats/summary', async (req, res) => {
  try {
    const now = new Date();

    // Today
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    // This week (starting Monday)
    const startOfWeek = new Date(startOfToday);
    const day = startOfWeek.getDay(); // 0 (Sun) - 6 (Sat)
    const diffToMonday = (day + 6) % 7; // 0 if Monday, 1 if Tuesday, ... 6 if Sunday
    startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);

    // This month
    const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

    const [
      todayCount,
      weekCount,
      monthCount,
      destinationAgg,
      timelineAgg,
      visitorTypeAgg,
      hourAgg,
      dowAgg,
      durationAgg,
    ] = await Promise.all([
      Logbook.countDocuments({ timeIn: { $gte: startOfToday } }),
      Logbook.countDocuments({ timeIn: { $gte: startOfWeek } }),
      Logbook.countDocuments({ timeIn: { $gte: startOfMonth } }),
      Logbook.aggregate([
        {
          $group: {
            _id: '$destination',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      // Last 30 days timeline (by day)
      (async () => {
        const startRange = new Date(startOfToday);
        startRange.setDate(startRange.getDate() - 29); // include today = 30 days

        const raw = await Logbook.aggregate([
          {
            $match: {
              timeIn: { $gte: startRange },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$timeIn' },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);

        return raw;
      })(),
      // Visitor type breakdown (all time)
      Logbook.aggregate([
        {
          $group: {
            _id: '$visitorType',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),
      // Visits by hour of day (last 30 days)
      Logbook.aggregate([
        {
          $match: {
            timeIn: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $hour: '$timeIn' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Visits by day of week (1=Sunday..7=Saturday, last 30 days)
      Logbook.aggregate([
        {
          $match: {
            timeIn: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: '$timeIn' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      // Duration analytics (last 30 days, completed sessions only)
      Logbook.aggregate([
        {
          $match: {
            timeIn: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) },
            timeOut: { $ne: null },
          },
        },
        {
          $project: {
            durationMinutes: {
              $divide: [{ $subtract: ['$timeOut', '$timeIn'] }, 60000],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgDurationMinutes: { $avg: '$durationMinutes' },
            bucket_0_15: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ['$durationMinutes', 0] }, { $lt: ['$durationMinutes', 15] }] },
                  1,
                  0,
                ],
              },
            },
            bucket_15_30: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ['$durationMinutes', 15] }, { $lt: ['$durationMinutes', 30] }] },
                  1,
                  0,
                ],
              },
            },
            bucket_30_60: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ['$durationMinutes', 30] }, { $lt: ['$durationMinutes', 60] }] },
                  1,
                  0,
                ],
              },
            },
            bucket_60_plus: {
              $sum: {
                $cond: [{ $gte: ['$durationMinutes', 60] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    const visitsPerDestination = destinationAgg.map((d) => ({
      destination: d._id || 'Unknown',
      count: d.count,
    }));

    const visitsTimeline = timelineAgg.map((d) => ({
      date: d._id,
      count: d.count,
    }));

    const visitsByVisitorType = visitorTypeAgg.map((d) => ({
      visitorType: d._id || 'Unknown',
      count: d.count,
    }));

    const visitsByHour = hourAgg.map((d) => ({
      hour: d._id,
      count: d.count,
    }));

    const visitsByDayOfWeek = dowAgg.map((d) => ({
      day: d._id,
      count: d.count,
    }));

    const durationStats =
      durationAgg && durationAgg.length
        ? {
            avgDurationMinutes: durationAgg[0].avgDurationMinutes || 0,
            durationBuckets: [
              { label: '0-15m', count: durationAgg[0].bucket_0_15 || 0 },
              { label: '15-30m', count: durationAgg[0].bucket_15_30 || 0 },
              { label: '30-60m', count: durationAgg[0].bucket_30_60 || 0 },
              { label: '60m+', count: durationAgg[0].bucket_60_plus || 0 },
            ],
          }
        : {
            avgDurationMinutes: 0,
            durationBuckets: [
              { label: '0-15m', count: 0 },
              { label: '15-30m', count: 0 },
              { label: '30-60m', count: 0 },
              { label: '60m+', count: 0 },
            ],
          };

    res.json({
      success: true,
      data: {
        todayCount,
        weekCount,
        monthCount,
        visitsPerDestination,
        visitsTimeline,
        visitsByVisitorType,
        visitsByHour,
        visitsByDayOfWeek,
        avgDurationMinutes: durationStats.avgDurationMinutes,
        durationBuckets: durationStats.durationBuckets,
      },
    });
  } catch (error) {
    console.error('Error fetching logbook stats:', error);
    res.status(500).json({
      error: 'Failed to fetch logbook stats',
      message: error.message,
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

// PATCH /api/logbook/:id - Update a logbook entry (admin edit)
router.patch('/:id', async (req, res) => {
  try {
    const entry = await Logbook.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: 'Logbook entry not found' });
    }

    const {
      fullName,
      visitorType,
      purpose,
      destination,
      date,
      timeIn,
      timeOut,
    } = req.body || {};

    // Only update fields that are provided
    if (fullName !== undefined) {
      if (!String(fullName).trim()) return res.status(400).json({ error: 'Full name is required' });
      entry.fullName = String(fullName).trim();
    }
    if (visitorType !== undefined) {
      if (!String(visitorType).trim()) return res.status(400).json({ error: 'Visitor type is required' });
      entry.visitorType = String(visitorType).trim();
    }
    if (purpose !== undefined) {
      if (!String(purpose).trim()) return res.status(400).json({ error: 'Purpose is required' });
      entry.purpose = String(purpose).trim();
    }
    if (destination !== undefined) {
      if (!String(destination).trim()) return res.status(400).json({ error: 'Destination is required' });
      entry.destination = String(destination).trim();
    }

    if (date !== undefined) {
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return res.status(400).json({ error: 'Invalid date' });
      entry.date = parsed;
    }
    if (timeIn !== undefined) {
      const parsed = new Date(timeIn);
      if (Number.isNaN(parsed.getTime())) return res.status(400).json({ error: 'Invalid timeIn' });
      entry.timeIn = parsed;
    }
    if (timeOut !== undefined) {
      if (timeOut === null || timeOut === '') {
        entry.timeOut = null;
      } else {
        const parsed = new Date(timeOut);
        if (Number.isNaN(parsed.getTime())) return res.status(400).json({ error: 'Invalid timeOut' });
        entry.timeOut = parsed;
      }
    }

    const updated = await entry.save();

    res.json({
      success: true,
      message: 'Logbook entry updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating logbook entry:', error);
    res.status(500).json({
      error: 'Failed to update logbook entry',
      message: error.message,
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

// DELETE /api/logbook/:id - Delete a logbook entry (admin delete)
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Logbook.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ error: 'Logbook entry not found' });
    }

    res.json({
      success: true,
      message: 'Logbook entry deleted successfully',
      data: entry,
    });
  } catch (error) {
    console.error('Error deleting logbook entry:', error);
    res.status(500).json({
      error: 'Failed to delete logbook entry',
      message: error.message,
    });
  }
});

export default router;
