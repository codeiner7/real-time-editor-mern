const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    const newDocument = new Document({ title, owner: req.user.id });
    await newDocument.save();
    res.status(201).json(newDocument);
  } catch (error) {
    res.status(500).json({ error: 'Error creating document' });
  }
});

router.get('/list', authMiddleware, async (req, res) => {
    try {
      const documents = await Document.find().sort({ createdAt: -1 });
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching documents' });
    }
  });

router.get('/:id', authMiddleware, async (req, res) => {
    try {
      const document = await Document.findById(req.params.id);
      if (!document) return res.status(404).json({ error: 'Document not found' });
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching document' });
    }
  });
  
  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { content } = req.body;
      const document = await Document.findByIdAndUpdate(req.params.id, { content }, { new: true });
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: 'Error updating document' });
    }
  });
  

module.exports = router;
