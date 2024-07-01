async function ping(context) {
 const startTime = new Date().getTime()
 const { key: messageKey } = await context.reply('*hmm...*')
 const endTime = new Date().getTime()
 const pingTime = endTime - startTime
 await context.send(`*pong!*\n*ʟᴀᴛᴇɴᴄʏ: ${pingTime} ᴍs*`, { edit: messageKey }, '', context)
}
module.exports = { ping }
