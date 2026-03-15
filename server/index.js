import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data', 'deals.json');

const app = express();
app.use(cors());
app.use(express.json());

function readDeals() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeDeals(deals) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(deals, null, 2));
}

// GET /api/deals
app.get('/api/deals', (req, res) => {
  try {
    res.json(readDeals());
  } catch (err) {
    res.status(500).json({ error: 'Failed to read deals' });
  }
});

// POST /api/deals
app.post('/api/deals', (req, res) => {
  try {
    const deals = readDeals();
    const newDeal = {
      id: `deal-${randomUUID()}`,
      companyName: req.body.companyName || 'Unnamed Company',
      industry: req.body.industry || '',
      stage: req.body.stage || 'Sourced',
      location: req.body.location || '',
      annualRevenue: req.body.annualRevenue || null,
      ebitda: req.body.ebitda || null,
      askingPrice: req.body.askingPrice || null,
      description: req.body.description || '',
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    deals.push(newDeal);
    writeDeals(deals);
    res.status(201).json(newDeal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create deal' });
  }
});

// PUT /api/deals/:id
app.put('/api/deals/:id', (req, res) => {
  try {
    const deals = readDeals();
    const idx = deals.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Deal not found' });

    const { id, createdAt, notes, ...updates } = req.body;
    deals[idx] = {
      ...deals[idx],
      ...updates,
      id: deals[idx].id,
      notes: deals[idx].notes,
      createdAt: deals[idx].createdAt,
      updatedAt: new Date().toISOString(),
    };
    writeDeals(deals);
    res.json(deals[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update deal' });
  }
});

// DELETE /api/deals/:id
app.delete('/api/deals/:id', (req, res) => {
  try {
    const deals = readDeals();
    const idx = deals.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Deal not found' });

    deals.splice(idx, 1);
    writeDeals(deals);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete deal' });
  }
});

// POST /api/deals/:id/notes
app.post('/api/deals/:id/notes', (req, res) => {
  try {
    const deals = readDeals();
    const idx = deals.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Deal not found' });

    const note = {
      id: `note-${randomUUID()}`,
      content: req.body.content,
      timestamp: new Date().toISOString(),
    };
    deals[idx].notes.push(note);
    deals[idx].updatedAt = new Date().toISOString();
    writeDeals(deals);
    res.status(201).json(deals[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add note' });
  }
});

// DELETE /api/deals/:id/notes/:noteId
app.delete('/api/deals/:id/notes/:noteId', (req, res) => {
  try {
    const deals = readDeals();
    const idx = deals.findIndex(d => d.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Deal not found' });

    deals[idx].notes = deals[idx].notes.filter(n => n.id !== req.params.noteId);
    deals[idx].updatedAt = new Date().toISOString();
    writeDeals(deals);
    res.json(deals[idx]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SearchFlow API running on http://localhost:${PORT}`);
});
