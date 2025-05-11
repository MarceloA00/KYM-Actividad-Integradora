const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoutes = require('./routes/students');

const app = express();
app.use(cors({
    origin: [
        'http://student-crud-frontend',
        'http://localhost:30080',
        'http://127.0.0.1:30080',
        /\.minikube\.local$/,
        /^http:\/\/192\.168\.\d+\.\d+:\d+$/
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
app.use(express.json());


if (process.env.NODE_ENV !== 'test' && mongoose.connection.readyState === 0) {
mongoose.connect('mongodb://admin:password@student-crud-mongodb:27017/studentsdb?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}
app.use('/api/students', studentRoutes);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

if (process.env.NODE_ENV !== 'test') {
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
}

module.exports = app;