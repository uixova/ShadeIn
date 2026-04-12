const mongoose = require('mongoose');

const connectDB = () => {
    return mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to DB!");
        })
        .catch((err) => {
            console.error("Failed to connect to DB!");
            console.log(err);
            process.exit(1);
        });
}

module.exports = connectDB;