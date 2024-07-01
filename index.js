const path = require('path');
const bot = require(__dirname + '/lib/client');
const { VERSION } = require(__dirname + '/config');

const start = async () => {
    const currentDate = new Date().toLocaleDateString();
    
    try {
        await bot.init();
        bot.logger.info(`[${currentDate}] Initializing bot version ${VERSION}`);
        
        await new Promise((resolve) => {
            setTimeout(() => {
                bot.logger.debug('⏳ Performing preliminary checks...');
                resolve();
            }, 2000);
        });

        await new Promise((resolve, reject) => {
            bot.logger.debug('⌛️ Waiting for database syncing...');
            setTimeout(() => {
                try {
                    bot.DATABASE.sync();
                    bot.logger.info('✅ Database synced successfully!');
                    resolve();
                } catch (error) {
                    bot.logger.error('❌ Database sync failed:', error);
                    reject(error);
                }
            }, 3000);
        });

        await new Promise((resolve, reject) => {
            bot.logger.debug('🔌 Connecting to bot services...');
            setTimeout(() => {
                try {
                    bot.connect();
                    bot.logger.info('🚀 Bot connected!');
                    resolve();
                } catch (error) {
                    bot.logger.error('❌ Connection to bot failed:', error);
                    reject(error);
                }
            }, 4000);
        });

    } catch (error) {
        bot.logger.error('⚠️ Error during initialization:', error);
        start();
    }
};

start();