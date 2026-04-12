const mongoose = require('mongoose');

exports.isValidId = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ 
            success: false, 
            message: "The ID format you entered is not correct!" 
        });
    }
    next();
};

