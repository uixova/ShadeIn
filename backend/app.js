require('dotenv').config({ path: './config/.env' });
const express = require("express");
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const confessionRoutes = require('./routes/confessionRoutes');
const errorHandler = require('./middlewares/error');

const app = express();

const allowedOrigins = [
    'http://localhost:5173', 
    process.env.CLIENT_URL   
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`ENGELLEDİĞİM ORIGIN: ${origin}`); 
            callback(new Error('CORS engeline takıldınız!'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, 
    crossOriginEmbedderPolicy: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 500, 
    message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin.'
});
app.use('/api', limiter);

app.use(hpp());

app.use('/api/auth', authRoutes);
app.use('/api/confessions', confessionRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server ${process.env.NODE_ENV} modunda, port ${PORT} üzerinde çalışıyor.`);
        console.log(`İzin verilen Client: ${process.env.CLIENT_URL}`);
    });
});