const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// On Vercel: filesystem is read-only except /tmp (ephemeral per cold start)
// On Heroku/local: persist in ./data/tasks.json
const IS_VERCEL = !!process.env.VERCEL;
const DATA_PATH = IS_VERCEL
  ? '/tmp/tasks.json'
  : path.join(__dirname, 'data', 'tasks.json');

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

/* ── helpers ── */
function readTasks() {
  try {
    if (!fs.existsSync(DATA_PATH)) return [];
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  } catch { return []; }
}

function writeTasks(tasks) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(tasks, null, 2), 'utf8');
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── API ── */
// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(readTasks());
});

// POST create task
app.post('/api/tasks', (req, res) => {
  const tasks = readTasks();
  const now = new Date().toISOString();
  const task = { ...req.body, id: uid(), createdAt: now, updatedAt: now };
  tasks.unshift(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

// PUT update task
app.put('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  tasks[idx] = { ...tasks[idx], ...req.body, id: req.params.id, updatedAt: new Date().toISOString() };
  writeTasks(tasks);
  res.json(tasks[idx]);
});

// PATCH status only (called by drag-and-drop)
app.patch('/api/tasks/:id/status', (req, res) => {
  const tasks = readTasks();
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const old = tasks[idx].status;
  tasks[idx].status = req.body.status;
  tasks[idx].updatedAt = new Date().toISOString();
  writeTasks(tasks);
  res.json({ task: tasks[idx], old });
});

// DELETE task
app.delete('/api/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const next = tasks.filter(t => t.id !== req.params.id);
  if (next.length === tasks.length) return res.status(404).json({ error: 'Not found' });
  writeTasks(next);
  res.json({ ok: true });
});

// Reorder tasks (drag within same column or full reorder)
app.post('/api/tasks/reorder', (req, res) => {
  writeTasks(req.body.tasks);
  res.json({ ok: true });
});

// Catch-all → frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✦ TaskFlow running → http://localhost:${PORT}`);
  console.log(`  Storage: ${DATA_PATH}`);
});
