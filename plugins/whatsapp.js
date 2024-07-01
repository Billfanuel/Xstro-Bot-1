const moment = require('moment-timezone')
const Config = require('../config')
const { smd, prefix, updateProfilePicture, parsedJid, Index } = require('../lib')
const { cmd } = require('../lib/plugins')

const mtypes = ['imageMessage']

// Command to set profile picture
smd(
 {
  pattern: 'pp',
  desc: 'Set profile picture',
  category: 'whatsapp',
  use: '<reply to image>',
  fromMe: true,
  filename: __filename,
 },
 async message => {
  try {
   const messageToUse = mtypes.includes(message.mtype) ? message : message.reply_message
   if (!messageToUse || !mtypes.includes(messageToUse?.mtype || 'need_Media')) {
    return await message.reply('*Reply to an image, dear*')
   }
   return await updateProfilePicture(message, message.user, messageToUse, 'pp')
  } catch (error) {
   await message.error(error + '\n\ncommand : pp', error)
  }
 }
)

// Command to set full screen profile picture
smd(
 {
  pattern: 'fullpp',
  desc: 'Set full screen profile picture',
  category: 'whatsapp',
  use: '<reply to image>',
  fromMe: true,
  filename: __filename,
 },
 async message => {
  try {
   const messageToUse = mtypes.includes(message.mtype) ? message : message.reply_message
   if (!messageToUse || !mtypes.includes(messageToUse?.mtype || 'need_Media')) {
    return await message.reply('*Reply to an image, dear*')
   }
   return await updateProfilePicture(message, message.user, messageToUse, 'fullpp')
  } catch (error) {
   await message.error(error + '\n\ncommand : fullpp', error)
  }
 }
)

// Command to remove profile picture
smd(
 {
  pattern: 'rpp',
  desc: 'remove profile picture',
  category: 'whatsapp',
  use: '<chat>',
  fromMe: true,
  filename: __filename,
 },
 async message => {
  try {
   await message.removepp()
   message.send('*_Profile picture removed successfully!_*')
  } catch (error) {
   await message.error(error + '\n\ncommand : rpp', error)
  }
 }
)

// Command to update profile status
smd(
 {
  pattern: 'bio',
  desc: 'update profile status of whatsapp',
  category: 'whatsapp',
  use: '<text>',
  fromMe: true,
  filename: __filename,
 },
 async (message, text) => {
  try {
   if (!text) {
    return await message.send('*_provide text to update profile status!_*\n*_Example: ' + prefix + 'bio Asta Md_*')
   }
   await message.bot.updateProfileStatus(text)
   message.send('*Profile status updated successfully!*')
  } catch (error) {
   await message.error(error + '\n\ncommand : bio', error)
  }
 }
)

// Command to send viewOnce Message of video
cmd(
 {
  pattern: 'ptv',
  desc: 'send ptv Message of video',
  category: 'whatsapp',
  filename: __filename,
 },
 async (message, match, { cmdName }) => {
  try {
   if (!message.quoted) {
    return await message.send('*Uhh Please, reply to video*')
   }
   const quotedMessageType = message.quoted.mtype
   if (quotedMessageType !== 'videoMessage') {
    return await message.send('*Uhh Dear, reply to a video message*')
   }
   return await message.bot.forwardOrBroadCast(message.chat, message.quoted, {}, 'ptv')
  } catch (error) {
   await message.error(error + '\n\ncommand : ptv', error)
  }
 }
)

// Command to save Message to log number
cmd(
 {
  pattern: 'slog',
  desc: 'Save Message to log number',
  category: 'whatsapp',
  filename: __filename,
 },
 async message => {
  try {
   const repliedMessage = message.reply_message
   if (!repliedMessage) {
    return await message.send('*Uhh Please, reply to a Message*')
   }
   await message.bot.forwardOrBroadCast(message.user, repliedMessage)
  } catch (error) {
   await message.error(error + '\n\ncommand : save', error)
  }
 }
)

// Command to get reply Message from Replied Message
cmd(
 {
  pattern: 'quoted',
  desc: 'get reply Message from Replied Message',
  category: 'user',
  filename: __filename,
 },
 async message => {
  try {
   if (!message.quoted) {
    return await message.send('*_Uhh Dear, Reply to a Message_*')
   }
   const serializedMessage = await message.bot.serializeM(await message.getQuotedObj())
   if (!serializedMessage || !serializedMessage.quoted) {
    return await message.replay('*Message you replied does not contain a reply Message*')
   }
   await message.react('✨', message)
   return await message.bot.copyNForward(message.chat, serializedMessage.quoted, false)
  } catch (error) {
   await message.error(error + '\n\ncommand : quoted', error)
  }
 }
)

// Command to get list of all Blocked Numbers
cmd(
 {
  pattern: 'blocklist',
  desc: 'get list of all Blocked Numbers',
  category: 'whatsapp',
  fromMe: true,
  filename: __filename,
  use: '<text>',
 },
 async message => {
  try {
   const blocklist = await message.bot.fetchBlocklist()
   if (blocklist.length === 0) {
    return await message.reply("Uhh Dear, You don't have any Blocked Numbers.")
   }
   let response = '\n*≡ List*\n\n*_Total Users:* ' + blocklist.length + '_\n\n┌─⊷ \t*BLOCKED USERS*\n'
   for (let i = 0; i < blocklist.length; i++) {
    response += '▢ ' + (i + 1) + ':- wa.me/' + blocklist[i].split('@')[0] + '\n'
   }
   response += '└───────────'
   return await message.bot.sendMessage(message.chat, { text: response })
  } catch (error) {
   await message.error(error + '\n\ncommand : blocklist', error)
  }
 }
)

// Command to send location based on given coordinates
cmd(
 {
  pattern: 'location',
  desc: 'Adds *readmore* in given text.',
  category: 'whatsapp',
  filename: __filename,
 },
 async (message, coordinates) => {
  try {
   if (!coordinates) {
    return await message.reply(
     '*Give Coordinates To Send Location!*\n *Ex: ' + prefix + 'location 24.121231,55.1121221*'
    )
   }
   const [latitude, longitude] = coordinates.split(',').map(parseFloat)
   if (!latitude || isNaN(latitude) || !longitude || isNaN(longitude)) {
    return await message.reply('*_Coordinates Not In Format, Try Again_*')
   }
   await message.reply(
    '*----------LOCATION------------*\n```Sending Location Of Given Data:\n Latitude: ' +
     latitude +
     '\n Longitude: ' +
     longitude +
     '```\n\n' +
     Config.caption
   )
   return await message.sendMessage(
    message.jid,
    {
     location: { degreesLatitude: latitude, degreesLongitude: longitude },
    },
    { quoted: message }
   )
  } catch (error) {
   await message.error(error + '\n\ncommand : location', error)
  }
 }
)

// Command to find info about personal chats
smd(
 {
  pattern: 'listpc',
  category: 'whatsapp',
  desc: 'Finds info about personal chats',
  filename: __filename,
 },
 async (message, match, { store }) => {
  try {
   message.react('🫡')
   const personalChats = await store.chats
    .all()
    .filter(chat => chat.id.endsWith('.net'))
    .map(chat => chat)
   let response =
    ' 「  ' +
    Config.botname +
    "'s pm user list  」\n\nTotal " +
    personalChats.length +
    ' users are text in personal chat.'
   for (const chat of personalChats) {
    response +=
     '\n\nUser: @' +
     chat.id.split('@')[0] +
     '\nMessages : ' +
     chat.unreadCount +
     '\nLastchat : ' +
     moment(chat.conversationTimestamp * 1000)
      .tz(timezone)
      .format('DD/MM/YYYY HH:mm:ss')
   }
   message.bot.sendTextWithMentions(message.chat, response, message)
  } catch (error) {
   await message.error(error + '\n\n command: listpc', error, "*_Didn't get any results, Sorry!_*")
  }
 }
)

// Command to find info about all active groups
smd(
 {
  pattern: 'listgc',
  category: 'whatsapp',
  desc: 'Finds info about all active groups',
  filename: __filename,
 },
 async (message, match, { store, Void }) => {
  try {
   message.react('🫡')
   const activeGroups = await store.chats
    .all()
    .filter(chat => chat.id.endsWith('@g.us'))
    .map(chat => chat)
   let response =
    ' 「  ' + Config.botname + "'s Group user list  」\n\n" + 'Total users are' + activeGroups.length + '.'
   for (const chat of activeGroups) {
    response +=
     '\n\nUser: @' +
     chat.id.split('@')[0] +
     '\nMessages : ' +
     chat.unreadCount +
     '\nLastchat : ' +
     moment(chat.conversationTimestamp * 1000)
      .tz(timezone)
      .format('DD/MM/YYYY HH:mm:ss')
   }
   message.bot.sendTextWithMentions(message.chat, response, message)
  } catch (error) {
   await message.error(error + '\n\n command: listgc', error, "*_Didn't get any results, Sorry!_*")
  }
 }
)
Index(
 {
  pattern: 'vv',
  desc: 'download viewOnce Message.',
  category: 'whatsapp',
 },
 async (event, query) => {
  try {
   let viewOnceMessage = false
   if (event.reply_message) {
    if (
     event.reply_message.viewOnce ||
     (event.device === 'ios' && /audioMessage|videoMessage|imageMessage/g.test(event.reply_message.mtype))
    ) {
     viewOnceMessage = event.reply_message
    }
   }
   viewOnceMessage.mtype = viewOnceMessage.mtype2
   if (!viewOnceMessage) {
    return event.reply('```Please Reply A ViewOnce Message```')
   }
   let quotedMessage = {
    key: viewOnceMessage.key,
    message: {
     conversation: '```[VIEWONCE FOUND DOWNLOAD 100%]```',
    },
   }
   let downloadedMedia = await event.bot.downloadAndSaveMediaMessage(viewOnceMessage.msg)
   await event.bot.sendMessage(
    event.sender, // Send to user's personal chat
    {
     [viewOnceMessage.mtype2.split('Mess')[0]]: {
      url: downloadedMedia,
     },
     caption: viewOnceMessage.body,
    },
    { quoted: quotedMessage }
   )
  } catch (error) {
   await event.error(error + '\n\ncommand: vv', error)
  }
 }
)
