const { Index } = require('../lib')
const TelegramStickers = require('../lib/Base/social')
const InstaDl = require('../lib/Base/social')
const fbDl = require('../lib/Base/social')
const SearchApk = require('../lib/Base/social')
const SoundCloud = require('../lib/Base/social')
const ApkDl = require('../lib/Base/social')
const Wiki = require('../lib/Base/social')
const fbToAudio = require('../lib/Base/social')
const spotifyDL = require('../lib/Base/social')
const googleDriveDl = require('../lib/Base/social')
const AllSocial = require('../lib/Base/social')

Index(
 {
  pattern: 'dlsoc',
  desc: 'Download media from various social platforms.',
  category: 'downloader',
 },
 AllSocial
)
Index(
 {
  pattern: 'gdrive',
  desc: 'Download files from Google Drive.',
  category: 'downloader',
 },
 googleDriveDl
)
Index(
 {
  pattern: 'spotify',
  desc: 'Downloads a Spotify song.',
  category: 'downloader',
 },
 spotifyDL
)

Index(
 {
  pattern: 'tgs',
  desc: 'Downloads telegram stickers.',
  category: 'downloader',
 },
 TelegramStickers
)
Index(
 {
  pattern: 'fbaudio',
  desc: 'Downloads Facebook videos in audio.',
  category: 'downloader',
 },
 fbToAudio
)
Index(
 {
  pattern: 'insta',
  desc: 'Download media from Instagram.',
  category: 'downloader',
 },
 InstaDl
)
Index(
 {
  pattern: 'wikimedia',
  desc: 'Downloads wikimedia images.',
  category: 'downloader',
 },
 Wiki
)
Index(
 {
  pattern: 'facebook',
  desc: 'Downloads Facebook videos in HD.',
  category: 'downloader',
 },
 fbDl
)
Index(
 {
  pattern: 'apkdl',
  desc: 'Downloads apk.',
  category: 'downloader',
 },
 ApkDl
)
Index(
 {
  pattern: 'srcapk',
  desc: 'Search App',
  category: 'downloader',
 },
 SearchApk
)
Index(
 {
  pattern: 'scloud',
  desc: 'Download audio from SoundCloud.',
  category: 'downloader',
 },
 SoundCloud
)
Index(
 {
  pattern: 'gitclone',
  desc: 'Downloads apks  .',
  category: 'downloader',
  filename: __filename,
  use: '<add sticker url.>',
 },
 async (_0x1ae8f8, _0x1c586e) => {
  try {
   let _0x59e849 = _0x1c586e ? _0x1c586e : _0x1ae8f8.reply_message ? _0x1ae8f8.reply_message.text : ''
   if (!_0x1c586e) {
    return await _0x1ae8f8.reply('*Provide Repo Url, _.gitclone https://github.com/Astropeda/Asta-Md_*')
   }
   const _0x5906ab = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
   if (!_0x5906ab.test(_0x1c586e)) {
    return await _0x1ae8f8.reply('*Provide Valid Repositry Url*')
   }
   let [_0x3b1b37, _0x2f1dcc, _0x83a6d7] = _0x1c586e.match(_0x5906ab) || []
   _0x83a6d7 = _0x83a6d7.replace(/.git$/, '')
   let _0x3e5a6d = 'https://api.github.com/repos/' + _0x2f1dcc + '/' + _0x83a6d7 + '/zipball'
   let _0x2cb6ba = (
    await fetch(_0x3e5a6d, {
     method: 'HEAD',
    })
   ).headers
    .get('content-disposition')
    .match(/attachment; filename=(.*)/)[1]
   await _0x1ae8f8.bot.sendMessage(_0x1ae8f8.jid, {
    document: {
     url: _0x3e5a6d,
    },
    fileName: _0x2cb6ba,
    mimetype: 'application/zip',
   })
  } catch (_0x982fee) {
   return _0x1ae8f8.error(_0x982fee + '\n\ncommand: gitclone', _0x982fee, '*_File not found!!!_*')
  }
 }
)
const ytIdRegex =
 /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
Index(
 {
  pattern: 'tts',
  desc: 'text to speech.',
  category: 'downloader',
  filename: __filename,
  use: '<Hii,this is Asta>',
 },
 async (_0x55aba2, _0x56da6b) => {
  try {
   let _0x204f81 = _0x55aba2.reply_text ? _0x55aba2.reply_text : _0x56da6b
   if (!_0x204f81) {
    return _0x55aba2.reply('*_Example : .tts Hi,I am Asta-Md whatsapp bot._*')
   }
   try {
    let _0x1974d5 = _0x56da6b ? _0x56da6b.split(' ')[0].toLowerCase() : 'en'
    const _0x18d003 = googleTTS.getAudioUrl(_0x204f81, {
     lang: _0x1974d5,
     slow: true,
     host: 'https://translate.google.com',
    })
    await _0x55aba2.bot.sendMessage(
     _0x55aba2.jid,
     {
      audio: {
       url: _0x18d003,
      },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: 'Asta-Md-tts.m4a',
     },
     {
      quoted: _0x55aba2,
     }
    )
   } catch (_0x3537cb) {
    const _0x5596bc = googleTTS.getAudioUrl(_0x204f81, {
     lang: 'en',
     slow: true,
     host: 'https://translate.google.com',
    })
    await _0x55aba2.bot.sendMessage(
     _0x55aba2.jid,
     {
      audio: {
       url: _0x5596bc,
      },
      mimetype: 'audio/mpeg',
      ptt: true,
      fileName: 'Asta-Md-tts.m4a',
     },
     {
      quoted: _0x55aba2,
     }
    )
   }
  } catch (_0x1313db) {
   return _0x55aba2.error(_0x1313db + '\n\ncommand: tts', _0x1313db, false)
  }
 }
)
Index(
 {
  pattern: 'downmp4',
  alias: ['mp4down', 'mp4fromurl'],
  desc: 'download mp4 from url.',
  category: 'downloader',
  use: '<url>',
  filename: __filename,
 },
 async (_0x272f8d, _0x3c482f) => {
  try {
   let _0x53783b = ('' + (_0x3c482f ? _0x3c482f : _0x272f8d.reply_text)).split(' ')[0].toLowerCase().trim()
   if (!_0x53783b || !_0x53783b.toLowerCase().startsWith('http')) {
    return _0x272f8d.reply(
     '*_Give me Video Link, ' + prefix + 'downmp4 https://telegra.ph/file/d90855d13352c8aae3981.mp4_*'
    )
   }
   var _0x1e4a34 = _0x3c482f.toLowerCase().includes('doc') ? 'document' : 'video'
   await _0x272f8d.bot.sendMessage(
    _0x272f8d.chat,
    {
     [_0x1e4a34]: {
      url: _0x53783b,
     },
     caption: '*HERE WE GO*',
     contextInfo: {
      ...(await _0x272f8d.bot.contextInfo(Config.botname, _0x272f8d.senderName)),
     },
    },
    {
     quoted: _0x272f8d,
    }
   )
  } catch (_0x2306b6) {
   await _0x272f8d.error(_0x2306b6 + '\n\ncommand : downmp4', _0x2306b6, '*_Please, Give me valid video url!_*')
  }
 }
)
Index(
 {
  pattern: 'video2',
  desc: 'Downloads video from YouTube using yt-search.',
  category: 'downloader',
  filename: __filename,
  use: '<video title or URL>',
 },
 async (message, query) => {
  try {
   const input = query || message.reply_text
   if (!input) {
    return message.reply(`*Use: ${prefix}video2 <video title or URL>*`)
   }

   const videoUrl = ytIdRegex.exec(input) || (await getVideoUrl(input)).videos[0].url
   if (!videoUrl) {
    return message.reply('*No video found!*')
   }

   const info = await yt.getInfo(ytIdRegex.exec(videoUrl)[1])
   const fileType = info.duration >= videotime ? 'document' : 'video'
   const downloadOptions = {
    type: 'video',
    quality: info.pref_Quality || 'best',
    format: 'mp4',
   }

   const videoPath = await yt.download(ytIdRegex.exec(videoUrl)[1], downloadOptions)
   const videoTitle = info.title || ytIdRegex.exec(videoUrl)[1]
   const contextInfo = await message.bot.contextInfo(Config.botname, 'VIDEO DOWNLOADER')

   if (videoPath) {
    await message.bot.sendMessage(message.chat, {
     [fileType]: { url: videoPath },
     fileName: videoTitle,
     caption: Config.caption,
     mimetype: 'video/mp4',
     contextInfo,
    })
    fs.unlinkSync(videoPath)
   } else {
    message.send('*Video not found!*')
   }
  } catch (error) {
   console.error('Video download error:', error)
   message.error(`${error}\n\ncommand: video2`, error, '*_Video not found_*')
  }
 }
)

async function getVideoUrl(query) {
 try {
  const searchResults = await yts(query)
  if (searchResults.videos.length > 0) {
   return searchResults.videos[0].url
  }
 } catch (error) {
  console.error('Video search error:', error)
 }
 return false
}
Index(
 {
  pattern: 'play',
  alias: ['music'],
  desc: 'Sends info about the query(of youtube video/audio).',
  category: 'downloader',
  filename: __filename,
  use: '<faded-Alan walker.>',
 },
 async (_0x54463e, _0x1f76d0) => {
  try {
   let _0x25d045 = _0x1f76d0 ? _0x1f76d0 : _0x54463e.reply_text
   var _0x2e913a = _0x25d045.toLowerCase().includes('doc') ? 'document' : 'audio'
   if (!_0x25d045) {
    return _0x54463e.reply('*' + prefix + 'play back in black*')
   }
   let _0x2eca3d = ytIdRegex.exec(_0x25d045) || []
   let _0xb6fd2d = _0x2eca3d[0] || false
   if (!_0xb6fd2d) {
    let _0x4bcf6d = await yts(_0x25d045)
    let _0xa244ed = _0x4bcf6d.videos[0]
    _0xb6fd2d = _0xa244ed.url
   }
   _0x2eca3d = ytIdRegex.exec(_0xb6fd2d) || []
   let _0x6845ab = await yt.getInfo(_0x2eca3d[1])
   let _0x516e89 = _0x6845ab.title || _0x37323e || _0x2eca3d[1]
   if (_0x6845ab && _0x6845ab.duration >= videotime) {
    return await _0x54463e.reply("*_Can't dowanload, file duration too big_*")
   }
   await _0x54463e.send('_Downloading ' + _0x6845ab.title + '?_')
   let _0x37323e = await yt.download(_0x2eca3d[1], {
    type: 'audio',
    quality: 'best',
   })
   var _0x28302f = {
    ...(await _0x54463e.bot.contextInfo(Config.botname, 'ꜱᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ')),
   }
   if (_0x37323e) {
    await _0x54463e.bot.sendMessage(_0x54463e.jid, {
     [_0x2e913a]: {
      url: _0x37323e,
     },
     fileName: _0x516e89,
     mimetype: 'audio/mpeg',
     contextInfo: _0x28302f,
    })
   } else {
    _0x54463e.send('*_Video not Found_*')
   }
   try {
    fs.unlinkSync(_0x37323e)
   } catch {}
  } catch (_0x593953) {
   return _0x54463e.error(_0x593953 + '\n\ncommand: play', _0x593953, '*_Video not Found_*')
  }
 }
)
Index(
 {
  pattern: 'sound',
  desc: 'Downloads ringtone.',
  category: 'downloader',
  filename: __filename,
  use: '<Dowanload Tiktok Sounds>',
 },
 async (_0x2ee3dd, _0x20a520) => {
  try {
   if (!_0x20a520) {
    return _0x2ee3dd.reply('*Give A Number Example: ' + prefix + 'sound 5*')
   }
   const _0x19c223 = parseInt(_0x20a520)
   if (_0x19c223.toString() == 'NaN' || _0x19c223 < 1 || _0x19c223 > 160) {
    return _0x2ee3dd.reply('*_❌ Give a number between 1 to 160_*')
   }
   let _0xf0331a =
    'https://github.com/DGXeon/Tiktokmusic-API/raw/master/tiktokmusic/sound' + _0x19c223.toString() + '.mp3'
   let _0x2ba501 = await getBuffer(_0xf0331a)
   var _0x29fdd9 = {
    ...(await _0x2ee3dd.bot.contextInfo(Config.botname, 'ᴛɪᴋᴛᴏᴋ ꜱᴏᴜɴᴅ ' + _0x19c223)),
   }
   let _0x4737bb = {
    audio: _0x2ba501,
    fileName: 'Asta-Md tiktok Sound' + _0x19c223 + '.m4a',
    mimetype: 'audio/mpeg',
    ptt: true,
    contextInfo: _0x29fdd9,
   }
   return _0x2ee3dd.bot.sendMessage(_0x2ee3dd.chat, _0x4737bb, {
    quoted: _0x2ee3dd,
   })
  } catch (_0x223ebb) {
   return _0x2ee3dd.error(_0x223ebb + '\n\ncommand: sound', _0x223ebb, false)
  }
 }
)
Index(
 {
  pattern: 'tiktok',
  alias: ['tt', 'ttdl'],
  desc: 'Downloads Tiktok Videos Via Url.',
  category: 'downloader',
  filename: __filename,
  use: '<add tiktok url.>',
 },
 async (message, url) => {
  try {
   const fileType = url.toLowerCase().includes('doc')
    ? 'document'
    : url.toLowerCase().includes('mp3')
    ? 'audio'
    : 'video'

   if (!url) {
    return await message.reply(
     `*Uhh Please, Provide me tiktok Video Url*\n*_Ex ${prefix}tiktok https://www.tiktok.com/@dakwahmuezza/video/7150544062221749531_*`
    )
   }

   const tiktokUrl = url ? url.split(' ')[0] : ''

   if (!/tiktok/.test(tiktokUrl)) {
    return await message.reply('*Uhh Please, Give me Valid Tiktok Video Url!*')
   }

   const apiUrl = 'https://api-smd.onrender.com/api/ttdl2'
   const response = await fetch(`${apiUrl}?url=${tiktokUrl}`)
   const data = await response.json()

   if (data && data.video && data.video.noWatermark) {
    return await message.send(data.video.noWatermark, { caption: Config.caption }, fileType, message)
   } else {
    return await message.reply('Error While Downloading Your Video')
   }
  } catch (error) {
   return message.error(`${error}\n\ncommand: tiktok`, error)
  }
 }
)
Index(
 {
  pattern: 'tiktok2',
  desc: 'Downloads Tiktok Videos Via Url.',
  category: 'downloader',
  filename: __filename,
  use: '<add tiktok url.>',
 },
 async (message, url) => {
  try {
   if (!url) {
    return await message.reply(
     `*Uhh Please, Provide me tiktok Video Url*\n*_Ex ${prefix}tiktok https://www.tiktok.com/@dakwahmuezza/video/7150544062221749531_*`
    )
   }

   const tiktokUrl = url.split(' ')[0]
   if (!/tiktok/.test(tiktokUrl)) {
    return await message.reply('*Uhh Please, Give me Valid Tiktok Video Url!*')
   }

   const apiUrl = `https://api.maher-zubair.tech/download/tiktok?url=${encodeURIComponent(tiktokUrl)}`
   const response = await fetchJson(apiUrl)

   if (response.status !== 200) {
    return await message.reply(`*Error: ${response.result}*`)
   }

   const videoUrl = response.result
   const fileType = videoUrl.toLowerCase().includes('mp4') ? 'video' : 'document'

   await message.send(videoUrl, { caption: Config.caption }, fileType, message)
  } catch (error) {
   console.error(error)
   return message.error(`${error}\n\ncommand: tiktok`, error)
  }
 }
)
Index(
 {
  pattern: 'ringtone',
  desc: 'Downloads ringtone.',
  category: 'downloader',
  filename: __filename,
  use: '<ringtone name>',
 },
 async (_0x1da3da, _0x2f0451) => {
  try {
   if (!_0x2f0451) {
    return _0x1da3da.reply('Example: ' + prefix + 'ringtone back in black')
   }
   const { ringtone: _0x2ec04e } = require('../lib/scraper')
   let _0x5f35d4 = await _0x2ec04e(_0x2f0451)
   var _0x2e165b = {
    ...(await _0x1da3da.bot.contextInfo(Config.botname, 'ʀɪɴɢᴛᴏɴᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ')),
   }
   let _0x5c9751 = {
    audio: {
     url: _0x5f35d4[0].audio,
    },
    caption: '*' + _0x5f35d4[0].title + '*',
    fileName: _0x5f35d4[0].title + '.mp3',
    mimetype: 'audio/mpeg',
    contextInfo: _0x2e165b,
   }
   return _0x1da3da.bot.sendMessage(_0x1da3da.jid, _0x5c9751, {
    quoted: _0x1da3da,
   })
  } catch (_0x430a86) {
   return _0x1da3da.error(_0x430a86 + '\n\ncommand: ringtone', _0x430a86, '*_Ringtone not found with given name!!_*')
  }
 }
)
Index(
 {
  pattern: 'pinterest',
  desc: 'Downloads images from Pinterest.',
  category: 'downloader',
  filename: __filename,
  use: '<text|image name>',
 },
 async (m, query) => {
  try {
   if (!query) {
    return m.reply('What picture are you looking for?')
   }

   const apiUrl = `https://api.maher-zubair.tech/search/pinterest?q=${encodeURIComponent(query)}`
   const response = await fetch(apiUrl)

   if (!response.ok) {
    return m.reply(`*_Error: ${response.status} ${response.statusText}_*`)
   }

   const data = await response.json()
   const results = data.result

   if (!results || !results.length) {
    return await m.send('*_No Result found!_*')
   }

   const contextInfo = {
    ...(await m.bot.contextInfo(Config.botname, 'ᴘɪɴᴛᴇʀᴇꜱᴛ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ')),
   }

   const maxResults = results.length < 5 ? results.length : 5
   for (let i = 0; i < maxResults; i++) {
    await m.bot.sendMessage(m.chat, {
     image: { url: results[i] },
     contextInfo,
    })
   }
  } catch (e) {
   return m.reply('Uhh Please, Give me a Name. Ex .pintrest apple')
  }
 }
)
Index(
 {
  pattern: 'mediafire',
  alias: ['mf', 'mfire'],
  desc: 'Downloads media from Mediafire.',
  category: 'downloader',
  filename: __filename,
  use: '<url of mediafire>',
 },
 async (m, url) => {
  try {
   if (!url || !url.includes('mediafire.com')) {
    return m.reply(
     `*_Provide mediafire url, Use: ${prefix}mf https://www.mediafire.com/file/i33wo2xvgvid05m/muezzaverse_2221749531_musicaldown.com.mp4/file!_*`
    )
   }

   const apiUrl = `https://api.maher-zubair.tech/download/mediafire?url=${encodeURIComponent(url)}`
   const response = await fetch(apiUrl)

   if (!response.ok) {
    return m.reply(`*_Error: ${response.status} ${response.statusText}_*`)
   }

   const data = await response.json()
   const result = data.result

   if (!result || !result.link) {
    return m.reply('*_Could not find the file!_*')
   }

   const caption = `『 *Mᴇᴅɪᴀғɪʀᴇ Dᴏᴡɴʟᴏᴀᴅᴇʀ* 』\n\n *Name* : ${result.name}\n *Size* : ${result.size}\n *Mime* : ${result.mime}\n\n\n${Config.caption}`
   const fancyCaption = await fancytext(caption, 25)
   const contextInfo = {
    ...(await m.bot.contextInfo(Config.botname, 'MEDIAFIRE')),
   }

   const mediaInfo = {
    document: {
     url: result.link,
    },
    caption: fancyCaption,
    fileName: result.name,
    mimetype: result.mime,
    contextInfo: contextInfo,
   }

   await m.bot.sendMessage(m.chat, mediaInfo)
  } catch (e) {
   m.error(`${e}\n\ncommand: mediafire`, e, '*_File not found!!_*')
  }
 }
)
Index(
 {
  pattern: 'song',
  alias: ['audio'],
  desc: 'Downloads audio from youtube.',
  category: 'downloader',
  filename: __filename,
  use: '<give text>',
 },
 async (_0x2c2023, _0x4ec99f) => {
  try {
   if (!_0x4ec99f) {
    return await _0x2c2023.reply('*_Give Me Search Query_*')
   }
   let _0x3b2ca6 = await yts(_0x4ec99f)
   let _0x4123ae = _0x3b2ca6.all[0]
   let _0x5883a9 =
    '\t *ᴀsᴛᴀ-ᴍᴅ • sᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*   \n\n*Title :* ' +
    _0x4123ae.title +
    '\nUrl : ' +
    _0x4123ae.url +
    '\n*Description :* ' +
    _0x4123ae.timestamp +
    '\n*Views :* ' +
    _0x4123ae.views +
    '\n*Uploaded :* ' +
    _0x4123ae.ago +
    '\n*Author :* ' +
    _0x4123ae.author.name +
    '\n\n\n_Reply 1 To Video_ Or _1 document_\n_Reply 2 To Audio_ Or _2 document_'
   let _0x3885cc = await getBuffer(_0x4123ae.thumbnail)
   var _0x44a363 = {
    ...(await _0x2c2023.bot.contextInfo(Config.botname, 'ʏᴏᴜᴛᴜʙᴇ ꜱᴏɴɢ', _0x3885cc)),
   }
   await _0x2c2023.bot.sendMessage(_0x2c2023.jid, {
    image: _0x3885cc,
    caption: _0x5883a9,
    contextInfo: _0x44a363,
   })
  } catch (_0x86b411) {
   return _0x2c2023.error(_0x86b411 + '\n\ncommand: mediafire', _0x86b411, '*_File not found!!_*')
  }
 }
)
Index(
 {
  pattern: 'yts',
  alias: ['yt', 'ytsearch'],
  desc: 'Search Song From youtube',
  category: 'downloader',
  filename: __filename,
  use: '<Yt Search Query>',
 },
 async (_0x1c8285, _0xca939c) => {
  try {
   if (!_0xca939c) {
    return await _0x1c8285.reply('*_Give Me Search Query!_*')
   }
   let _0x2878ec = await yts(_0xca939c)
   let _0x4186e4 =
    '*ᴀsᴛᴀ-ᴍᴅ • ʏᴏᴜᴛᴜʙᴇ ᴅᴏᴡɴʟᴏᴀᴅ* \n*_______________________________* \n\n_Reply Any Number To Download._\n  _For Audio: 1 mp3._\n  _For Video: 1 video._\n  _For document: 1 document._\n\n_Results For : ' +
    _0xca939c +
    '_ \n\n'
   let _0x463366 = 1
   for (let _0x308e22 of _0x2878ec.all) {
    _0x4186e4 +=
     ' \n*' +
     _0x463366++ +
     ' : ' +
     _0x308e22.title +
     (_0x308e22.timestamp ? '(' + _0x308e22.timestamp + ')' : '') +
     '*\n*Url : ' +
     _0x308e22.url +
     '*'
   }
   return await _0x1c8285.sendMessage(
    _0x1c8285.chat,
    {
     image: {
      url: _0x2878ec.all[0].thumbnail,
     },
     caption: _0x4186e4,
    },
    {
     quoted: _0x1c8285,
    }
   )
  } catch (_0x5089b0) {}
 }
)
Index(
 {
  pattern: 'ytmp4',
  alias: ['ytv', 'ytvid', 'ytvideo'],
  desc: 'Downloads video from youtube.',
  category: 'downloader',
  filename: __filename,
  use: '<yt video url>',
 },
 async (_0x1d4717, _0x3716fd) => {
  let _0x2d4f04 = _0x3716fd ? _0x3716fd : _0x1d4717.reply_text
  var _0x58ceb6 = _0x2d4f04.toLowerCase().includes('doc')
   ? 'document'
   : _0x2d4f04.toLowerCase().includes('mp3')
   ? 'audio'
   : 'video'
  const _0x4a3f32 = ytIdRegex.exec(_0x2d4f04) || []
  if (!_0x2d4f04 || !_0x4a3f32[0]) {
   return await _0x1d4717.reply('*_provide youtube video url!_*')
  }
  try {
   let _0x5c93a9 = await ytdl.getInfo(_0x4a3f32[0])
   if (_0x5c93a9.videoDetails.lengthSeconds >= videotime) {
    _0x58ceb6 = 'document'
   }
   let _0x1a3a4c = _0x5c93a9.videoDetails.title
   let _0x1c86b6 = './temp/' + _0x4a3f32[1] + '.mp4'
   const _0x1f15ef = ytdl(_0x4a3f32[0], {
    filter: _0x4c0ea7 => _0x4c0ea7.itag == 22 || _0x4c0ea7.itag == 18,
   }).pipe(fs.createWriteStream(_0x1c86b6))
   await new Promise((_0x517788, _0x429bfa) => {
    _0x1f15ef.on('error', _0x429bfa)
    _0x1f15ef.on('finish', _0x517788)
   })
   var _0x3b1bff = {
    ...(await _0x1d4717.bot.contextInfo(Config.botname, 'ʏᴛᴅʟ ᴠɪᴅᴇᴏ')),
   }
   let _0x4d676e = {
    [_0x58ceb6]: fs.readFileSync(_0x1c86b6),
    mimetype: 'video/mp4',
    fileName: _0x1a3a4c,
    caption: "  *Here's Your Video*\n" + Config.caption,
    contextInfo: _0x3b1bff,
   }
   await _0x1d4717.bot.sendMessage(_0x1d4717.jid, _0x4d676e, {
    quoted: _0x1d4717,
   })
   try {
    return await fs.unlinkSync(_0x1c86b6)
   } catch {}
  } catch (_0x15d510) {
   console.log('here now,ytdl-core error: ', _0x15d510)
   try {
    let _0x5a46ec = await yt.getInfo(_0x4a3f32[1])
    let _0x257939 = {
     type: 'video',
     quality: _0x5a46ec.pref_Quality || 'best',
     format: 'mp4',
    }
    if (_0x5a46ec.duration >= videotime) {
     _0x58ceb6 = 'document'
    }
    let _0x588c42 = await yt.download(_0x4a3f32[1], _0x257939)
    var _0x3b1bff = {
     ...(await _0x1d4717.bot.contextInfo(Config.botname, 'ʏᴏᴜᴛᴜʙᴇ ᴠɪᴅᴇᴏ')),
    }
    let _0x13be6f = _0x5a46ec.title || _0x588c42 || _0x4a3f32[1]
    if (_0x588c42) {
     await _0x1d4717.bot.sendMessage(_0x1d4717.chat, {
      [_0x58ceb6]: {
       url: _0x588c42,
      },
      fileName: _0x13be6f,
      mimetype: 'video/mp4',
      contextInfo: _0x3b1bff,
     })
    } else {
     await _0x1d4717.send('*_Video not Found_*')
    }
    try {
     fs.unlinkSync('' + _0x588c42)
    } catch {}
    return
   } catch (_0x363775) {
    return _0x1d4717.error(_0x363775 + '\n\ncommand: ytmp4', _0x363775, '*_Uhh dear, Video not Found!!_*')
   }
  }
 }
)
Index(
 { pattern: 'threads', category: 'downloader', filename: __filename, desc: 'Download media from Threads.' },
 async (m, text) => {
  try {
   if (!text) return await m.send('*_Please provide a Threads link_*')

   let apiUrl = `https://api.maher-zubair.tech/download/threads?url=${text}`
   let response = await fetch(apiUrl)
   let jsonResponse = await response.json()

   if (jsonResponse.status === 200) {
    let result = jsonResponse.result
    let imageUrls = result.image_urls
    let videoUrls = result.video_urls

    if (imageUrls.length > 0) {
     for (let imageUrl of imageUrls) {
      await m.send(imageUrl, { caption: Config.caption }, 'image', m)
     }
    }

    if (videoUrls.length > 0) {
     for (let videoUrl of videoUrls) {
      await m.send(videoUrl, { caption: Config.caption }, 'video', m)
     }
    }
   } else {
    await m.send('*_Request not be preceed!!_*')
   }
  } catch (error) {
   await m.error(error + '\n\ncommand: threads', error, '*_No responce from API, Sorry!!_*')
  }
 }
)
Index(
 {
  pattern: 'instagram',
  category: 'downloader',
  desc: 'Download Instagram media.',
 },
 async (m, text) => {
  try {
   if (!text) return await m.send('*_Please provide an Instagram link_*')

   let apiUrl = `https://api.maher-zubair.tech/download/instagram?url=${text}`
   let response = await fetch(apiUrl)
   let jsonResponse = await response.json()

   if (jsonResponse.status === 200) {
    let result = jsonResponse.result[0]
    await m.send(result.url, { caption: Config.caption }, 'image', m)
   } else {
    await m.send('*_Request not be preceed!!_*')
   }
  } catch (error) {
   await m.error(error + '\n\ncommand: instagram', error, '*_No responce from API, Sorry!!_*')
  }
 }
)
Index(
 {
  pattern: 'ytmp3',
  desc: 'Downloads audio by yt link.',
  category: 'downloader',
 },
 async (_0x3f8930, _0x5834bb) => {
  let _0x4fe91c = _0x5834bb ? _0x5834bb : _0x3f8930.reply_text
  var _0x540f68 = _0x4fe91c.toLowerCase().includes('doc') ? 'document' : 'audio'
  const _0x2758ec = ytIdRegex.exec(_0x4fe91c) || []
  if (!_0x4fe91c || !_0x2758ec[0]) {
   return await _0x3f8930.reply('*_Uhh please, Provide youtube video url!_*')
  }
  try {
   let _0x4b5067 = await ytdl.getInfo(_0x2758ec[0])
   if (_0x4b5067.videoDetails.lengthSeconds >= videotime) {
    _0x540f68 = 'document'
   }
   let _0xaca4bd = _0x4b5067.videoDetails.title
   let _0x24816a = './temp/' + _0x2758ec[1] + '.mp3'
   const _0x2591f0 = ytdl(_0x2758ec[0], {
    filter: _0x4e89f2 => _0x4e89f2.audioBitrate == 160 || _0x4e89f2.audioBitrate == 128,
   }).pipe(fs.createWriteStream(_0x24816a))
   await new Promise((_0x401b5b, _0x3d90fd) => {
    _0x2591f0.on('error', _0x3d90fd)
    _0x2591f0.on('finish', _0x401b5b)
   })
   var _0x29af08 = {
    ...(await _0x3f8930.bot.contextInfo(Config.botname, 'ʏᴏᴜᴛᴜʙᴇ ᴠɪᴅᴇᴏ')),
   }
   let _0x4c646c = {
    [_0x540f68]: fs.readFileSync(_0x24816a),
    mimetype: 'audio/mpeg',
    fileName: _0xaca4bd,
    contextInfo: _0x29af08,
   }
   await _0x3f8930.bot.sendMessage(_0x3f8930.jid, _0x4c646c, {
    quoted: _0x3f8930,
   })
   try {
    return await fs.unlinkSync(_0x24816a)
   } catch {}
  } catch (_0x345ce7) {
   console.log('here now,ytdl-core : ', _0x345ce7)
   try {
    let _0x5b9011 = await yt.download(_0x2758ec[1], {
     type: 'audio',
     quality: 'best',
    })
    var _0x29af08 = {
     ...(await _0x3f8930.bot.contextInfo(Config.botname, 'ʏᴏᴜᴛᴜʙᴇ ᴠɪᴅᴇᴏ')),
    }
    if (_0x5b9011) {
     await _0x3f8930.bot.sendMessage(_0x3f8930.jid, {
      [_0x540f68]: {
       url: _0x5b9011,
      },
      mimetype: 'audio/mpeg',
      fileName: Config.caption,
      contextInfo: _0x29af08,
     })
    } else {
     await _0x3f8930.send('*_audio not Found!_*')
    }
    try {
     fs.unlinkSync(_0x5b9011)
    } catch {}
   } catch (_0x2cd979) {
    await _0x3f8930.error(_0x2cd979 + '\n\ncommand: ytmp3', _0x2cd979, '*_Uhh dear, audio file not Found!!_*')
   }
  }
 }
)
Index(
 {
  pattern: 'ytdoc',
  desc: 'Downloads audio by yt link as document.',
  category: 'downloader',
 },
 async (_0x17c662, _0x429696) => {
  try {
   let _0x5696a7 = _0x429696 ? _0x429696 : _0x17c662.reply_text
   const _0x1d542b = ytIdRegex.exec(_0x5696a7) || []
   if (!_0x5696a7 || !_0x1d542b[0]) {
    return await _0x17c662.reply('❌Please provide me a url')
   }
   var _0x43c5ac = _0x1d542b[1]
   var _0x59bbaa = false
   try {
    let _0x32b31a = await ytdl.getInfo(_0x1d542b[0])
    _0x43c5ac = _0x32b31a.videoDetails.title
    let _0x4b47c3 = './temp/Asta-Md ' + _0x1d542b[1] + '.mp3'
    const _0x212389 = ytdl(_0x1d542b[0], {
     filter: _0xd2371a => _0xd2371a.audioBitrate == 160 || _0xd2371a.audioBitrate == 128,
    }).pipe(fs.createWriteStream(_0x4b47c3))
    _0x59bbaa = _0x4b47c3
    await new Promise((_0x1506ab, _0x26e243) => {
     _0x212389.on('error', _0x26e243)
     _0x212389.on('finish', _0x1506ab)
    })
   } catch (_0x18c033) {
    console.log('here now,ytdl-core : ', _0x18c033)
    try {
     _0x59bbaa = await yt.download(_0x1d542b[1], {
      type: 'audio',
      quality: 'best',
     })
    } catch (_0x4122cc) {
     return await _0x17c662.error(_0x4122cc + '\n\ncommand: ytdoc', _0x4122cc, '*_file not Found!!_*')
    }
   }
   if (!_0x59bbaa) {
    return await _0x17c662.send('*_Uhh dear, video not found_*')
   }
   var _0x10e2fa = {
    ...(await _0x17c662.bot.contextInfo(Config.botname, 'ʏᴛᴅᴏᴄ ᴍᴘ3 ʏᴏᴜᴛᴜʙᴇ')),
   }
   let _0x300d1a = {
    document: {
     url: _0x59bbaa,
    },
    mimetype: 'audio/mpeg',
    fileName: 'Asta-Md--' + _0x1d542b[1] + '.mp3',
    caption: Config.caption,
    contextInfo: _0x10e2fa,
   }
   await _0x17c662.bot.sendMessage(_0x17c662.jid, _0x300d1a, {
    quoted: _0x17c662,
   })
   try {
    return await fs.unlinkSync(_0x59bbaa)
   } catch {}
  } catch (_0xbed50) {
   await _0x17c662.error(_0xbed50 + '\n\ncommand: ytdoc', _0xbed50, '*_audio file not Found!!_*')
  }
 }
)
Index(
 {
  on: 'text',
 },
 async (_0xb75e78, _0x221e78, { isCreator: _0xfbeec5 }) => {
  if (_0xb75e78.quoted && _0xb75e78.text) {
   const _0x5b8ee5 = _0xb75e78.quoted.text.split('\n')
   if (_0x5b8ee5[0].includes('ᴀsᴛᴀ-ᴍᴅ • sᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ')) {
    const _0x1724ba = _0x5b8ee5.find(_0x525632 => _0x525632.startsWith('Url :'))
    let _0x43a95e = _0x1724ba.replace('Url :', '').trim()
    try {
     await _0xb75e78.sendMessage(_0xb75e78.chat, {
      react: {
       text: '✨',
       key: _0xb75e78.key,
      },
     })
     let _0x4cd3b2
     if (_0xb75e78.text.startsWith('1')) {
      let _0x3edf2a = _0x221e78.toLowerCase().includes('doc')
       ? 'document'
       : _0x221e78.toLowerCase().includes('mp3')
       ? 'audio'
       : 'video'
      _0x4cd3b2 = './temp/ytsong.mp4'
      const _0x5e7871 = ytdl(_0x43a95e, {
       filter: _0x145c7e => _0x145c7e.itag == 22 || _0x145c7e.itag == 18,
      }).pipe(fs.createWriteStream(_0x4cd3b2))
      await new Promise((_0x540130, _0xf6b8ae) => {
       _0x5e7871.on('error', _0xf6b8ae)
       _0x5e7871.on('finish', _0x540130)
      })
      await _0xb75e78.sendMessage(
       _0xb75e78.chat,
       {
        [_0x3edf2a]: fs.readFileSync(_0x4cd3b2),
        mimetype: _0x3edf2a == 'audio' ? 'audio/mpeg' : 'video/mp4',
        fileName: Config.caption,
        caption: Config.caption,
       },
       {
        quoted: _0xb75e78,
       }
      )
     } else if (_0xb75e78.text.startsWith('2')) {
      let _0x5d9956 = _0x221e78.toLowerCase().includes('doc') ? 'document' : 'audio'
      _0x4cd3b2 = './temp/ytsong.mp3'
      const _0x39ddb9 = ytdl(_0x43a95e, {
       filter: _0xa5f832 => _0xa5f832.audioBitrate == 160 || _0xa5f832.audioBitrate == 128,
      }).pipe(fs.createWriteStream(_0x4cd3b2))
      await new Promise((_0x4790a8, _0x9a005b) => {
       _0x39ddb9.on('error', _0x9a005b)
       _0x39ddb9.on('finish', _0x4790a8)
      })
      await _0xb75e78.sendMessage(
       _0xb75e78.chat,
       {
        [_0x5d9956]: fs.readFileSync(_0x4cd3b2),
        mimetype: 'audio/mpeg',
        fileName: Config.caption,
       },
       {
        quoted: _0xb75e78,
       }
      )
     }
     try {
      return fs.unlinkSync(_0x4cd3b2)
     } catch (_0x51cca7) {}
    } catch (_0x189dd8) {
     return await _0xb75e78.reply('Error While Downloading Video : ' + _0x189dd8)
    }
   } else if (_0x5b8ee5[0].includes('ᴀsᴛᴀ-ᴍᴅ • ʏᴏᴜᴛᴜʙᴇ ᴅᴏᴡɴʟᴏᴀᴅ')) {
    let _0x307bb6 = '*' + _0xb75e78.text.split(' ')[0] + ' : '
    const _0x56275d = _0x5b8ee5.find(_0x3b5e74 => _0x3b5e74.startsWith(_0x307bb6))
    if (_0x56275d) {
     try {
      let _0x3e1826 = _0x56275d.replace(_0x307bb6, '').split('*')[0].trim()
      const _0x4d9213 = _0x5b8ee5[_0x5b8ee5.indexOf(_0x56275d) + 1]
      const _0x37a579 = _0x4d9213.split('*')[1].replace('Url : ', '').trim()
      if (_0x37a579.startsWith('http')) {
       await _0xb75e78.sendMessage(_0xb75e78.chat, {
        react: {
         text: '✨',
         key: _0xb75e78.key,
        },
       })
       let _0x1d3325 = _0x221e78.toLowerCase().includes('doc')
        ? 'document'
        : _0x221e78.toLowerCase().includes('mp3')
        ? 'audio'
        : 'video'
       let _0x26cc84 = './temp/Yts Download ' + Math.floor(Math.random() * 10000) + '.mp4'
       const _0x104b4c = ytdl(_0x37a579, {
        filter: _0x31a431 => _0x31a431.itag == 22 || _0x31a431.itag == 18,
       }).pipe(fs.createWriteStream(_0x26cc84))
       await new Promise((_0x45b31c, _0x5b6595) => {
        _0x104b4c.on('error', _0x5b6595)
        _0x104b4c.on('finish', _0x45b31c)
       })
       await _0xb75e78.sendMessage(
        _0xb75e78.chat,
        {
         [_0x1d3325]: fs.readFileSync(_0x26cc84),
         mimetype: _0x1d3325 == 'audio' ? 'audio/mpeg' : 'video/mp4',
         fileName: '' + _0x3e1826,
         caption: _0x3e1826 + ' \n ' + Config.caption,
        },
        {
         quoted: _0xb75e78,
        }
       )
       try {
        fs.unlink(_0x26cc84)
       } catch (_0x338800) {}
      }
     } catch (_0x3de0e2) {
      _0xb75e78.error(_0x3de0e2 + '\n\nCommand yts Listener', _0x3de0e2, '*Video Not Found!*')
     }
    }
   } else if (_0x5b8ee5[0].includes('ᴀsᴛᴀ-ᴍᴅ • ᴀᴘᴋ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪsᴛ')) {
    let _0x35d668 = '*' + _0xb75e78.text.split(' ')[0] + ' : '
    const _0x205a5f = _0x5b8ee5.find(_0x304058 => _0x304058.startsWith(_0x35d668))
    if (_0x205a5f) {
     try {
      let _0x17567d = _0x205a5f.replace(_0x35d668, '').split('*')[0].trim()
      const _0x14618c = _0x5b8ee5[_0x5b8ee5.indexOf(_0x205a5f) + 1]
      const _0x2407a8 = _0x14618c.split('*')[1].replace('Id : ', '').trim()
      await _0xb75e78.sendMessage(_0xb75e78.chat, {
       react: {
        text: '✨',
        key: _0xb75e78.key,
       },
      })
      let _0x37b3a4 = await download(_0x2407a8)
      let _0x478b37 = '*App Name :* ' + _0x37b3a4.name
      _0x478b37 += '\n*App id        :* ' + _0x37b3a4.package
      _0x478b37 += '\n*Last Up       :* ' + _0x37b3a4.lastup
      _0x478b37 += '\n*App Size     :* ' + _0x37b3a4.size
      _0x478b37 += '\n               \n' + Config.caption
      let _0x5032aa = {
       document: {
        url: _0x37b3a4.dllink,
       },
       mimetype: 'application/vnd.android.package-archive',
       fileName: _0x37b3a4.name + '.apk',
       caption: _0x478b37,
      }
      return await _0xb75e78.sendMessage(_0xb75e78.chat, _0x5032aa, {
       quoted: _0xb75e78,
      })
     } catch (_0x12fd88) {
      _0xb75e78.reply("*_Can't Download, App Limit Exceed_*")
     }
    }
   }
  }
 }
)
