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
    expiresAt: {
        type: Date,
        required: [true, 'Lütfen bir bitiş süresi belirle']
    },
    reportDetails: [
        {
            user: { type: mongoose.Schema.ObjectId, ref: 'User' },
            reason: { type: String, required: true },
            description: { type: String }, 
            at: { type: Date, default: Date.now }
        }
    ],
    reportCount: {
        type: Number,
        default: 0
    },
    viewDetails: [
        {
            user: { type: mongoose.Schema.ObjectId, ref: 'User' },
            at: { type: Date, default: Date.now }
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
    isDeleted: {
        type: Boolean,
        default: false 
    },
    deletedAt: {
        type: Date,
        default: null 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

module.exports = mongoose.model('Confession', confessionSchema);