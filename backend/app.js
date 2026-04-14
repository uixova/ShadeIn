require('dotenv').config({ path: './config/.env' });
const cors = require('cors');
const connectDB = require('./config/db');
const express = require("express");
const app = express();
const confessionRoutes = require('./routes/confessionRoutes');
const errorHandler = require('./middlewares/error');
const authRoutes = require('./routes/authRoutes');
const path = require('path');


const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet({
    crossOriginResourcePolicy: false, 
}));

// MongoDB Injection Koruması
// app.use(mongoSanitize());  // bu middleware injectionu önlesede sistemde büyük bir soruna yol açıyordu şimdilik devre dışı kalıcak

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100
});
app.use(limiter);

app.use(hpp());

app.use('/api/confessions', confessionRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT} with professional structure!`);
    });
});