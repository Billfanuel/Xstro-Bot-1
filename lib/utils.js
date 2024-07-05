const axios = require('axios')
const fs = require('fs-extra')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const Jimp = require('jimp')
const fetch = require('node-fetch')
const { textpro } = require('mumaker')
const { getBuffer, fetchJson, runtime, isUrl, GIFBufferToVideoBuffer } = require('./serials.js')
let sides = '*'
const { tlang, TelegraPh, dare, truth, random_question } = require('./scraper.js')
const { bot_ } = require('./program.js')
const Config = require('../config.js')
let caption = Config.caption || ''
const { Innertube, UniversalCache, Utils } = require('youtubei.js')
const yt = {
 async getInfo(videoId, options = {}) {
  try {
   if (!global.OfficialRepo) return

   const youtube = await Innertube.create({
    cache: new UniversalCache(false),
    generate_session_locally: true,
   })

   const info = await youtube.getInfo(videoId, options)
   const availableQualities = info.streaming_data.formats.map(format => format.quality_label)
   const preferredQuality = availableQualities.includes('360p') ? '360p' : 'best'

   return {
    status: true,
    title: info.basic_info.title,
    id: info.basic_info.id,
    quality: availableQualities,
    pref_Quality: preferredQuality,
    duration: info.basic_info.duration,
    description: info.basic_info.short_description,
    keywords: info.basic_info.keywords,
    thumbnail: info.basic_info.thumbnail[0].url,
    author: info.basic_info.author,
    views: info.basic_info.view_count,
    likes: info.basic_info.like_count,
    category: info.basic_info.category,
    channel: info.basic_info.channel,
    basic_info: info,
   }
  } catch (error) {
   console.error('Error in yt.getInfo():', error.message)
   return { status: false }
  }
 },

 async download(videoId, options = { type: 'video', quality: 'best', format: 'mp4' }) {
  try {
   if (!global.OfficialRepo) return

   const youtube = await Innertube.create({
    cache: new UniversalCache(false),
    generate_session_locally: true,
   })

   const { type = 'video', quality = 'best', format = 'mp4' } = options
   const stream = await youtube.download(videoId, { type, quality, format })

   const tempDir = './temp'
   if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
   }

   const fileExtension = type === 'video' ? 'mp4' : 'm4a'
   const filePath = path.join(tempDir, `Asta-Md ${videoId}.${fileExtension}`)
   const writeStream = fs.createWriteStream(filePath)

   for await (const chunk of Utils.streamToIterable(stream)) {
    writeStream.write(chunk)
   }

   return filePath
  } catch (error) {
   console.error('Error in yt.download():', error.message)
   return false
  }
 },
}
async function sendAnimeReaction(context, reactionType = 'punch', mentionedAction = '', selfAction = '') {
 try {
  const response = await fetchJson(`https://api.waifu.pics/sfw/${reactionType}`)
  const imageResponse = await axios.get(response.url, { responseType: 'arraybuffer' })
  const imageBuffer = Buffer.from(imageResponse.data, 'utf-8')

  let mentionedUser = context.mentionedJid ? context.mentionedJid[0] : context.quoted ? context.quoted.sender : false

  let videoBuffer = await GIFBufferToVideoBuffer(imageBuffer)

  let caption = mentionedUser
   ? `${sides}@${context.sender.split('@')[0]} ${mentionedAction} @${mentionedUser.split('@')[0]}${sides}`
   : `${sides}@${context.sender.split('@')[0]} ${selfAction}${sides}`

  const messageContent = {
   video: videoBuffer,
   gifPlayback: true,
   mentions: mentionedUser ? [mentionedUser, context.sender] : [context.sender],
   caption: caption,
  }

  return await context.bot.sendMessage(context.chat, messageContent, {
   quoted: context,
   messageId: context.bot.messageId(),
  })
 } catch (error) {
  return await context.error(`${error}\nERROR AT : /lib/utils.js/sendAnimeReaction()\n\ncommand: ${reactionType}`)
 }
}

async function sendGImages(context, searchQuery, captionText = caption, bodyText = '') {
 try {
  const gis = require('async-g-i-s')
  const images = await gis(searchQuery)
  const randomImage = images[Math.floor(Math.random() * images.length)].url

  const messageContent = {
   image: { url: randomImage },
   caption: captionText,
   contextInfo: {
    externalAdReply: {
     title: tlang().title,
     body: bodyText,
     thumbnail: log0,
     mediaType: 1,
     mediaUrl: gurl,
     sourceUrl: gurl,
    },
   },
  }

  return await context.bot.sendMessage(context.chat, messageContent, {
   quoted: context,
   messageId: context.bot.messageId(),
  })
 } catch (error) {
  await context.error(error)
  return console.log('./lib/utils.js/sendGoogleImages()\n', error)
 }
}

async function AudioToBlackVideo(audioPath, outputPath) {
 try {
  // Remove existing output file if it exists
  try {
   fs.unlinkSync(outputPath)
  } catch (error) {
   // Ignore error if file doesn't exist
  }

  // Get audio duration
  const durationCommand = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${audioPath}`
  const { stdout: durationOutput } = await exec(durationCommand)
  const duration = parseFloat(durationOutput)

  // Create black video
  const blackVideoPath = './temp/blackScreen.mp4'
  try {
   fs.unlinkSync(blackVideoPath)
  } catch (error) {
   // Ignore error if file doesn't exist
  }
  const createBlackVideoCommand = `ffmpeg -f lavfi -i color=c=black:s=1280x720:d=${duration} -vf "format=yuv420p" ${blackVideoPath}`
  await exec(createBlackVideoCommand)

  // Combine black video with audio
  const combineCommand = `ffmpeg -i ${blackVideoPath} -i ${audioPath} -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 ${outputPath}`
  await exec(combineCommand)

  console.log('Audio converted to black screen video successfully!')
  return { result: true }
 } catch (error) {
  console.error('./lib/Aviator.js/convertAudioToBlackVideo()\n', error)
  return { result: false }
 }
}
const ALLOWED_MEDIA_TYPES = ['videoMessage', 'imageMessage']

const createMediaUrl = async (message, urlCreator) => {
 try {
  const mediaMessage = ALLOWED_MEDIA_TYPES.includes(message.mtype) ? message : message.reply_message

  if (!mediaMessage || !ALLOWED_MEDIA_TYPES.includes(mediaMessage?.mtype)) {
   return message.reply('*Reply An Image/Video*')
  }

  const mediaPath = await message.bot.downloadAndSaveMediaMessage(mediaMessage)
  const urlResult = await urlCreator(mediaPath)

  try {
   fs.unlinkSync(mediaPath)
  } catch (unlinkError) {
   console.error('Failed to delete temporary file:', unlinkError)
  }

  if (!urlResult) {
   return message.reply('*_Failed to create URL!_*')
  }

  await message.send(util.format(urlResult), {}, 'asta', mediaMessage)
 } catch (error) {
  await message.error(`${error}\n\ncommand: ${message.body}`, error)
 }
}

async function textToLogoGenerator(
 context,
 urlPath = '',
 text1 = '',
 text2 = 'ser',
 generatorType = 'textpro',
 shouldReportErrors = true
) {
 const baseUrls = {
  ephoto: 'https://ephoto360.com/',
  photooxy: 'https://photooxy.com/',
  en360: 'https://en.ephoto360.com/',
  textpro: 'https://textpro.me/',
 }

 const generatorUrl = determineGeneratorUrl(generatorType, baseUrls, urlPath)

 try {
  const result = await generateLogoWithTextpro(generatorUrl, text1, text2)
  await sendGeneratedLogo(context, result.image)
 } catch (error) {
  await handleTextproError(context, error, generatorUrl, text1, text2, shouldReportErrors)
 }
}

function determineGeneratorUrl(generatorType, baseUrls, urlPath) {
 const type = Object.keys(baseUrls).find(key => new RegExp(key, 'i').test(generatorType)) || 'textpro'
 return `${baseUrls[type]}${urlPath}.html`
}

async function generateLogoWithTextpro(url, text1, text2) {
 return await textpro(url, [text1, text2])
}

async function sendGeneratedLogo(context, imageUrl) {
 const contextInfo = await context.bot.contextInfo('ᴛᴇxᴛ ᴛᴏ ʟᴏɢᴏ', `Hello ${context.senderName}`)
 await context.bot.sendMessage(
  context.jid,
  {
   image: { url: imageUrl },
   caption: caption,
   contextInfo,
  },
  { messageId: context.bot.messageId() }
 )
}

async function handleTextproError(context, error, url, text1, text2, shouldReportErrors) {
 try {
  const apiUrl = `${global.api_smd}/api/maker?text1=${text1}&text2=${text2}&url=${url}`
  const result = await fetchJson(apiUrl)

  if (!result || !result.status || !result.img) {
   throw new Error('Invalid API response')
  }

  await context.bot.sendMessage(
   context.jid,
   {
    image: { url: result.img },
   },
   { messageId: context.bot.messageId() }
  )
 } catch (apiError) {
  if (shouldReportErrors) {
   await context.error(`${error}\n\nAPI Error: ${apiError}\n\nfileName: textToLogoGenerator->s.js`, error)
  }
 }
}

module.exports = textToLogoGenerator
async function photoEditor(_0x17796b, _0x343213 = 'ad', _0xf62b7f = '', _0xe1eb47 = true) {
 let _0xc6e0fc = ['imageMessage']
 try {
  let _0x430f77 = _0xc6e0fc.includes(_0x17796b.mtype) ? _0x17796b : _0x17796b.reply_message
  if (!_0x430f77 || !_0xc6e0fc.includes(_0x430f77?.mtype || 'null')) {
   return await _0x17796b.send('*_Uhh Dear, Reply to an image_*')
  }
  let _0x2de3c4 = await _0x17796b.bot.downloadAndSaveMediaMessage(_0x430f77)
  let _0x9a4084 = await TelegraPh(_0x2de3c4)
  try {
   fs.unlinkSync(_0x2de3c4)
  } catch (_0x408f7d) {}
  return await _0x17796b.bot.sendMessage(
   _0x17796b.chat,
   {
    image: {
     url: 'https://api.popcat.xyz/' + _0x343213 + '?image=' + _0x9a4084,
    },
    caption: _0xf62b7f,
   },
   {
    quoted: _0x17796b,
    messageId: _0x17796b.bot.messageId(),
   }
  )
 } catch (_0x23ac28) {
  if (_0xe1eb47) {
   await _0x17796b.error(_0x23ac28 + '\n\ncommand: ' + _0x343213 + '\nfileName: photoEditor->s.js', _0x23ac28)
  }
 }
}
async function plugins(userSession, command, pluginUrl = '', pluginsPath = '') {
 let responseMessage = ''

 try {
  // Retrieve or create the bot configuration for the user
  let botConfig =
   (await bot_.findOne({ id: 'bot_' + userSession.user })) || (await bot_.new({ id: 'bot_' + userSession.user }))
  let installedPlugins = botConfig.plugins

  if (command.toLowerCase() === 'install') {
   let installedPluginNames = ''

   for (let url of isUrl(pluginUrl)) {
    let pluginUrl = new URL(url.replace(/[_*]+$/, ''))
    pluginUrl = pluginUrl.href.includes('raw') ? pluginUrl.href : pluginUrl.href + '/raw'

    const { data: pluginData } = await axios.get(pluginUrl)

    let pluginNameMatch =
     /pattern: ["'](.*)["'],/g.exec(pluginData) ||
     /cmdname: ["'](.*)["'],/g.exec(pluginData) ||
     /name: ["'](.*)["'],/g.exec(pluginData)

    if (!pluginNameMatch) {
     responseMessage += '*gist not found:* _' + pluginUrl + '_ \n'
     continue
    }

    let pluginName = pluginNameMatch[1].split(' ')[0] || Math.random().toString(36).slice(-5)
    let sanitizedPluginName = pluginName.replace(/[^A-Za-z]/g, '')

    if (installedPluginNames.includes(sanitizedPluginName)) {
     continue
    } else {
     installedPluginNames += `["${sanitizedPluginName}"] `
    }

    if (installedPlugins[sanitizedPluginName]) {
     responseMessage += `*Plugin _'${sanitizedPluginName}'_ already installed!*\n`
     continue
    }

    let pluginFilePath = `${pluginsPath}/${sanitizedPluginName}.js`
    await fs.writeFileSync(pluginFilePath, pluginData, 'utf8')

    try {
     require(pluginFilePath)
    } catch (error) {
     fs.unlinkSync(pluginFilePath)
     responseMessage += `*Invalid :* _${pluginUrl}_\n \`\`\`${error}\`\`\`\n\n `
     continue
    }

    if (!installedPlugins[sanitizedPluginName]) {
     installedPlugins[sanitizedPluginName] = pluginUrl
     await bot_.updateOne({ id: 'bot_' + userSession.user }, { plugins: installedPlugins })
     responseMessage += `*Plugin _'${sanitizedPluginName}'_ Successfully installed!*\n`
    }
   }
  } else if (command.toLowerCase() === 'remove') {
   if (pluginUrl === 'all') {
    let removedPlugins = ''

    for (const pluginName in installedPlugins) {
     try {
      fs.unlinkSync(`${pluginsPath}/${pluginName}.js`)
      removedPlugins += `${pluginName},`
     } catch (error) {
      console.log(`❌ ${pluginName} ❌ NOT BE REMOVED`, error)
     }
    }

    await bot_.updateOne({ id: 'bot_' + userSession.user }, { plugins: {} })
    responseMessage = `*External plugins ${removedPlugins ? removedPlugins : 'all'} removed!!!*`
   } else {
    try {
     if (installedPlugins[pluginUrl]) {
      try {
       fs.unlinkSync(`${pluginsPath}/${pluginUrl}.js`)
      } catch {}

      delete installedPlugins[pluginUrl]
      await bot_.updateOne({ id: 'bot_' + userSession.user }, { plugins: installedPlugins })
      responseMessage += `*Plugin _'${pluginUrl}'_ Successfully removed!*`
     } else {
      responseMessage += `*_plugin not exist in ${Config.botname}_*`
     }
    } catch (error) {
     console.log('Error while removing plugins \n ', error)
    }
   }
  } else if (command.toLowerCase() === 'plugins') {
   if (pluginUrl) {
    responseMessage = installedPlugins[pluginUrl] ? `*_${pluginUrl}:_* ${installedPlugins[pluginUrl]}` : false
   } else {
    let count = 1
    for (const pluginName in installedPlugins) {
     responseMessage += `*${count}:* ${pluginName} \n*Url:* ${installedPlugins[pluginName]}\n\n`
     count++
    }
   }
  }
  return responseMessage
 } catch (error) {
  console.log('Plugins : ', error)
  return (responseMessage + ' \n\nError: ' + error).trim()
 }
}

async function updateProfilePicture(context, jid, mediaMessage, updateType = 'pp') {
 try {
  if (updateType === 'pp' || updateType === 'gpp') {
   await updateRegularProfilePicture(context, jid, mediaMessage)
  } else {
   await updateFullProfilePicture(context, jid, mediaMessage)
  }

  await context.reply('*_Profile icon updated successfully!_*')
 } catch (error) {
  await context.error(`${error}\n\ncommand: ${updateType || 'pp'}`, error)
 }
}

async function updateRegularProfilePicture(context, jid, mediaMessage) {
 const mediaPath = await context.bot.downloadAndSaveMediaMessage(mediaMessage)
 await context.bot.updateProfilePicture(jid, { url: mediaPath })
}

async function updateFullProfilePicture(context, jid, mediaMessage) {
 try {
  const mediaBuffer = await mediaMessage.download()
  const { preview } = await processImage(mediaBuffer)
  await updateProfilePictureWithQuery(context, jid, preview)
 } catch (error) {
  console.error('Error in full profile picture update:', error)
  await updateRegularProfilePicture(context, jid, mediaMessage)
  await context.error(`${error}\n\ncommand: update pp`, error, false)
 }
}

async function processImage(buffer) {
 const image = await Jimp.read(buffer)
 const width = image.getWidth()
 const height = image.getHeight()
 const croppedImage = image.crop(0, 0, width, height)

 return {
  img: await croppedImage.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
  preview: await croppedImage.normalize().getBufferAsync(Jimp.MIME_JPEG),
 }
}

async function updateProfilePictureWithQuery(context, jid, previewBuffer) {
 const { query } = context.bot
 await query({
  tag: 'iq',
  attrs: {
   to: jid,
   type: 'set',
   xmlns: 'w:profile:picture',
  },
  content: [
   {
    tag: 'picture',
    attrs: { type: 'image' },
    content: previewBuffer,
   },
  ],
 })
}

module.exports = updateProfilePicture
async function forwardMessage(jid, context, type = '') {
 const messageType = context.quoted.mtype
 let messageContent

 switch (messageType) {
  case 'videoMessage':
   messageContent = {
    [type === 'ptv' ? 'ptvMessage' : 'videoMessage']: { ...context.quoted },
   }
   break
  case 'imageMessage':
  case 'audioMessage':
  case 'documentMessage':
   messageContent = {
    [messageType]: { ...context.quoted },
   }
   break
  case 'conversation':
  case 'extendedTextMessage':
   return await context.send(context.quoted.text, {}, '', context, jid)
  default:
   return // Unsupported message type
 }

 if (messageContent) {
  try {
   await Suhail.bot.relayMessage(jid, messageContent, {
    messageId: context.key.id,
   })
  } catch (error) {
   console.log(`Error in ${type}-cmd in forwardMessage:`, error)
   if (type === 'ptv' || type === 'save') {
    await context.error(error)
   }
  }
 }
}
async function generateSticker(
 message,
 mediaBuffer,
 stickerOptions = {
  pack: Config.packname,
  author: Config.author,
 },
 shouldCatchError = true
) {
 try {
  const { Sticker } = require('wa-sticker-formatter')

  let sticker = new Sticker(mediaBuffer, {
   ...stickerOptions,
  })

  return await message.bot.sendMessage(
   message.chat,
   {
    sticker: await sticker.toBuffer(),
   },
   {
    quoted: message,
    messageId: message.bot.messageId(),
   }
  )
 } catch (error) {
  if (shouldCatchError) {
   await message.error(error + '\n\nfileName: generateSticker->s.js\n')
  }
 }
}

async function getRandom(_0xf0461b = '.jpg', _0x48110d = 10000) {
 return '' + Math.floor(Math.random() * _0x48110d) + _0xf0461b
}
async function getRandomFunFact(type) {
 try {
  switch (type) {
   case 'question':
    return await random_question()
   case 'truth':
    return await truth()
   case 'dare':
    return await dare()
   case 'joke':
    const jokeResponse = await fetch('https://official-joke-api.appspot.com/random_joke')
    const jokeData = await jokeResponse.json()
    return `*Joke:* ${jokeData.setup}\n*Punchline:* ${jokeData.punchline}`
   case 'joke2':
    const joke2Response = await fetch('https://v2.jokeapi.dev/joke/Any?type=single')
    const joke2Data = await joke2Response.json()
    return `*Joke:* ${joke2Data.joke}`
   case 'fact':
    const factResponse = await axios.get('https://nekos.life/api/v2/fact')
    return `*Fact:* ${factResponse.data.fact}`
   case 'quotes':
    const quoteResponse = await axios.get('https://favqs.com/api/qotd')
    return `╔════◇\n║ *🎗️Content:* ${quoteResponse.data.quote.body}\n║ *👤Author:* ${quoteResponse.data.quote.author}\n║\n╚════════════╝`
   default:
    throw new Error('Invalid type provided')
  }
 } catch (error) {
  msg.error(error)
  console.log('./lib/utils.js/getRandomFunFact()\n', error)
 }
}

async function audioEditor(message, effect = 'bass', options = '') {
 if (!message.quoted) {
  return await message.send('*Reply to audio*')
 }

 let mediaType = message.quoted.mtype || message.mtype
 if (!/audio/.test(mediaType)) {
  return await message.send('*_Reply to the audio you want to change with_*', {}, '', options)
 }

 try {
  let filterCommand = '-af equalizer=f=54:width_type=o:width=2:g=20'

  switch (effect.toLowerCase()) {
   case 'bass':
    filterCommand = '-af equalizer=f=54:width_type=o:width=2:g=20'
    break
   case 'blown':
    filterCommand = '-af acrusher=.1:1:64:0:log'
    break
   case 'deep':
    filterCommand = '-af atempo=4/4,asetrate=44500*2/3'
    break
   case 'earrape':
    filterCommand = '-af volume=12'
    break
   case 'fast':
    filterCommand = '-filter:a "atempo=1.63,asetrate=44100"'
    break
   case 'fat':
    filterCommand = '-filter:a "atempo=1.6,asetrate=22100"'
    break
   case 'nightcore':
    filterCommand = '-filter:a atempo=1.06,asetrate=44100*1.25'
    break
   case 'reverse':
    filterCommand = '-filter_complex "areverse"'
    break
   case 'robot':
    filterCommand =
     "-filter_complex \"afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75\""
    break
   case 'slow':
    filterCommand = '-filter:a "atempo=0.7,asetrate=44100"'
    break
   case 'smooth':
    filterCommand = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
    break
   case 'tupai':
    filterCommand = '-filter:a "atempo=0.5,asetrate=65100"'
    break
   default:
    break
  }

  let audioFilePath = await message.bot.downloadAndSaveMediaMessage(message.quoted)
  let outputFilePath = 'temp/' + (message.sender.slice(6) + effect) + '.mp3'

  exec(`ffmpeg -i ${audioFilePath} ${filterCommand} ${outputFilePath}`, async (error, stdout, stderr) => {
   try {
    fs.unlinkSync(audioFilePath)
   } catch {}

   if (error) {
    return message.error(error)
   } else {
    let editedAudio = fs.readFileSync(outputFilePath)
    try {
     fs.unlinkSync(outputFilePath)
    } catch {}

    let contextInfo = {
     ...(await message.bot.contextInfo('Sir ' + message.senderName + ' 🤍', '⇆ㅤ ||◁ㅤ❚❚ㅤ▷||ㅤ ⇆')),
    }

    return message.bot.sendMessage(
     message.chat,
     {
      audio: editedAudio,
      mimetype: 'audio/mpeg',
      ptt: /ptt|voice/.test(message.test || '') ? true : false,
      contextInfo: contextInfo,
     },
     {
      quoted: message,
      messageId: message.bot.messageId(),
     }
    )
   }
  })
 } catch (error) {
  await message.error(error + '\n\ncmdName : ' + effect + '\n')
  return console.log('./lib/utils.js/audioEditor()\n', error)
 }
}

async function send(
 message,
 content,
 options = { packname: '', author: 'Xstro' },
 additionalInfo = '',
 additionalParams = '',
 chatId = ''
) {
 if (!content || !message) {
  return
 }

 try {
  let targetChatId = chatId ? chatId : message.chat
  return await message.send(content, options, additionalInfo, additionalParams, targetChatId)
 } catch (error) {
  console.log('./lib/utils.js/sendMessage()\n', error)
 }
}

async function react(message, reactionText, targetMessage = '') {
 try {
  if (!reactionText || !message) {
   return
  }

  let targetKey = targetMessage && targetMessage.key ? targetMessage.key : message.key
  return await message.bot.sendMessage(
   message.chat,
   {
    react: {
     text: reactionText,
     key: targetKey,
    },
   },
   {
    messageId: message.bot.messageId(),
   }
  )
 } catch (error) {
  console.log('./lib/utils.js/sendReaction()\n', error)
 }
}

let note = {
 info:
  'Make sure to provide the bot number as the first parameter in the format {user: botNumber} and the note text or ID as the second parameter.',
}

note.addnote = async (botInfo, noteText) => {
 try {
  let botData = (await bot_.findOne({ id: 'bot_' + botInfo.user })) || (await bot_.new({ id: 'bot_' + botInfo.user }))
  let notes = botData.notes || {}
  let noteId = 0

  while (notes[noteId] !== undefined) {
   noteId++
  }

  notes[noteId] = noteText
  await bot_.updateOne({ id: 'bot_' + botInfo.user }, { notes })

  return {
   status: true,
   id: noteId,
   msg: `*New note added at ID: ${noteId}*`,
  }
 } catch (error) {
  console.log('note.addNote ERROR:', error)
  return {
   status: false,
   error,
   msg: "*Can't add new notes due to an error!*",
  }
 }
}

note.delnote = async (botInfo, noteId) => {
 try {
  let botData = (await bot_.findOne({ id: 'bot_' + botInfo.user })) || (await bot_.new({ id: 'bot_' + botInfo.user }))
  let notes = botData.notes || {}
  let responseMsg = '*Please provide a valid note ID!*'

  if (notes[noteId] !== undefined) {
   delete notes[noteId]
   await bot_.updateOne({ id: 'bot_' + botInfo.user }, { notes })
   responseMsg = `*Note with ID: ${noteId} deleted successfully!*`
  }

  return {
   status: true,
   msg: responseMsg,
  }
 } catch (error) {
  console.log('note.deleteNote ERROR:', error)
  return {
   status: false,
   error,
   msg: "*Can't delete notes due to an error!*",
  }
 }
}

note.delallnotes = async botInfo => {
 try {
  await bot_.updateOne({ id: 'bot_' + botInfo.user }, { notes: {} })
  return {
   status: true,
   msg: '*All saved notes deleted from the server!*',
  }
 } catch (error) {
  console.log('note.deleteAllNotes ERROR:', error)
  return {
   status: false,
   error,
   msg: '*Request could not be processed, sorry!*',
  }
 }
}

note.allnotes = async (botInfo, noteId = '') => {
 try {
  let botData = (await bot_.findOne({ id: 'bot_' + botInfo.user })) || (await bot_.new({ id: 'bot_' + botInfo.user }))
  let notes = botData.notes || {}
  let responseMsg = '*Please provide a valid note ID!*'

  if (noteId === 'all' || !noteId) {
   let allNotes = ''
   for (const id in notes) {
    allNotes += `*NOTE ${id}:* ${notes[id]}\n\n`
   }
   responseMsg = allNotes ? allNotes : '*No notes found!*'
  } else if (noteId && notes[noteId]) {
   responseMsg = `*Note ${noteId}:* ${notes[noteId]}`
  }

  return {
   status: true,
   msg: responseMsg,
  }
 } catch (error) {
  console.log('note.getAllNotes ERROR:', error)
  return {
   status: false,
   error,
   msg: "*Can't retrieve notes due to an error!*",
  }
 }
}

async function sendWelcome(
 messageData,
 welcomeMessage = '',
 caption = '',
 groupUrl = '',
 messageType = 'msg',
 includeContext = false
) {
 try {
  if (!global.OfficialRepo) {
   return 'Get Out'
  }

  if (welcomeMessage) {
   if (messageData.isGroup) {
    welcomeMessage = welcomeMessage
     .replace(/@gname|&gname/gi, messageData.metadata.subject)
     .replace(/@desc|&desc/gi, messageData.metadata.desc)
     .replace(/@count|&count/gi, messageData.metadata.participants.length)
   }

   let parsedMessage = welcomeMessage
    .replace(/@user|&user/gi, '@' + messageData.senderNum)
    .replace(/@name|&name/gi, messageData.senderName || '_')
    .replace(/@gname|&gname/gi, '')
    .replace(/@desc|&desc/gi, '')
    .replace(/@count|&count/gi, '1')
    .replace(/@pp|&pp|@gpp|&gpp|@context|&context/g, '')
    .replace(/@time|&time/gi, messageData.time)
    .replace(/@date|&date/gi, messageData.date)
    .replace(/@bot|&bot/gi, Config.botname)
    .replace(/@owner|&owner/gi, Config.ownername)
    .replace(/@caption|&caption/gi, caption)
    .replace(/@gurl|@website|&gurl|&website|@link|&link/gi, groupUrl)
    .replace(/@runtime|&runtime|@uptime|&uptime/gi, '' + runtime(process.uptime()))
    .trim()

   try {
    parsedMessage = parsedMessage.replace(
     /@line|&line/gi,
     (await fetchJson('https://api.popcat.xyz/pickuplines')).pickupline || ''
    )
   } catch {
    parsedMessage = parsedMessage.replace(/@line|&line/gi, '')
   }

   try {
    if (/@quote|&quote/gi.test(parsedMessage)) {
     let { data: quoteData } = await axios.get('https://favqs.com/api/qotd')
     if (quoteData && quoteData.quote) {
      parsedMessage = parsedMessage
       .replace(/@quote|&quote/gi, quoteData.quote.body || '')
       .replace(/@author|&author/gi, quoteData.quote.author || '')
     }
    }
   } catch {
    parsedMessage = parsedMessage.replace(/@quote|&quote|@author|&author/gi, '')
   }

   if (!messageType || messageType === 'msg') {
    try {
     if (typeof groupUrl === 'string') {
      groupUrl = groupUrl.split(',')
     }
     if (/@user|&user/g.test(welcomeMessage) && !groupUrl.includes(messageData.sender)) {
      groupUrl.push(messageData.sender)
     }
    } catch (error) {
     console.log('ERROR:', error)
    }

    let contextInfo = {
     ...(includeContext || /@context|&context/g.test(welcomeMessage)
      ? await messageData.bot.contextInfo(Config.botname, messageData.pushName)
      : {}),
     mentionedJid: groupUrl,
    }

    if (/@pp/g.test(welcomeMessage)) {
     return await messageData.send(
      await messageData.getpp(),
      { caption: parsedMessage, mentions: groupUrl, contextInfo },
      'image',
      caption
     )
    } else if (messageData.jid && /@gpp/g.test(welcomeMessage)) {
     return await messageData.send(
      await messageData.getpp(messageData.jid),
      { caption: parsedMessage, mentions: groupUrl, contextInfo },
      'image',
      caption
     )
    } else {
     return await messageData.send(parsedMessage, { mentions: groupUrl, contextInfo }, 'asta', caption)
    }
   } else {
    return parsedMessage
   }
  }
 } catch (error) {
  console.log('./lib/utils.js/sendWelcome()\n', error)
 }
}

async function aitts(context, text = '', shouldReportErrors = true) {
 try {
  if (!global.OfficialRepo || global.OfficialRepo !== 'yes') {
   return 'Unauthorized access. Please use the official repository.'
  }

  if (!process.env.ELEVENLAB_API_KEY || process.env.ELEVENLAB_API_KEY.length <= 8) {
   return context.reply(
    'Error: ELEVENLAB_API_KEY is missing or invalid. Please create an API key at https://elevenlabs.io/ and set it in the ELEVENLAB_API_KEY environment variable.'
   )
  }

  const voices = [
   '21m00Tcm4TlvDq8ikWAM',
   '2EiwWnXFnvU5JabPnv8n',
   'AZnzlk1XvdvUeBnXmlld',
   'CYw3kZ02Hs0563khs1Fj',
   'D38z5RcWu1voky8WS1ja',
   'EXAVITQu4vr4xnSDxMaL',
   'ErXwobaYiN019PkySvjV',
   'GBv7mTt0atIp3Br8iCZE',
   'IKne3meq5aSn9XLyUdCD',
   'LcfcDJNUP1GQjkzn1xUU',
   'MF3mGyEYCl7XYWbV9V6O',
   'N2lVS1w4EtoT3dr4eOWO',
   'ODq5zmih8GrVes37Dizd',
   'SOYHLrjzK2X1ezoPC6cr',
   'TX3LPaxmHKxFdv7VOQHJ',
   'ThT5KcBeYPX3keUQqHPh',
   'TxGEqnHWrfWFTfGW9XjX',
   'VR6AewLTigWG4xSOukaG',
   'XB0fDUnXU5powFXDhCwa',
   'XrExE9yKIg1WjnnlVkGX',
   'Yko7PKHZNXotIFUBG7I9',
   'ZQe5CZNOzWyzPSCn5a3c',
   'Zlb1dXrM653N07WRdFW3',
   'bVMeCyTHy58xNoL34h3p',
   'flq6f7yk4E4fJM5XTYuZ',
   'g5CIjZEefAph4nQFvHAz',
   'jBpfuIE2acCO8z3wKNLl',
   'jsCqWAovK2LkecY7zXl4',
   'oWAxZDx7w5VEj9dCyTzz',
   'onwK4e9ZLuTAKqWW03F9',
   'pMsXgVXv3BLzUgSXRplE',
   'pNInz6obpgDQGcFmaJgB',
   'piTKgcLEGmPE4e6mEKli',
   't0jbNlBVZ17f02VDIeMI',
   'wViXBPUzp2ZZixB1xQuM',
   'yoZ06aMxZJJ28mfd3POQ',
   'z9fAnlkpzviPz146aGWa',
   'zcAOhNBS3c14rBihAFp1',
   'zrHiDhphv9ZnVXBqCLjz',
  ]

  const voiceMap = {
   rachel: 0,
   clyde: 1,
   domi: 2,
   dave: 3,
   fin: 4,
   bella: 5,
   antoni: 6,
   thomas: 7,
   charlie: 8,
   emily: 9,
   elli: 10,
   callum: 11,
   patrick: 12,
   harry: 13,
   liam: 14,
   dorothy: 15,
   josh: 16,
   arnold: 17,
   charlotte: 18,
   matilda: 19,
   matthew: 20,
   james: 21,
   joseph: 22,
   jeremy: 23,
   michael: 24,
   ethan: 25,
   gigi: 26,
   freya: 27,
   grace: 28,
   daniel: 29,
   serena: 30,
   adam: 31,
   nicole: 32,
   jessie: 33,
   ryan: 34,
   asta: 35,
   glinda: 36,
   giovanni: 37,
   mimi: 38,
  }

  if (!text && !context.isCreator) {
   return context.reply(`*Please provide text to convert to speech.*\n*Example: _.aitts I am ${context.pushName}._*`)
  }

  if ((!text && context.isCreator) || text === 'setting' || text === 'info') {
   return sendSettingsInfo(context)
  }

  let voiceIndex = parseInt(process.env.AITTS_ID) - 1 || Math.floor(Math.random() * voices.length)
  let processedText = text

  if (text.includes(':')) {
   const [content, voiceIdentifier] = text.split(':').map(s => s.trim())
   processedText = content

   if (voiceMap.hasOwnProperty(voiceIdentifier.toLowerCase())) {
    voiceIndex = voiceMap[voiceIdentifier.toLowerCase()]
   } else if (!isNaN(voiceIdentifier) && voiceIdentifier > 0 && voiceIdentifier <= voices.length) {
    voiceIndex = parseInt(voiceIdentifier) - 1
   }
  }

  const response = await axios({
   method: 'POST',
   url: `https://api.elevenlabs.io/v1/text-to-speech/${voices[voiceIndex]}`,
   headers: {
    accept: 'audio/mpeg',
    'content-type': 'application/json',
    'xi-api-key': process.env.ELEVENLAB_API_KEY,
   },
   data: { text: processedText },
   responseType: 'arraybuffer',
  })

  if (!response.data) {
   return await context.send('*_Request could not be processed._*')
  }

  await context.sendMessage(
   context.from,
   {
    audio: response.data,
    mimetype: 'audio/mpeg',
    ptt: true,
   },
   {
    quoted: context,
    messageId: context.bot.messageId(),
   }
  )
 } catch (error) {
  if (shouldReportErrors) {
   await context.error(`${error}\n\ncommand: aitts`, error)
  }
 }
}

function sendSettingsInfo(context) {
 const currentVoiceId = parseInt(process.env.AITTS_ID)
 const voiceStatus =
  !isNaN(currentVoiceId) && currentVoiceId > 0 && currentVoiceId <= 39
   ? `set Voice Id: ${currentVoiceId}*\nUpdate`
   : 'not set any Specific Voice*\nAdd Specific'

 const message = `
*Hey ${context.pushName}!*
_Please provide text!_
*Example:* _.aitts I am ${context.pushName}._

*You currently ${voiceStatus} Voice: _.addvar AITTS_ID:35/4/32,etc._

*Available voices:*
1: Rachel   2: Clyde    3: Domi     4: Dave     5: Fin
6: Bella    7: Antoni   8: Thomas   9: Charlie  10: Emily
...

*Example:* _.aitts I am ${context.pushName}_:36 
*OR:* _.aitts I am ${context.pushName}_:asta     

${context.caption}
  `.trim()

 return context.bot.sendMessage(context.jid, { text: message }, { messageId: context.bot.messageId() })
}
let setMention = {
 mention: false,
}

setMention.status = async (event, enableMention = false) => {
 try {
  setMention.mention = false

  let botRecord = (await bot_.findOne({ id: 'bot_' + event.user })) || (await bot_.new({ id: 'bot_' + event.user }))

  let mentionSettings = botRecord.mention || {}

  if (enableMention) {
   if (mentionSettings.status) {
    return await event.reply('_Mention Already Enabled!_')
   }
   mentionSettings.status = true
   await bot_.updateOne({ id: 'bot_' + event.user }, { mention: mentionSettings })
   return await event.reply('_Mention Enabled!_')
  } else {
   if (!mentionSettings.status) {
    return await event.reply('_Mention Already Disabled!_')
   }
   mentionSettings.status = false
   await bot_.updateOne({ id: 'bot_' + event.user }, { mention: mentionSettings })
   return await event.reply('_Mention Disabled!_')
  }
 } catch (error) {
  event.error(`${error}\n\nCommand: mention`, error, false)
 }
}

setMention.get = async event => {
 try {
  let botRecord = (await bot_.findOne({ id: 'bot_' + event.user })) || (await bot_.new({ id: 'bot_' + event.user }))

  let mentionSettings = botRecord.mention || {}

  if (mentionSettings.get) {
   return await event.reply(
    `*Status :* ${mentionSettings.status ? 'ON' : 'OFF'}
         \nUse on/off/get/test to enable and disable mention
         \n\n*Mention Info:* ${mentionSettings.get}`
   )
  } else {
   return await event.reply(
    "*You didn't set mention message yet!*\n*Please Check: https://github.com/SuhailTechInfo/Suhail-Md/wiki/mention*"
   )
  }
 } catch (error) {
  event.error(`${error}\n\nCommand: mention`, error, false)
 }
}

setMention.typesArray = mentionText => {
 try {
  const lines = mentionText.split('\n')
  let mentionTypes = { text: [] }
  const mediaTypes = ['gif', 'video', 'audio', 'image', 'sticker']
  let currentType = null

  for (const line of lines) {
   const words = line.split(' ')
   if (words.length >= 1) {
    const typeIndex = words.findIndex(word => word.startsWith('type/'))
    if (typeIndex !== -1) {
     currentType = words[typeIndex].slice(5).toLowerCase()
     let isAstaType = /asta|smd|message|chat/gi.test(currentType)
     if (!mentionTypes[isAstaType ? 'asta' : currentType]) {
      mentionTypes[isAstaType ? 'asta' : currentType] = []
     }
    }
    const filteredWords = words.filter(word => word !== 'type/' + currentType && word !== '')
    currentType = /asta|smd|message|chat/gi.test(currentType) ? 'asta' : currentType
    if (filteredWords.length > 0) {
     if (mediaTypes.includes(currentType)) {
      filteredWords.forEach(word => {
       if (/http/gi.test(word)) {
        mentionTypes[currentType].push(word)
       }
      })
     } else if (/react/gi.test(currentType)) {
      mentionTypes.react.push(...filteredWords)
     } else {
      mentionTypes[/asta/gi.test(currentType) ? 'asta' : 'text'].push(filteredWords.join(' '))
     }
    }
   }
   currentType = null
  }
  return mentionTypes || {}
 } catch (error) {
  console.log('Error in Mention typesArray\n', error)
 }
}

setMention.update = async (event, mentionText) => {
 try {
  setMention.mention = false
  let mentionData = { status: true, get: mentionText }

  try {
   const jsonMatch = mentionText.match(/\{.*\}/)
   if (jsonMatch) {
    const jsonString = jsonMatch[0]
    const jsonData = JSON.parse(jsonString)
    mentionData.json = jsonData
    mentionText = mentionText.replace(/\{.*\}/, '')
   }
  } catch (error) {
   console.log('ERROR mention JSON parse', error)
  }

  mentionData.text = mentionText
  mentionData.type = setMention.typesArray(mentionText) || {}

  await bot_.updateOne({ id: 'bot_' + event.user }, { mention: mentionData })

  return await event.send('*Mention updated!*', {
   mentios: [event.user],
  })
 } catch (error) {
  event.error(`${error}\n\nCommand: mention`, error, false)
 }
}

setMention.cmd = async (event, command = '') => {
 try {
  let mentionStatus = setMention.mention || false

  if (!mentionStatus) {
   let botRecord = (await bot_.findOne({ id: 'bot_' + event.user })) || (await bot_.new({ id: 'bot_' + event.user }))
   mentionStatus = botRecord.mention || false
   setMention.mention = mentionStatus
  }

  if (global.OfficialRepo !== 'yes') {
   return
  }

  if (['get', 'info'].includes(command) || (!command && mentionStatus.status && mentionStatus.get)) {
   setMention.get(event)
  } else if (!command) {
   event.reply('_Read wiki to set mention message https://github.com/SuhailTechInfo/Suhail-Md/wiki/mention_', {}, 'smd')
  } else if (['off', 'deact', 'disable', 'false'].includes(command.toLowerCase())) {
   setMention.status(event, false)
  } else if (['on', 'act', 'enable', 'true', 'active'].includes(command.toLowerCase())) {
   setMention.status(event, true)
  } else if (['check', 'test', 'me'].includes(command.toLowerCase())) {
   setMention.check(event, command, true)
  } else {
   setMention.update(event, command)
  }
 } catch (error) {
  console.log('ERROR IN MENTION CMD \n ', error)
 }
}

setMention.random = mentionTypes => {
 try {
  const keys = Object.keys(mentionTypes || {})
  if (keys.length > 1) {
   const randomKey = keys[Math.floor(Math.random() * (keys.length - 1)) + 1]
   const randomValues = mentionTypes[randomKey]
   if (randomValues && randomValues.length > 0) {
    const randomIndex = Math.floor(Math.random() * randomValues.length)
    return {
     type: randomKey,
     url: randomValues[randomIndex],
    }
   }
  }
  if (mentionTypes && mentionTypes.text) {
   return {
    url: mentionTypes.text.join(' ') || '',
    type: 'smd',
   }
  } else {
   return undefined
  }
 } catch (error) {
  console.log(error)
 }
}

global.creator = process.env.CREATOR || true

setMention.check = async (event, mentionMessage = '', forceCheck = false) => {
 try {
  const shouldCheck =
   forceCheck ||
   event.mentionedJid.includes(event.user) ||
   mentionMessage.includes('@' + event.user.split('@')[0]) ||
   (global.creator &&
    (event.mentionedJid.includes('@2348039607375@s.whatsapp.net') ||
     event.mentionedJid.includes('@2349027862116@s.whatsapp.net') ||
     /@2348039607375|@2349027862116/g.test(mentionMessage)))

  if (shouldCheck) {
   if (global.OfficialRepo !== 'yes') {
    return
   }

   let mentionStatus = setMention.mention || false
   if (!mentionStatus) {
    let botRecord = (await bot_.findOne({ id: 'bot_' + event.user })) || (await bot_.new({ id: 'bot_' + event.user }))
    mentionStatus = botRecord.mention || false
    setMention.mention = mentionStatus
   }

   if (typeof mentionStatus !== 'object' || !mentionStatus || !mentionStatus.status) {
    return
   }

   const randomMention = setMention.random(mentionStatus.type)
   if (randomMention) {
    let mentionType = randomMention.type
    const additionalOptions = {}
    if (randomMention.type === 'gif') {
     mentionType = 'video'
     additionalOptions.gifPlayback = true
    }
    try {
     const messageOptions = {
      ...mentionStatus.json,
      ...additionalOptions,
     }
     if (
      messageOptions.contextInfo &&
      messageOptions.contextInfo.externalAdReply &&
      messageOptions.contextInfo.externalAdReply.thumbnail
     ) {
      messageOptions.contextInfo.externalAdReply.thumbnail =
       (await getBuffer(messageOptions.contextInfo.externalAdReply.thumbnail)) || log0
     }
     await event.send(randomMention.url, messageOptions, mentionType, event)
    } catch (sendError) {
     console.log('Error Sending ContextInfo in mention ', sendError)
     try {
      await event.send(randomMention.url, additionalOptions, mentionType, event)
     } catch (error) {
      await event.send(randomMention.url, {}, mentionType, event)
     }
    }
   } else {
    let mentionText = mentionStatus.text || ''
    await event.reply(
     mentionText.includes('{') ? mentionText.replace(/{name}/g, event.pushName) : mentionText,
     { mentions: [event.user] },
     'smd'
    )
   }
  }
 } catch (error) {
  console.log('ERROR IN mention.check\n ', error)
 }
}
let mention = setMention

let setFilter = {
 filter: false,
}

setFilter.set = async (event, filterText = '') => {
 try {
  if (!filterText) {
   return event.send(`*Use ${prefix}filter word:reply_text!*`)
  }

  let [word, replyText] = filterText.split(':').map(text => text.trim())

  if (!word || !replyText) {
   return event.send(`*Use ${prefix}filter ${word || 'word'}: ${replyText || 'reply_text'}!*`)
  }

  let botRecord = (await bot_.findOne({ id: 'bot_' + event.user })) || (await bot_.new({ id: 'bot_' + event.user }))

  let filterSettings = botRecord.filter || {}
  filterSettings[word] = replyText
  setFilter.filter = filterSettings

  await bot_.updateOne({ id: 'bot_' + event.user }, { filter: filterSettings })

  event.send(`*Successfully set filter to '${word}'!*`)
 } catch (error) {
  event.error(`${error}\n\nCommand:filter`, error, "_Can't set filter!_")
 }
}

setFilter.stop = async (event, word = '') => {
 try {
  if (!word) {
   return event.send(
    `*Provide a word that is set in the filter!*\n*Use ${prefix}flist to get a list of filtered words!*`
   )
  }

  let botRecord = (await bot_.findOne({ id: 'bot_' + event.user })) || (await bot_.new({ id: 'bot_' + event.user }))

  let filterSettings = botRecord.filter || {}

  if (!filterSettings[word]) {
   return event.reply(`*Given Word ('${word}') not set to any filter!*`)
  }

  delete filterSettings[word]
  setFilter.filter = filterSettings

  await bot_.updateOne({ id: 'bot_' + event.user }, { filter: filterSettings })

  event.reply(`*_Filter word '${word}' deleted!_*`)
 } catch (error) {
  event.error(`${error}\n\nCommand:fstop`, error, "*Can't delete filter!*")
 }
}

setFilter.list = async event => {
 try {
  let botRecord = (await bot_.findOne({ id: 'bot_' + event.user })) || (await bot_.new({ id: 'bot_' + event.user }))

  let filterSettings = botRecord.filter || {}
  let filterList = Object.entries(filterSettings)
   .map(([word, replyText]) => `${word} : ${replyText}`)
   .join('\n')

  if (botRecord.filter && filterList) {
   event.reply(`*[LIST OF FILTERED WORDS]*\n\n${filterList}`)
  } else {
   event.reply("*_You didn't set any filter!_*")
  }
 } catch (error) {
  event.error(`${error}\n\nCommand:flist`, error, false)
 }
}

setFilter.check = async (event, messageText = '') => {
 try {
  let filterSettings = setFilter.filter || false

  if (!filterSettings) {
   let botRecord = (await bot_.findOne({ id: 'bot_' + event.user })) || (await bot_.new({ id: 'bot_' + event.user }))

   filterSettings = botRecord.filter || {}
   setFilter.filter = filterSettings
  }

  if (filterSettings[messageText]) {
   event.reply(filterSettings[messageText], {}, 'smd', event)
  }
 } catch (error) {
  console.log(error)
 }
}

let filter = setFilter

module.exports = {
 yt,
 sendAnimeReaction,
 sendGImages,
 AudioToBlackVideo,
 textToLogoGenerator,
 photoEditor,
 updateProfilePicture,
 getRandomFunFact,
 plugins,
 getRandom,
 generateSticker,
 forwardMessage,
 audioEditor,
 send,
 react,
 note,
 sendWelcome,
 aitts,
 mention,
 filter,
 createMediaUrl,
}
