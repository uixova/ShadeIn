const cron = require('node-cron');
const Confession = require('../models/Confession');

cron.schedule('* * * * *', async () => {
    try {
        const simdi = new Date();
        
        const result = await Confession.updateMany(
            { 
                expiresAt: { $lt: simdi }, 
                isDeleted: false 
            },
            { 
                $set: { 
                    isDeleted: true, 
                    deletedAt: simdi 
                } 
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`[ShadeIn-Guard]: ${result.modifiedCount} itirafın süresi doldu ve arşive çekildi.`);
        }
    } catch (err) {
        console.error('Cron Hatası:', err);
    }
});