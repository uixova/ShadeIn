const Confession = require('../models/Confession');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getAllConfessions = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.createConfession = asyncHandler(async(req, res, next) => { 
    req.body.user = req.user.id;

    if (req.body.expiresAt) {
        req.body.expiresAt = new Date(req.body.expiresAt);
    } else {
        const hours = req.body.expireHours || 24; 
        const targetDate = new Date();
        targetDate.setHours(targetDate.getHours() + hours);
        req.body.expiresAt = targetDate; 
    }

    const confession = await Confession.create(req.body);

    res.status(201).json({
        success: true,
        data: confession
    });
});

exports.getConfessionById = asyncHandler(async (req, res, next) => {
    const userId = req.user ? req.user.id : null;

    let confession = await Confession.findOne({ 
        _id: req.params.id, 
        isDeleted: false 
    }).populate({
        path: 'user',
        select: 'username avatar' 
    });

    if (!confession) {
        return next(new ErrorResponse(`İtiraf bulunamadı veya kaldırılmış.`, 404));
    }

    if (!confession.viewDetails) {
        confession.viewDetails = [];
    }

    if (userId) {
        const hasViewed = confession.viewDetails.some(
            v => v.user && v.user.toString() === userId.toString()
        );

        if (!hasViewed) {
            confession = await Confession.findByIdAndUpdate(
                req.params.id,
                { 
                    $push: { viewDetails: { user: userId } },
                    $inc: { views: 1 } 
                },
                { returnDocument: 'after', runValidators: false }
            ).populate({
                path: 'user',
                select: 'username avatar'
            });
        }
    }

    res.status(200).json({ success: true, data: confession });
});

// REAKSİYON EKLEME 
exports.addReaction = asyncHandler(async (req, res, next) => {
    const { reactionType } = req.body;
    const userId = req.user.id;
    const allowedReactions = ['heart', 'laugh', 'fire', 'shock', 'sad', 'clap'];

    if (!allowedReactions.includes(reactionType)) {
        return next(new ErrorResponse('Geçersiz tepki tipi', 400));
    }

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
        return next(new ErrorResponse('İtiraf bulunamadı', 404));
    }

    const existingIndex = confession.reactionDetails.findIndex(
        r => r.user.toString() === userId
    );

    if (existingIndex !== -1) {
        const oldType = confession.reactionDetails[existingIndex].type;

        if (oldType === reactionType) {
            // AYNI TEPKİ: Reaksiyonu kaldır
            confession.reactions[oldType] = Math.max(0, confession.reactions[oldType] - 1);
            confession.reactionDetails.splice(existingIndex, 1);
        } else {
            // FARKLI TEPKİ: Eskiyi düş, yeniyi arttır
            confession.reactions[oldType] = Math.max(0, confession.reactions[oldType] - 1);
            confession.reactions[reactionType] += 1;
            confession.reactionDetails[existingIndex].type = reactionType;
        }
    } else {
        // İLK TEPKİ: Direkt ekle
        confession.reactions[reactionType] += 1;
        confession.reactionDetails.push({ user: userId, type: reactionType });
    }

    await confession.save();

    res.status(200).json({ 
        success: true, 
        data: confession.reactions,
        userReaction: reactionType 
    });
});

exports.deleteConfession = asyncHandler(async(req, res, next) => {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
        return next(new ErrorResponse("İtiraf bulunamadı!", 404));
    }

    if (confession.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Bu işlem için yetkiniz yok', 401));
    }

    confession.isDeleted = true;
    confession.deletedAt = Date.now();
    await confession.save();

    res.status(200).json({ success: true, message: "İtiraf arşivlendi (ekrandan kaldırıldı)!" });
});

exports.getAdminContent = asyncHandler(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new ErrorResponse('Yetkisiz Erişim', 403));
    }

    const content = await Confession.find({
        $or: [
            { reportCount: { $gt: 0 } },
            { isDeleted: true }
        ]
    }).sort('-createdAt').populate({
        path: 'user',
        select: 'username avatar'
    });

    res.status(200).json({
        success: true,
        data: content
    });
});

exports.updateConfession = asyncHandler(async (req, res, next) => {
    let confession = await Confession.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: 'after',
        runValidators: true
    });
    res.status(200).json({ success: true, data: confession });
});

exports.hardDeleteConfession = asyncHandler(async (req, res, next) => {
    await Confession.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
});

exports.reportConfession = asyncHandler(async (req, res, next) => {
    const { reason, description } = req.body; 
    const userId = req.user.id;
    const reportLimit = 15; 

    const confession = await Confession.findById(req.params.id);

    if (!confession) {
        return next(new ErrorResponse('İtiraf bulunamadı', 404));
    }

    const alreadyReported = confession.reportDetails.some(
        r => r.user.toString() === userId.toString()
    );

    if (alreadyReported) {
        return next(new ErrorResponse('Bu içeriği zaten şikayet ettiniz.', 400));
    }

    confession.reportDetails.push({ 
        user: userId, 
        reason, 
        description 
    });
    
    confession.reportCount += 1;

    if (confession.reportCount >= reportLimit) {
        confession.isDeleted = true;
        confession.deletedAt = Date.now();
    }

    await confession.save();

    res.status(200).json({ 
        success: true, 
        message: confession.isDeleted 
            ? 'İçerik çok fazla şikayet aldığı için incelemeye alındı.' 
            : 'Şikayetiniz iletildi.' 
    });
});