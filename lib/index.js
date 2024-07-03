const Config = require('../config')
const fs = require('fs')
const {
 pinterest,
 tlang,
 botpic,
 language,
 getString,
 wikimedia,
 toAudio,
 toPTT,
 toVideo,
 sync,
 syncgit,
 ffmpeg,
 TelegraPh,
 UploadFileUgu,
 webp2mp4File,
 fancy,
 randomfancy,
 ringtone,
 styletext,
 isAdmin,
 isBotAdmin,
 createUrl,
 mediafireDl,
 mediafire,
 dare,
 truth,
 random_question,
 amount_of_questions,
} = require('./scraper')
const acrcloud = require('./functions/arc.js')
const {
 unixTimestampSecond,
 generateMessageTag,
 processTime,
 getBuffer,
 fetchJson,
 runtime,
 clockString,
 sleep,
 isUrl,
 getTime,
 formatDate,
 formatp,
 jsonformat,
 logic,
 generateProfilePicture,
 bytesToSize,
 getSizeMedia,
 parseMention,
 GIFBufferToVideoBuffer,
} = require('./serials')
const {
 listall,
 strikeThrough,
 wingdings,
 vaporwave,
 typewriter,
 analucia,
 tildeStrikeThrough,
 underline,
 doubleUnderline,
 slashThrough,
 sparrow,
 heartsBetween,
 arrowBelow,
 crossAboveBelow,
 creepify,
 bubbles,
 mirror,
 squares,
 roundsquares,
 flip,
 tiny,
 createMap,
 serif_I,
 manga,
 ladybug,
 runes,
 serif_B,
 serif_BI,
 fancy1,
 fancy2,
 fancy3,
 fancy4,
 fancy5,
 fancy6,
 fancy7,
 fancy8,
 fancy9,
 fancy10,
 fancy11,
 fancy12,
 fancy13,
 fancy14,
 fancy15,
 fancy16,
 fancy17,
 fancy18,
 fancy19,
 fancy20,
 fancy21,
 fancy22,
 fancy23,
 fancy24,
 fancy25,
 fancy26,
 fancy27,
 fancy28,
 fancy29,
 fancy30,
 fancy31,
 fancy32,
 fancy33,
 randomStyle,
} = require('./fonts')
const { sck1 } = require('./database/user.js')
const { sck } = require('./database/group.js')
const { alive } = require('./database/alive.js')
const { pg, dbs, groupdb, userdb, alivedb, bot_ } = require('./program.js')
const { cmd, smd, commands, Index } = require('./plugins.js')
const {
 sendAnimeReaction,
 yt,
 sendGImages,
 AudioToBlackVideo,
 textToLogoGenerator,
 photoEditor,
 updateProfilePicture,
 getRandomFunFact,
 getRandom,
 generateSticker,
 forwardMessage,
 plugins,
 audioEditor,
 send,
 react,
 note,
 sendWelcome,
 aitts,
} = require('./utils.js')
const { ping } = require('./Base/class.js')
const { smsg, callsg } = require('./waCinary.js')
const { aiResponse } = require('./functions/Ai.js')
async function isValidUrl(url) {
    try {
     new URL(url)
     return true
    } catch (_) {
     return false
    }
   }
module.exports = {
 yt,
 note,
 pg,
 dbs,
 bot_,
 alive,
 sck,
 sck1,
 language,
 commands,
 formatp,
 groupdb,
 userdb,
 alivedb,
 prefix: Config.HANDLERS.includes('null') ? '' : Config.HANDLERS[0],
 Config: Config,
 setting: Config,
 aiResponse,
 isValidUrl,
 smsg,
 callsg,
 ping,
 Index,
 plugins,
 forwardMessage,
 updateProfilePicture,
 sendAnimeReaction,
 sendGImages,
 textToLogoGenerator,
 photoEditor,
 updateProfilePicture,
 getRandomFunFact,
 AudioToBlackVideo,
 getRandom,
 generateSticker,
 audioEditor,
 send,
 react,
 sendWelcome,
 aitts,
 smd,
 addCommand: cmd,
 pinterest,
 tlang,
 botpic,
 getString,
 wikimedia,
 toAudio,
 toPTT,
 toVideo,
 sync,
 syncgit,
 ffmpeg,
 TelegraPh,
 UploadFileUgu,
 webp2mp4File,
 fancy,
 randomfancy,
 ringtone,
 styletext,
 isAdmin,
 isBotAdmin,
 createUrl,
 mediafireDl,
 mediafire,
 dare,
 truth,
 random_question,
 amount_of_questions,
 unixTimestampSecond,
 generateMessageTag,
 processTime,
 getBuffer,
 fetchJson,
 runtime,
 clockString,
 sleep,
 isUrl,
 getTime,
 formatDate,
 jsonformat,
 logic,
 generateProfilePicture,
 bytesToSize,
 getSizeMedia,
 parseMention,
 GIFBufferToVideoBuffer,
 pinterest,
 tlang,
 botpic,
 getString,
 wikimedia,
 toAudio,
 toPTT,
 toVideo,
 sync,
 syncgit,
 ffmpeg,
 TelegraPh,
 UploadFileUgu,
 webp2mp4File,
 fancy,
 randomfancy,
 listall,
 strikeThrough,
 wingdings,
 vaporwave,
 typewriter,
 analucia,
 tildeStrikeThrough,
 underline,
 doubleUnderline,
 slashThrough,
 sparrow,
 heartsBetween,
 arrowBelow,
 crossAboveBelow,
 creepify,
 bubbles,
 mirror,
 squares,
 roundsquares,
 flip,
 tiny,
 createMap,
 serif_I,
 manga,
 ladybug,
 runes,
 serif_B,
 serif_BI,
 fancy1,
 fancy2,
 fancy3,
 fancy4,
 fancy5,
 fancy6,
 fancy7,
 fancy8,
 fancy9,
 fancy10,
 fancy11,
 fancy12,
 fancy13,
 fancy14,
 fancy15,
 fancy16,
 fancy17,
 fancy18,
 fancy19,
 fancy20,
 fancy21,
 fancy22,
 fancy23,
 fancy24,
 fancy25,
 fancy26,
 fancy27,
 fancy28,
 fancy29,
 fancy30,
 fancy31,
 fancy32,
 fancy33,
 randomStyle,
 stor: async () => {
  return await JSON.parse(fs.readFileSync(__dirname + '/store.json', 'utf8'))
 },

 fancytext: (inputText, position) => {
  position = position - 1
  return listall(inputText)[position]
 },

 parsedJid: (text = '') => {
  return text.match(/[0-9]+(-[0-9]+|)(@g.us|@s.whatsapp.net)/g) || []
 },

 getAdmin: async (groupInstance, chatInstance) => {
  const groupMetadata = await groupInstance.groupMetadata(chatInstance.chat)
  const adminList = []
  for (let participant of groupMetadata.participants) {
   if (participant.admin == null) {
    continue
   }
   adminList.push(participant.id)
  }
  return adminList
 },

 isGroup: jid => {
  return jid.endsWith('@g.us')
 },

 parseurl: url => {
  return url.match(
   new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/,
    'gi'
   )
  )
 },

 isInstaUrl: url => {
  return /(?:(?:http|https):\/\/)?(?:www.)?(?:instagram.com|instagr.am|instagr.com)\/(\w+)/gim.test(url)
 },

 isNumber: function () {
  const parsedNumber = parseInt(this)
  return typeof parsedNumber === 'number' && !isNaN(parsedNumber)
 },

 shazam: async function (audioData) {
  const shazamClient = new acrcloud({
   host: 'identify-eu-west-1.acrcloud.com',
   endpoint: '/v1/identify',
   signature_version: '1',
   data_type: 'audio',
   secure: true,
   access_key: 'c816ad50a2bd6282e07b90447d93c38c',
   access_secret: 'ZpYSwmCFpRovcSQBCFCe1KArX7xt8DTkYx2XKiIP',
  })

  const identificationResult = await shazamClient.identify(audioData)
  const { code, msg } = identificationResult.status

  if (code !== 0) {
   return msg
  }

  const { title, artists, album, genres, release_date, external_metadata } = identificationResult.metadata.music[0]

  const { youtube, spotify } = external_metadata

  return {
   status: 200,
   title,
   artists: artists ? artists.map(artist => artist.name).join(', ') : '',
   genres: genres ? genres.map(genre => genre.name).join(', ') : '',
   release_date,
   album: album.name || '',
   data: identificationResult,
  }
 },
}
