const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            role: user.role
        }
    });
};

exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password, avatar } = req.body;

    const user = await User.create({
        username,
        email,
        password,
        avatar: avatar || 'ti-user-bolt' 
    });

    // Token oluştur ve gönder
    sendTokenResponse(user, 201, res);
});

exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Email ve şifre kontrolü
    if (!email || !password) {
        return next(new ErrorResponse('Lütfen e-posta ve şifre girin', 400));
    }

    // Kullanıcıyı bul 
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Geçersiz e-posta veya şifre', 401));
    }

    // Şifre eşleşme kontrolü
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Geçersiz e-posta veya şifre', 401));
    }

    // Token oluştur ve gönder
    sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});