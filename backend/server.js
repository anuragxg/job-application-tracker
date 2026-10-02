// DNS workaround: some networks block the SRV lookups mongodb+srv:// needs.
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const applicationsRouter = require('./routes/applications');
const authRouter = require('./routes/auth');

const app = express();

// In development FRONTEND_URL is unset, so CORS allows any origin (easy local testing).
// In production, set FRONTEND_URL to your deployed frontend's exact URL so only
// your own site can call this API — not literally anyone on the internet.
const corsOptions = process.env.FRONTEND_URL
  ? { origin: process.env.FRONTEND_URL }
  : {};
app.use(cors(corsOptions));

app.use(express.json());

// A plain health-check route. Hosting platforms (Render, Railway, etc.) and
// uptime monitors ping "/" to confirm the server is alive — without this,
// hitting the bare URL just shows "Cannot GET /".
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Job Application Tracker API is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/applications', applicationsRouter);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
