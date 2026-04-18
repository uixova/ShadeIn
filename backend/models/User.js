const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Lütfen bir kullanıcı adı belirle'],
        unique: true,
        trim: true,
        maxlength: [20, 'Kullanıcı adı 20 karakteri geçemez']
    },
    email: {
        type: String,
        required: [true, 'Lütfen bir e-posta adresi gir'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Lütfen geçerli bir e-posta adresi gir'
        ]
    },
    password: {
        type: String,
        required: [true, 'Lütfen bir şifre belirle'],
        minlength: [6, 'Şifre en az 6 karakter olmalı'],
        select: false, 
    },
    avatar: {
        type: String,
        default: 'ti-user-bolt'
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// password hashing
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Şifre karşılaştırma 
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// JWT Token oluşturma 
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

module.exports = mongoose.model('User', UserSchema);