const axios = require('axios')
const fs = require('fs-extra')
const { StickerTypes } = require('wa-sticker-formatter')
const fetch = require('node-fetch')
const { getBuffer, prefix, Index, TelegraPh, Config, generateSticker } = require('../lib')

const mediaTypes = ['imageMessage', 'videoMessage', 'stickerMessage']

Index(
 {
  pattern: 'sticker',
  info: 'Creates a sticker from a replied image/video.',
  type: 'sticker',
 },
 async message => {
  try {
   let mediaMessage = mediaTypes.includes(message.mtype) ? message : message.reply_message
   if (mediaMessage && mediaTypes.includes(mediaMessage?.mtype || 'need_Media')) {
    let mediaBuffer = await mediaMessage.download()
    let stickerOptions = {
     pack: Config.packname,
     author: Config.author,
     type: StickerTypes.FULL,
     quality: 10,
    }
    await generateSticker(message, mediaBuffer, stickerOptions)
    return (mediaBuffer = false)
   } else {
    return message.reply('*Reply Image/Video.*')
   }
  } catch (error) {
   return await message.error(error + '\n\ncmdName: sticker\n')
  }
 }
)

Index(
 {
  pattern: 'take',
  info: 'Creates a sticker from a replied image/video.',
  type: 'sticker',
 },
 async (message, text) => {
  try {
   let replyMessage = message.reply_message
   if (!replyMessage || replyMessage?.mtype != 'stickerMessage') {
    return await message.reply('*Reply A Sticker.*')
   }
   let textParts = text.split('|')
   let packName = textParts[0]?.trim() !== '' ? textParts[0] : message.pushName
   let authorName = textParts[1] && textParts[1] !== '' ? textParts[1] : 'ᴀsᴛᴀ-ᴍᴅ ♥️'
   let mediaBuffer = await replyMessage.download()
   let stickerOptions = {
    pack: packName,
    author: authorName,
    type: StickerTypes.FULL,
    quality: 10,
   }
   await generateSticker(message, mediaBuffer, stickerOptions)
   return (mediaBuffer = false)
  } catch (error) {
   return await message.error(error + '\n\ncmdName: take\n')
  }
 }
)

Index(
 {
  pattern: 'attp',
  info: 'Creates a sticker from the given text.',
  type: 'sticker',
 },
 async (message, text) => {
  try {
   let buffer = await getBuffer(
    'https://raganork-api.onrender.com/api/attp?text=' +
     (text ? text : 'Please provide text to generate sticker') +
     '&apikey=with_love_souravkl11'
   )
   return await generateSticker(message, buffer)
  } catch (error) {
   return await message.error(error + '\n\ncmdName: attp\n')
  }
 }
)

Index(
 {
  pattern: 'crop',
  info: 'Creates a cropped sticker from a replied image.',
  type: 'sticker',
 },
 async message => {
  try {
   let mediaMessage = mediaTypes.includes(message.mtype) ? message : message.reply_message
   if (mediaMessage && mediaTypes.includes(mediaMessage?.mtype || 'need_Media')) {
    let mediaBuffer = await mediaMessage.download()
    let stickerOptions = {
     pack: Config.packname,
     author: Config.author,
     type: StickerTypes.CROPPED,
     quality: 50,
    }
    await generateSticker(message, mediaBuffer, stickerOptions)
    return (mediaBuffer = false)
   } else {
    return message.reply('*Reply An Image.*')
   }
  } catch (error) {
   return await message.error(error + '\n\ncmdName: crop\n', '*_Request Failed, Reply to an image only!_*')
  }
 }
)

Index(
 {
  cmdname: 'circle',
  info: 'Creates a circular sticker from an image.',
  type: 'sticker',
 },
 async message => {
  try {
   let mediaMessage = mediaTypes.includes(message.mtype) ? message : message.reply_message
   if (mediaMessage && mediaTypes.includes(mediaMessage?.mtype || 'need_Media')) {
    let mediaBuffer = await mediaMessage.download()
    let stickerOptions = {
     pack: Config.packname,
     author: Config.author,
     type: StickerTypes.CIRCLE,
     quality: 50,
    }
    await generateSticker(message, mediaBuffer, stickerOptions)
    return (mediaBuffer = false)
   } else {
    return message.reply('*Reply An Image.*')
   }
  } catch (error) {
   return await message.error(error + '\n\ncmdName: circle\n', '*_Request Failed, Make sure you replied to an image_*')
  }
 }
)

Index(
 {
  pattern: 'round',
  info: 'Creates a rounded sticker from a replied image/video.',
  type: 'sticker',
 },
 async message => {
  try {
   let mediaMessage = mediaTypes.includes(message.mtype) ? message : message.reply_message
   if (mediaMessage && mediaTypes.includes(mediaMessage?.mtype || 'need_Media')) {
    let mediaBuffer = await mediaMessage.download()
    let stickerOptions = {
     pack: Config.packname,
     author: Config.author,
     type: StickerTypes.ROUNDED,
     quality: 50,
    }
    await generateSticker(message, mediaBuffer, stickerOptions)
    return (mediaBuffer = false)
   } else {
    return message.reply('*Reply An Image.*')
   }
  } catch (error) {
   return await message.error(error + '\n\ncmdName: round\n', '*_Request Failed, Make sure you replied to an image!_*')
  }
 }
)

Index(
 {
  pattern: 'tomeme',
  desc: 'Adds text to a quoted image.',
  category: 'sticker',
 },
 async (message, text) => {
  try {
   let replyMessage = mediaTypes.includes(message.mtype) ? message : message.reply_message
   if (!text) {
    return await message.reply('*Please provide text and an image*')
   }
   if (!replyMessage || !mediaTypes.includes(replyMessage.mtype)) {
    return message.reply('*Reply An Image.*')
   }
   let topText = text.split('|')[0] || ''
   let bottomText = (text.split('|')[1] || 'sticker').toLowerCase()
   let upperText = topText.split(';')[0] || '_'
   let lowerText = topText.split(';')[1] || '_'
   let mediaPath = await message.bot.downloadAndSaveMediaMessage(replyMessage)
   let telegraphUrl = await TelegraPh(mediaPath)
   try {
    fs.unlinkSync(mediaPath)
   } catch (error) {}
   console.log('match', text)
   let memeBuffer = await getBuffer(
    'https://api.memegen.link/images/custom/' + upperText + '/' + lowerText + '.png?background=' + telegraphUrl
   )
   if (bottomText?.startsWith('p')) {
    await message.send(
     memeBuffer,
     {
      caption: Config.caption,
     },
     'image'
    )
   }
   let stickerOptions = {
    pack: Config.packname,
    author: Config.author,
    type: StickerTypes.FULL,
    quality: 70,
   }
   await generateSticker(message, memeBuffer, stickerOptions)
   return (memeBuffer = false)
  } catch (error) {
   message.error(error + '\n\ncmdName: memegen\n')
   console.log(error)
  }
 }
)

Index(
 {
  pattern: 'emix',
  desc: 'Mixes two emojis.',
  category: 'sticker',
 },
 async (message, text) => {
  try {
   let firstEmoji = text.split(',')[0] || false
   let secondEmoji = text.split(',')[1] || false
   if (!text || !firstEmoji || !secondEmoji) {
    return message.reply('Example: ' + prefix + 'emix 😅,🤔')
   }
   const response = await fetch(
    'https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=' +
     firstEmoji +
     '_' +
     secondEmoji
   )
   const responseData = await response?.json()
   if (!responseData || responseData?.locale == '') {
    return message.send("*_Can't create mixture, try other emojis_*")
   } else {
    let emojiBuffer = await getBuffer(responseData.results[0].url)
    let stickerOptions = {
     pack: Config.packname,
     author: Config.author,
     type: StickerTypes.FULL,
     quality: 70,
    }
    await generateSticker(message, emojiBuffer, stickerOptions)
    return (emojiBuffer = false)
   }
  } catch (error) {
   message.error(error + '\n\ncmdName: emix')
  }
 }
)

Index(
 {
  pattern: 'quotely',
  desc: 'Creates a sticker from a quoted text.',
  category: 'sticker',
 },
 async (message, text) => {
  try {
   let replyMessage = message.reply_message ? message.reply_message : message && text ? message : false
   let quotedText = message.reply_message
    ? message.reply_message.text
      ? message.reply_message.text
      : text
    : text
    ? text
    : false
   if (!replyMessage) {
    return await message.reply('*Reply to a text or provide text*')
   }
   if (!quotedText) {
    return await message.reply('*Reply to a text or provide text*')
   }
   const apiUrl = `https://terhambar.com/aw/qts?&author=${encodeURIComponent(
    message.pushName
   )}&text=${encodeURIComponent(quotedText)}`
   let apiResponse = await axios.get(apiUrl)
   let buffer = await getBuffer(apiResponse.data.result)
   let stickerOptions = {
    pack: Config.packname,
    author: Config.author,
    type: StickerTypes.FULL,
    quality: 70,
   }
   await generateSticker(message, buffer, stickerOptions)
   return (buffer = false)
  } catch (error) {
   message.error(error + '\n\ncmdName: quotely')
  }
 }
)
