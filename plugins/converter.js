const axios = require('axios')
const fs = require('fs-extra')
const util = require('util')
const { fancytext, listall, prefix, Index } = require('../lib')

Index(
 {
  pattern: 'fancy',
  desc: 'Makes stylish/fancy given text',
  category: 'converter',
 },
 async (context, text) => {
  try {
   let message = `*_Fancy Text Maker_*\n\nUse ${prefix}fancy Xstro, for all fancy texts\n\nUse ${prefix}fancy 10 Xstro, For Spetific Fancy Texts.`

   let selectedNumber = parseInt(text)
   if (isNaN(selectedNumber)) {
    let searchText = text ? text : 'Xstro'
    listall(searchText).forEach((item, index) => {
     message += `\n${index + 1} ${item}\n`
    })
    try {
     return await context.send(message, { caption: message }, '', msg)
    } catch {
     return await context.reply(message)
    }
   }
   let styledText = await fancytext('' + text.slice(2), selectedNumber)
   return await context.send(styledText, {}, '', context)
  } catch (error) {
   return await context.error(error + '\n\ncmdName: fancy', error)
  }
 }
)

Index(
 {
  pattern: 'short',
  desc: 'Makes URL Short.',
  category: 'converter',
 },
 async (context, text) => {
  try {
   if (!text || !text.toLowerCase().includes('https')) {
    return context.reply('Provide me a link')
   }
   let url = text.split(' ')[0]
   let response = await axios.get(`https://ulvis.net/api.php?url=${url}`)
   context.reply(`*Short Link >*\n\n${response.data}`)
  } catch (error) {
   context.error(error + '\n\ncmdName: short', error, false)
  }
 }
)

Index(
 {
  pattern: 'fliptext',
  desc: 'Flips given text.',
  category: 'converter',
 },
 async (context, text) => {
  try {
   let inputText = text ? text : context.reply_text
   if (!inputText) {
    return context.reply(`*_Example : ${prefix}fliptext Xstro_*`)
   }
   let flippedText = inputText.split('').reverse().join('')
   await context.reply(`*「  Text Flipper Tool  」* \n*Given text :*\n${inputText}\n\n*Flipped text :*\n${flippedText}`)
  } catch (error) {
   context.error(error + '\n\ncommand : fliptext', error)
  }
 }
)

Index(
 {
  pattern: 'ebin',
  desc: 'Encode binary',
  category: 'converter',
 },
 async (context, text) => {
  try {
   let inputText = text ? text : context.reply_text
   if (!inputText) {
    return context.reply('*_Send text to be encoded.!_*')
   }
   let binaryText = inputText
    .split('')
    .map(char => {
     return char.charCodeAt(0).toString(2)
    })
    .join(' ')
   await context.reply(binaryText)
  } catch (error) {
   await context.error(error + '\n\ncommand : ebinary', error)
  }
 }
)

Index(
 {
  pattern: 'dbin',
  desc: 'Decode binary',
  category: 'converter',
 },
 async (context, text) => {
  try {
   let binaryText = text ? text : context.reply_text
   if (!binaryText) {
    return context.reply('Send text to be decoded.')
   }
   let binaryArray = binaryText.split(' ')
   let decodedText = binaryArray.map(binary => String.fromCharCode(parseInt(binary, 2))).join('')
   await context.reply(decodedText)
  } catch (error) {
   await context.error(error + '\n\ncommand : dbinary', error)
  }
 }
)

Index(
 {
  pattern: 'qr',
  category: 'converter',
  desc: 'Convert any Data to Qr.',
 },
 async (context, text) => {
  try {
   if (!text) {
    return context.reply('*Provide Text To generate QR!*')
   }
   let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${text}`
   await context.bot.sendUi(
    context.jid,
    { caption: '*_Scan QR To Get Your Text_*' },
    { quoted: context },
    'image',
    qrUrl
   )
  } catch (error) {
   await context.error(error + '\n\ncommand : qr', error)
  }
 }
)

Index(
 {
  pattern: 'paste',
  desc: 'Create paste of text.',
  category: 'converter',
 },
 async (context, text) => {
  try {
   let inputText = text ? text : context.reply_text
   let response = await axios.get(
    `https://api.telegra.ph/createPage?access_token=d3b25feccb89e508a9114afb82aa421fe2a9712b963b387cc5ad71e58722&title=Suhail-Md+Bot&author_name=Astro_Tech_Info&content=[%7B\"tag\":\"p\",\"children\":[\"${inputText.replace(
     / /g,
     '+'
    )}\"]%7D]&return_content=true`
   )
   return context.reply(
    `*Paste created on telegraph*\nName:-${util.format(response.data.result.title)} \nUrl:- ${util.format(
     response.data.result.url
    )}`
   )
  } catch (error) {
   await context.error(error + '\n\ncommand: paste ', error, false)
  }
 }
)

const pmtypes = ['imageMessage', 'stickerMessage']
Index(
 {
  cmdname: 'photo',
  info: 'Makes photo of replied sticker.',
  type: 'converter',
 },
 async context => {
  try {
   let messageType = pmtypes.includes(context.mtype) ? context : context.reply_message
   if (!messageType || !pmtypes.includes(messageType?.mtype)) {
    return context.reply('*Reply to A Sticker*')
   }
   let filePath = await context.bot.downloadAndSaveMediaMessage(messageType)
   await context.bot.sendMessage(context.jid, {
    image: { url: filePath },
    mimetype: 'image/jpeg',
   })
   try {
    fs.unlinkSync(filePath)
   } catch (error) {}
  } catch (error) {
   context.error(error + '\n\ncmdName: photo\n', error, false)
  }
 }
)

const audtypes = ['audioMessage', 'videoMessage']
Index(
 {
  pattern: 'tomp3',
  desc: 'Changes type to audio.',
  category: 'converter',
 },
 async context => {
  try {
   let messageType = audtypes.includes(context.mtype) ? context : context.reply_message
   if (!messageType || !audtypes.includes(messageType?.mtype)) {
    return context.reply('*Reply to A Video.*')
   }
   let filePath = await context.bot.downloadAndSaveMediaMessage(messageType)
   const { toAudio } = require('../lib')
   let fileData = fs.readFileSync(filePath)
   let audioData = await toAudio(fileData)
   try {
    fs.unlink(filePath)
   } catch (error) {}
   return await context.bot.sendMessage(context.jid, {
    audio: audioData,
    mimetype: 'audio/mpeg',
   })
  } catch (error) {
   context.error(error + '\n\ncmdName: toaudio', error)
  }
 }
)

Index(
 {
  pattern: 'ptt',
  desc: 'Convert Video To Audio Voice Note.',
  category: 'converter',
 },
 async context => {
  try {
   let messageType = audtypes.includes(context.mtype) ? context : context.reply_message
   if (!messageType || !audtypes.includes(messageType?.mtype)) {
    return context.reply('*Reply to audio/video*')
   }
   let filePath = await context.bot.downloadAndSaveMediaMessage(messageType)
   const { toPTT } = require('../lib')
   let fileData = fs.readFileSync(filePath)
   let pttData = await toPTT(fileData)
   try {
    fs.unlinkSync(filePath)
   } catch (error) {}
   return await context.bot.sendMessage(context.jid, {
    audio: pttData,
    ptt: true,
    mimetype: 'audio/mpeg',
   })
  } catch (error) {
   context.error(error + '\n\ncmdName: voice', error)
  }
 }
)
