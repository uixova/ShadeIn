const User = require('../models/User');
const crypto = require('crypto');
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

exports.updateDetails = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    
    if (req.body.password) {
        user.password = req.body.password; 
    }

    await user.save(); 

    res.status(200).json({ success: true, data: user });
});

exports.deleteMe = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ success: true, data: {} });
});

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse('Bu e-posta adresine ait bir hesap bulunamadı.', 404));
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: "Sıfırlama bağlantısı oluşturuldu.",
        resetToken 
    });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = req.params.resettoken;

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Geçersiz veya süresi dolmuş bağlantı', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpire = undefined; 
    await user.save();

    sendTokenResponse(user, 200, res);
});

exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});