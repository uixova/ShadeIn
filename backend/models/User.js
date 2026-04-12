const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a title']
    },
    email: {
        type: String,
        required: [true, 'Please enter a email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please set a password'],
        minlength: [6, 'Password content must be at least 6 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    };

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};



module.exports = mongoose.model('User', UserSchema);