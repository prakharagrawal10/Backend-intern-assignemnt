const cors = require('cors');
// Enable CORS for all routes


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
// Serve static frontend
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
const connectDB = require('./db');
connectDB();

// Models are now in models/


// Use routes
app.use('/employees', require('../routes/employeeRoutes'));
app.use('/leaves', require('../routes/leaveRoutes'));
app.use('/auth', require('../routes/authRoutes'));

// Default route
app.get('/', (req, res) => {
  res.send('Leave Management System API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
