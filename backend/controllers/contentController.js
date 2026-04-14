const Confession = require('../models/Confession');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

exports.getAllConfessions = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

exports.createConfession = asyncHandler(async(req, res, next) => { 
    req.body.user = req.user.id;
    const confession = await Confession.create(req.body);

    res.status(201).json({
        success: true,
        data: confession
    });
});

exports.getConfessionById = asyncHandler(async(req, res, next) => {
    const confession = await Confession.findById(req.params.id).populate({
        path: 'user',
        select: 'name email'
    });

    if (!confession) {
        return next(new ErrorResponse(`İtiraf bulunamadı: ${req.params.id}`, 404));
    }

    // Görüntülenme sayısını otomatik arttır 
    confession.views += 1;
    await confession.save();

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
        return next(new ErrorResponse("Silinecek itiraf bulunamadı!", 404));
    }

    if (confession.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse('Bu işlem için yetkiniz yok', 401));
    }

    await confession.deleteOne();

    res.status(200).json({ success: true, message: "İtiraf silindi!" });
});