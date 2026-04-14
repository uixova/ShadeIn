const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Lütfen itirafını yaz.'],
        minlength: [10, 'İtirafın çok kısa, biraz daha detay ver.'],
        maxlength: [500, 'İtirafın 500 karakter sınırını aşıyor.'] 
    },
    category: {
        type: String,
        enum: ['İtiraf', 'Sır', 'Komik', 'Pişmanlık', 'Aşk', 'Kariyer', 'Okul', 'Eğlence', 'Aile'],
        default: 'İtiraf'
    },
    reactions: {
        heart: { type: Number, default: 0 },
        laugh: { type: Number, default: 0 },
        fire: { type: Number, default: 0 },
        shock: { type: Number, default: 0 },
        sad: { type: Number, default: 0 },
        clap: { type: Number, default: 0 }
    },
    reactionDetails: [
        {
            user: { type: mongoose.Schema.ObjectId, ref: 'User' },
            type: { type: String }
        }
    ],
    views: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

confessionSchema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Confession', confessionSchema);