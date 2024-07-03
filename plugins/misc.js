const { Index, prefix } = require('../lib')

Index(
 {
  pattern: 'readmore',
  desc: 'Creates a readmore Text Message.',
  type: 'misc',
 },
 async (message, text) => {
  try {
   text = text || message.reply_text
   if (!text) {
    text = '*Example:' + prefix + 'readmore text1 readmore text2*'
   } else {
    text += ' '
   }

   const readMoreChar = String.fromCharCode(8206).repeat(4001)
   const result = text.includes('readmore') ? text.replace(/readmore/, readMoreChar) : text.replace(' ', readMoreChar)

   await message.reply(result)
  } catch (error) {
   await message.error(`${error}\n\ncommand : readmore`, error, false)
  }
 }
)
