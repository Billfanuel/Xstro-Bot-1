const { Index, prefix } = require('../lib')
const fs = require('fs-extra');
const util = require('util');
Index(
 {
  pattern: 'readmore',
  desc: 'Creates a readmore Text Message.',
  category: 'misc',
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
Index(
 {
  pattern: 'calc',
  desc: 'calculate an equation.',
  category: 'misc',
 },
 async (message, equation) => {
  try {
   if (!equation) {
    return await message.reply('*Please enter a math operation*\n*Example: .calc 22+12*')
   }

   const sanitizedEquation = equation.replace(/\s+/g, '')
   const validEquationRegex = /^(\d+([-+%*/]\d+)+)$/

   if (!validEquationRegex.test(sanitizedEquation)) {
    return await message.reply('Please enter a valid mathematical operation.')
   }

   const calculateResult = expr => {
    return new Function('return ' + expr)()
   }

   if (sanitizedEquation.includes('/') && sanitizedEquation.split('/').some(part => part === '0')) {
    return message.reply('Cannot divide by zero.')
   }

   const result = calculateResult(sanitizedEquation)

   if (sanitizedEquation.split(/[-+%*/]/).length <= 2) {
    const [operand1, operator, operand2] = sanitizedEquation.match(/\d+|[-+%*/]/g)
    return await message.reply(`${operand1} ${operator} ${operand2} = ${result}`)
   } else {
    return await message.reply(`Result: ${result}`)
   }
  } catch (error) {
   return await message.error(`${error}\n\ncommand: calc`, error)
  }
 }
)
const ALLOWED_MEDIA_TYPES = ["videoMessage", "imageMessage"];

const createMediaUrl = async (message, urlCreator) => {
  try {
    const mediaMessage = ALLOWED_MEDIA_TYPES.includes(message.mtype) ? message : message.reply_message;

    if (!mediaMessage || !ALLOWED_MEDIA_TYPES.includes(mediaMessage?.mtype)) {
      return message.reply("*_Please reply to an image or video!_*");
    }

    const mediaPath = await message.bot.downloadAndSaveMediaMessage(mediaMessage);
    const urlResult = await urlCreator(mediaPath);

    try {
      fs.unlinkSync(mediaPath);
    } catch (unlinkError) {
      console.error("Failed to delete temporary file:", unlinkError);
    }

    if (!urlResult) {
      return message.reply("*_Failed to create URL!_*");
    }

    await message.send(util.format(urlResult), {}, "asta", mediaMessage);
  } catch (error) {
    await message.error(`${error}\n\ncommand: ${message.body}`, error);
  }
};

Index({
  pattern: "url",
  category: "misc",
  filename: __filename,
  desc: "Convert image or video to URL.",
}, async (message) => {
  await createMediaUrl(message, createUrl);
});

Index({
  pattern: "upload", 
  category: "misc", 
  desc: "Upload image or video and get URL.",
}, async (message) => {
  await createMediaUrl(message, (path) => createUrl(path, "uguMashi"));
});