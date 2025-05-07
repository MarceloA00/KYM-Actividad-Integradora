const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/students');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb://mongodb:27017/studentsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Rutas
app.use('/api/students', studentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});