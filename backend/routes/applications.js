const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');

// GET /api/applications - fetch all applications
router.get('/', async (req, res) => {
  try {
    const applications = await JobApplication.find().sort({ dateApplied: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/applications - create a new application
router.post('/', async (req, res) => {
  try {
    const newApplication = new JobApplication(req.body);
    const saved = await newApplication.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/applications/:id - update an application
router.put('/:id', async (req, res) => {
  try {
    const updated = await JobApplication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/applications/:id - delete an application
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await JobApplication.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
