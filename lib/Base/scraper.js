const {
 fetchJson,
 fancytext,
 yt,
 getBuffer,
 prefix,
 Config,
 isValidUrl,
 formatDuration,
 getVideoUrl,
} = require('../index')
const { search, download } = require('aptoide-scraper')
const googleTTS = require('google-tts-api')
const ytdl = require('ytdl-secktor')
const yts = require('secktor-pack')
const fs = require('fs-extra')
const axios = require('axios')
const fetch = require('node-fetch')
var videotime = 2000
const ytIdRegex =
 /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed|shorts\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/

async function AllSocial(m, url) {
 try {
  if (!url) {
   return await m.send('*_Please provide a URL!_*')
  }

  const apiUrl = `https://api.maher-zubair.tech/download/alldownload2?url=${encodeURIComponent(url)}`
  const response = await fetch(apiUrl)

  if (!response.ok) {
   return await m.send(`*_Error: ${response.status} ${response.statusText}_*`)
  }

  const data = await response.json()
  const result = data.result

  if (!result || !result.medias || !result.medias.length) {
   return await m.send('*_No media found!_*')
  }

  const { title, thumbnail, medias } = result
  const caption = `*Title:* ${title}\n\n*Source:* ${medias[0].source}`

  await m.bot.sendFromUrl(m.from, thumbnail, caption, m, {}, 'image')

  for (const media of medias) {
   const { url, formattedSize, quality, extension } = media
   const mediaCaption = `*Quality:* ${quality}\n*Size:* ${formattedSize}\n*Extension:* ${extension}`
   await m.bot.sendFromUrl(m.from, url, mediaCaption, m, {}, 'video')
  }
 } catch (e) {
  await m.error(`${e}\n\ncommand: allsocial`, e)
 }
}
module.exports = AllSocial
async function googleDriveDl(m, url) {
 try {
  if (!url) {
   return await m.send('*_Please provide a Google Drive URL!_*')
  }

  const apiUrl = `https://api.maher-zubair.tech/download/gdrive?url=${encodeURIComponent(url)}`
  const response = await fetch(apiUrl)

  if (!response.ok) {
   return await m.send(`*_Error: ${response.status} ${response.statusText}_*`)
  }

  const data = await response.json()

  if (data.status !== 200) {
   return await m.send(`*_Error: ${data.status} - ${data.result || 'Unknown error'}_*`)
  }

  const { downloadUrl, fileName, fileSize, mimetype } = data.result
  const caption = `*File:* ${fileName}\n*Size:* ${fileSize}\n*Type:* ${mimetype}`

  await m.bot.sendFromUrl(m.from, downloadUrl, caption, m, {}, 'file')
 } catch (e) {
  await m.error(`${e}\n\ncommand: gdrive`, e)
 }
}
module.exports = googleDriveDl
async function spotifyDL(message, input) {
 try {
  const url = input.trim()
  if (!url || !isValidUrl(url)) {
   return await message.send('*_Please provide a valid Spotify URL._*')
  }

  const apiUrl = `https://api.maher-zubair.tech/download/spotify?url=${encodeURIComponent(url)}`
  const response = await axios.get(apiUrl)
  const data = response.data

  if (!data || data.status !== 200) {
   return await message.reply('*Failed to download the Spotify song.*')
  }

  const { song, artist, album_name, release_date, cover_url, url: songUrl } = data.result

  let output = `*Song:* ${song}\n`
  output += `*Artist:* ${artist.join(', ')}\n`
  output += `*Album:* ${album_name}\n`
  output += `*Release Date:* ${release_date}\n\n`
  output += `*Cover Image:* ${cover_url}\n\n`

  const buffer = await axios.get(songUrl, { responseType: 'arraybuffer' })
  const fileName = `${song.replace(/\s/g, '_')}.mp3`

  await message.bot.sendMessage(
   message.chat,
   {
    audio: buffer.data,
    fileName: fileName,
    mimetype: 'audio/mpeg',
    caption: output,
   },
   { quoted: message }
  )
 } catch (error) {
  await message.error(error + '\n\nCommand: spotify2', error, '*Failed to download the Spotify song.*')
 }
}
module.exports = spotifyDL
async function TelegramStickers(message, stickerUrl) {
 try {
  if (!stickerUrl) {
   return await message.reply('*_Give Me Telegram Sticker Link_*')
  }
  if (!stickerUrl.includes('addstickers')) {
   return await message.reply('*_Give Me Telegram Sticker Link_*')
  }

  const stickerSetUrl = stickerUrl.split('|')[0]
  const stickerSetName = stickerSetUrl.split('/addstickers/')[1]
  const { result: stickerSet } = await fetchJson(
   'https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=' +
    encodeURIComponent(stickerSetName)
  )

  const stickerOptions = stickerUrl.split('|')[1] || ''
  const statusMessage =
   'Total stickers: ' +
   stickerSet.stickers.length +
   '\n*Estimated complete in:* ' +
   stickerSet.stickers.length * 1.5 +
   ' seconds\nKeep in mind that there is a chance of a ban if used frequently'

  if (stickerSet.is_animated) {
   return await message.reply('Animated stickers are not supported')
  } else if (stickerOptions.startsWith('info')) {
   return await message.reply(statusMessage)
  }

  let endIndex = parseInt(stickerOptions.split(',')[0]) || 10
  let startIndex = parseInt(stickerOptions.split(',')[1]) || 0
  let stickerType = stickerOptions.split(';')[1] || 'Sticker'
  let isSticker = true

  if (stickerType.includes('photo')) {
   isSticker = false
   stickerType = 'Photo'
  }

  if (endIndex > stickerSet.stickers.length) {
   endIndex = stickerSet.stickers.length
  }
  if (startIndex > stickerSet.stickers.length) {
   startIndex = stickerSet.stickers.length - 5
  }
  if (startIndex > endIndex) {
   ;[endIndex, startIndex] = [startIndex, endIndex]
  }

  await message.reply(
   statusMessage +
    '\n\n_Downloading as ' +
    stickerType +
    ' From index *' +
    startIndex +
    '* to *' +
    endIndex +
    '*._\nIf you want to download more, use:\n\n' +
    prefix +
    'tgs ' +
    stickerSetUrl +
    ' | 10, 20; photo'
  )

  for (let i = startIndex; i < endIndex; i++) {
   const fileInfo = await fetchJson(
    'https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=' +
     stickerSet.stickers[i].file_id
   )
   const fileUrl =
    'https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/' + fileInfo.result.file_path

   if (isSticker) {
    const buffer = await getBuffer(fileUrl)
    await message.reply(
     buffer,
     {
      packname: Config.packname,
      author: 'Asta-Md',
     },
     'sticker'
    )
   } else {
    await message.bot.sendMessage(message.chat, {
     image: {
      url: fileUrl,
     },
     caption: '*_Telegram Sticker At Index ' + (i + 1) + ' Downloaded_*',
    })
   }
  }
 } catch (error) {
  await message.error(error + '\n\ncommand: tgs', error, '*_Error Sending telegram stickers!!!_*')
 }
}

module.exports = TelegramStickers
async function fbToAudio(message, input) {
 try {
  let query = input.split(' ')[0].trim()
  if (!query || !query.startsWith('https://')) {
   return await message.send('*_Please provide a valid Facebook Video URL._')
  }
  let video = await fetchJson('https://api-smd.onrender.com/api/fbdown?url=' + query)
  if (!video || !video.status) {
   return await message.reply('*Invalid Video URL!*')
  }
  return await message.bot.sendMessage(
   message.chat,
   { video: { url: video.result.audio }, caption: Config.caption },
   { quoted: message }
  )
 } catch (error) {
  await message.error(error + '\n\nCommand: facebook', error, '*_Video not found!_*')
 }
}
module.exports = fbToAudio
async function InstaDl(m, providedUrl = '') {
 try {
  const url = providedUrl.trim()
  if (!url) {
   return await m.send('*_Please provide an Instagram URL!_*')
  }

  const apiUrl = `https://api.maher-zubair.tech/download/instagram?url=${encodeURIComponent(url)}`
  const response = await fetch(apiUrl)

  if (!response.ok) {
   return await m.send(`*_Error: ${response.status} ${response.statusText}_*`)
  }

  const data = await response.json()

  if (data.status !== 200) {
   return await m.send(`*_Error: ${data.status} - ${data.result || 'Unknown error'}_*`)
  }

  const mediaData = data.result[0]

  if (!mediaData) {
   return await m.send('*_No media found!_*')
  }

  const { thumbnail, url: mediaUrl, wm } = mediaData
  const caption = `*Watermark:* ${wm}\n\n_Note: This media may have a watermark._`

  await m.bot.sendFromUrl(m.from, thumbnail, caption, m, {}, 'image')
  await m.bot.sendFromUrl(m.from, mediaUrl, '', m, {}, 'video')
 } catch (e) {
  await m.error(`${e}\n\ncommand: instagram2`, e)
 }
}
module.exports = InstaDl
async function Wiki(m, query) {
 try {
  if (!query) {
   return await m.send('*_Give me Search_*')
  }

  const { wikimedia } = require('../index')
  const results = (await wikimedia(query)) || []

  if (!results || !results[0]) {
   return await m.send('*_No Results Found!_*')
  }

  const maxResults =
   m.iscreator && query.split('|')[1] === 'all' ? results.length : results.length > 5 ? 5 : results.length

  for (let i = 0; i < maxResults; i++) {
   try {
    m.bot.sendFromUrl(
     m.from,
     results[i].image,
     `Title: ${results[i].title}\n*Source:* ${results[i].source}`,
     m,
     {},
     'image'
    )
   } catch {}
  }
 } catch (e) {
  await m.error(`${e}\n\ncommand: insta`, e)
 }
}
module.exports = Wiki
async function fbDl(message, input) {
 try {
  let query = input.split(' ')[0].trim()
  if (!query || !query.startsWith('https://')) {
   return await message.send(
    '*_Please provide a valid Facebook Video URL._*\n*Example: ' +
     prefix +
     'fb https://www.facebook.com/watch/?v=2018727118289093_*'
   )
  }
  let video = await fetchJson('https://api-smd.onrender.com/api/fbdown?url=' + query)
  if (!video || !video.status) {
   return await message.reply('*Invalid Video URL!*')
  }
  return await message.bot.sendMessage(
   message.chat,
   {
    video: {
     url: video.result.HD, // Assuming you want the HD quality video
    },
    caption: Config.caption,
   },
   {
    quoted: message,
   }
  )
 } catch (error) {
  await message.error(error + '\n\nCommand: facebook', error, '*_Video not found!_*')
 }
}
module.exports = fbDl
async function ApkDl(message, appName) {
 try {
  if (!appName) {
   return message.reply('*_Give me App Name_*')
  }

  let searchResults = await search(appName)
  let appDetails = {}

  if (searchResults.length) {
   appDetails = await download(searchResults[0].id)
  } else {
   return message.reply('*_Apk not found_*')
  }

  const appSize = parseInt(appDetails.size)
  if (appSize > 200) {
   return message.reply('❌ File size bigger than 200mb.')
  }

  const downloadLink = appDetails.dllink
  let fancyText = await fancytext(
   `\t*ᴀᴘᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*\n\n*APP Name :* ${appDetails.name}\n*App Id :* ${appDetails.package}\n*Last Up :* ${appDetails.lastup}\n*App Size :* ${appDetails.size}\n\n\n ${Config.caption}`,
   25
  )

  const fileName = (appDetails?.name || 'Downloader') + '.apk'
  const filePath = 'temp/' + fileName

  let replyMessage = await message.reply(appDetails.icon, { caption: fancyText }, 'img', message)

  axios
   .get(downloadLink, { responseType: 'stream' })
   .then(response => {
    const writeStream = fs.createWriteStream(filePath)
    response.data.pipe(writeStream)
    return new Promise((resolve, reject) => {
     writeStream.on('finish', resolve)
     writeStream.on('error', reject)
    })
   })
   .then(() => {
    let documentDetails = {
     document: fs.readFileSync(filePath),
     mimetype: 'application/vnd.android.package-archive',
     fileName: fileName,
    }

    message.bot.sendMessage(message.jid, documentDetails, {
     quoted: replyMessage,
    })

    try {
     fs.unlink(filePath)
    } catch {}
   })
   .catch(error => {
    try {
     fs.unlink(filePath)
    } catch {}
    message.reply('*_Apk not Found, Sorry_*')
   })
 } catch (error) {
  await message.error(`${error}\n\ncommand: apk`, error, '*_Apk not Found!_*')
 }
}
module.exports = ApkDl
async function SearchApk(message, appName) {
 try {
  if (!appName) {
   return await message.reply('*_Uhh please, give me app name!_*')
  }

  const searchResults = await search(appName)
  if (searchResults.length) {
   let appDetails = await download(searchResults[0].id)
   let responseMessage = `*ᴀᴘᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*\n\n*Reply With Number To Download.*\n_Results For: ${appName}_ \n`

   for (let i = 0; i < searchResults.length; i++) {
    responseMessage += `\n*${i + 1} : ${searchResults[i].name}* \n*Id : ${searchResults[i].id}* \n`
   }

   return await message.sendMessage(
    message.chat,
    {
     image: {
      url: appDetails.icon,
     },
     caption: responseMessage,
    },
    {
     quoted: message,
    }
   )
  } else {
   return message.reply('*_APP not Found, Try Other Name_*')
  }
 } catch (error) {
  message.error(`${error}\n\ncommand: apks`, error)
 }
}
module.exports = SearchApk
async function SoundCloud(msg, query) {
 try {
  const url = query.trim()
  if (!url) {
   return await msg.reply('*Please provide a SoundCloud audio URL.*')
  }

  const apiUrl = `https://api.maher-zubair.tech/download/soundcloud?url=${encodeURIComponent(url)}`
  const response = await fetch(apiUrl).then(res => res.json())

  if (!response || response.status !== 200) {
   return await msg.reply('*An error occurred while downloading the SoundCloud audio.*')
  }

  const result = response.result
  const audioUrl = result.link
  const thumbnailUrl = result.thumb
  const title = result.title
  const downloadCount = result.download_count

  await msg.bot.sendAudio(msg.chat, audioUrl, title, downloadCount, thumbnailUrl, { quoted: msg })
 } catch (err) {
  await msg.error(err + '\n\ncommand: soundcloud', err, '*An error occurred while downloading the SoundCloud audio.*')
 }
}
module.exports = SoundCloud
async function fetchRepos(message, repoUrl) {
 try {
  let url = repoUrl ? repoUrl : message.reply_message ? message.reply_message.text : ''

  if (!repoUrl) {
   return await message.reply('*_Github Repo Url_*')
  }

  const githubUrlPattern = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
  if (!githubUrlPattern.test(repoUrl)) {
   return await message.reply('*Provide Valid Repository Url*')
  }

  let [fullMatch, username, repository] = repoUrl.match(githubUrlPattern) || []
  repository = repository.replace(/.git$/, '')

  let apiUrl = `https://api.github.com/repos/${username}/${repository}/zipball`

  let responseHeaders = (
   await fetch(apiUrl, {
    method: 'HEAD',
   })
  ).headers

  let fileName = responseHeaders.get('content-disposition').match(/attachment; filename=(.*)/)[1]

  await message.bot.sendMessage(message.jid, {
   document: {
    url: apiUrl,
   },
   fileName: fileName,
   mimetype: 'application/zip',
  })
 } catch (error) {
  return message.error(error + '\n\ncommand: gitclone', error, '*_File not found!!!_*')
 }
}
module.exports = fetchRepos
async function textSpeech(message, text) {
 try {
  let replyText = message.reply_text ? message.reply_text : text

  if (!replyText) {
   return message.reply('*_Provide Speech Text_*')
  }

  try {
   let lang = text ? text.split(' ')[0].toLowerCase() : 'en'
   const audioUrl = googleTTS.getAudioUrl(replyText, {
    lang: lang,
    slow: true,
    host: 'https://translate.google.com',
   })

   await message.bot.sendMessage(
    message.jid,
    {
     audio: {
      url: audioUrl,
     },
     mimetype: 'audio/mpeg',
     ptt: true,
     fileName: 'Asta-Md-tts.m4a',
    },
    {
     quoted: message,
    }
   )
  } catch (error) {
   const fallbackAudioUrl = googleTTS.getAudioUrl(replyText, {
    lang: 'en',
    slow: true,
    host: 'https://translate.google.com',
   })

   await message.bot.sendMessage(
    message.jid,
    {
     audio: {
      url: fallbackAudioUrl,
     },
     mimetype: 'audio/mpeg',
     ptt: true,
     fileName: 'Asta-Md-tts.m4a',
    },
    {
     quoted: message,
    }
   )
  }
 } catch (error) {
  return message.error(error + '\n\ncommand: tts', error, false)
 }
}
module.exports = textSpeech

async function dlMp4(message, inputText) {
 try {
  let videoLink = ('' + (inputText ? inputText : message.reply_text)).split(' ')[0].toLowerCase().trim()

  if (!videoLink || !videoLink.startsWith('http')) {
   return message.reply('*_Provide Video Url_*')
  }

  let mediaType = inputText.toLowerCase().includes('doc') ? 'document' : 'video'

  await message.bot.sendMessage(
   message.chat,
   {
    [mediaType]: {
     url: videoLink,
    },
    caption: '*Your Video*',
    contextInfo: {
     ...(await message.bot.contextInfo(Config.botname, message.senderName)),
    },
   },
   {
    quoted: message,
   }
  )
 } catch (error) {
  await message.error(error + '\n\ncommand: downmp4', error, '*_Please, Give me a valid video URL!_*')
 }
}
module.exports = dlMp4
async function ytVideo(message, query) {
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
module.exports = ytVideo

async function playYt(message, inputText) {
 try {
  let query = inputText ? inputText : message.reply_text
  let mediaType = query.toLowerCase().includes('doc') ? 'document' : 'audio'

  if (!query) {
   return message.reply('*' + prefix + 'play back in black*')
  }

  let videoIdMatch = ytIdRegex.exec(query) || []
  let videoUrl = videoIdMatch[0] || false

  if (!videoUrl) {
   let searchResults = await yts(query)
   let topVideo = searchResults.videos[0]
   videoUrl = topVideo.url
  }

  videoIdMatch = ytIdRegex.exec(videoUrl) || []
  let videoInfo = await yt.getInfo(videoIdMatch[1])
  let videoTitle = videoInfo.title || query || videoIdMatch[1]

  if (videoInfo && videoInfo.duration >= videotime) {
   return await message.reply("*_Can't download, file duration too big_*")
  }

  await message.send('_Downloading ' + videoInfo.title + '..._')
  let downloadedFile = await yt.download(videoIdMatch[1], {
   type: 'audio',
   quality: 'best',
  })

  let contextInfo = {
   ...(await message.bot.contextInfo(Config.botname, 'Song Downloader')),
  }

  if (downloadedFile) {
   await message.bot.sendMessage(message.jid, {
    [mediaType]: {
     url: downloadedFile,
    },
    fileName: videoTitle,
    mimetype: 'audio/mpeg',
    contextInfo: contextInfo,
   })
  } else {
   message.send('*_Video not found_*')
  }

  try {
   fs.unlinkSync(downloadedFile)
  } catch (e) {
   console.error('Failed to delete file:', e)
  }
 } catch (error) {
  return message.error(error + '\n\ncommand: play', error, '*_Video not found_*')
 }
}
module.exports = playYt
async function TiktokDl(message, url) {
 try {
  const fileType = url.toLowerCase().includes('doc')
   ? 'document'
   : url.toLowerCase().includes('mp3')
   ? 'audio'
   : 'video'

  if (!url) {
   return await message.reply('*_Provide Tiktok Url_*')
  }

  const tiktokUrl = url ? url.split(' ')[0] : ''

  if (!/tiktok/.test(tiktokUrl)) {
   return await message.reply('*Give me Valid Tiktok Video Url!*')
  }

  const apiUrl = 'https://api-smd.onrender.com/api/ttdl2'
  const response = await fetch(`${apiUrl}?url=${tiktokUrl}`)
  const data = await response.json()

  if (data && data.video && data.video.noWatermark) {
   return await message.send(data.video.noWatermark, fileType, message)
  } else {
   return await message.reply('Error While Downloading Your Video')
  }
 } catch (error) {
  return message.error(`${error}\n\ncommand: tiktok`, error)
 }
}
module.exports = TiktokDl
async function TiktokDl2(message, url) {
 try {
  if (!url) {
   return await message.reply('*_Provide Tiktok Url_*')
  }

  const tiktokUrl = url.split(' ')[0]
  if (!/tiktok/.test(tiktokUrl)) {
   return await message.reply('*Uhh Please, Give me a Valid TikTok Video Url!*')
  }

  const apiUrl = `https://api.maher-zubair.tech/download/tiktok?url=${encodeURIComponent(tiktokUrl)}`
  const response = await fetchJson(apiUrl)

  if (response.status !== 200) {
   return await message.reply(`*Error: ${response.result}*`)
  }

  const videoUrl = response.result
  const fileType = videoUrl.toLowerCase().includes('mp4') ? 'video' : 'document'

  await message.bot.sendMessage(
   message.jid,
   {
    [fileType]: {
     url: videoUrl,
    },
   },
   {
    quoted: message,
   }
  )
 } catch (error) {
  console.error(error)
  return message.error(`${error}\n\ncommand: tiktok`, error)
 }
}
module.exports = TiktokDl2
async function PinterestSrc(m, query) {
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
  return m.reply('Give me a Name. Ex ' + prefix + 'pinterest apple')
 }
}
module.exports = PinterestSrc
async function ytSongDl(message, query) {
 try {
  if (!query) {
   return await message.reply('*_Give Me Search Query_*')
  }

  let searchResults = await yts(query)
  let topResult = searchResults.all[0]

  let resultMessage =
   `\t *Song Downloader*   \n\n` +
   `*Title :* ${topResult.title}\n` +
   `*Url :* ${topResult.url}\n` +
   `*Description :* ${topResult.timestamp}\n` +
   `*Views :* ${topResult.views}\n` +
   `*Uploaded :* ${topResult.ago}\n` +
   `*Author :* ${topResult.author.name}\n\n\n` +
   `_Reply 1 To Video_\n` +
   `_Reply 2 To Audio_`

  let thumbnailBuffer = await getBuffer(topResult.thumbnail)

  let contextInfo = {
   ...(await message.bot.contextInfo(Config.botname, 'YouTube Song', thumbnailBuffer)),
  }

  await message.bot.sendMessage(message.jid, {
   image: thumbnailBuffer,
   caption: resultMessage,
   contextInfo: contextInfo,
  })
 } catch (error) {
  return message.error(`${error}\n\ncommand: mediafire`, error, '*_File not found!!_*')
 }
}
module.exports = ytSongDl

async function ytMP4(message, query) {
 let searchQuery = query ? query : message.reply_text
 let fileType = searchQuery.toLowerCase().includes('doc')
  ? 'document'
  : searchQuery.toLowerCase().includes('mp3')
  ? 'audio'
  : 'video'

 const ytIdMatch = ytIdRegex.exec(searchQuery) || []
 if (!searchQuery || !ytIdMatch[0]) {
  return await message.reply('*_Provide a YouTube video URL!_*')
 }

 try {
  let videoInfo = await ytdl.getInfo(ytIdMatch[0])
  if (videoInfo.videoDetails.lengthSeconds >= videotime) {
   fileType = 'document'
  }
  let videoTitle = videoInfo.videoDetails.title
  let filePath = './temp/' + ytIdMatch[1] + '.mp4'

  const downloadStream = ytdl(ytIdMatch[0], {
   filter: format => format.itag == 22 || format.itag == 18,
  }).pipe(fs.createWriteStream(filePath))

  await new Promise((resolve, reject) => {
   downloadStream.on('error', reject)
   downloadStream.on('finish', resolve)
  })

  let contextInfo = {
   ...(await message.bot.contextInfo(Config.botname, 'YouTube Video')),
  }

  let messageOptions = {
   [fileType]: fs.readFileSync(filePath),
   mimetype: 'video/mp4',
   fileName: videoTitle,
   contextInfo: contextInfo,
  }

  await message.bot.sendMessage(message.jid, messageOptions, {
   quoted: message,
  })

  try {
   return await fs.unlinkSync(filePath)
  } catch {}
 } catch (ytdlError) {
  console.log('YTDL-core error: ', ytdlError)

  try {
   let ytInfo = await yt.getInfo(ytIdMatch[1])
   let downloadOptions = {
    type: 'video',
    quality: ytInfo.pref_Quality || 'best',
    format: 'mp4',
   }

   if (ytInfo.duration >= videotime) {
    fileType = 'document'
   }

   let downloadUrl = await yt.download(ytIdMatch[1], downloadOptions)
   let contextInfo = {
    ...(await message.bot.contextInfo(Config.botname, 'YouTube Video')),
   }

   let videoTitle = ytInfo.title || downloadUrl || ytIdMatch[1]

   if (downloadUrl) {
    await message.bot.sendMessage(message.chat, {
     [fileType]: {
      url: downloadUrl,
     },
     fileName: videoTitle,
     mimetype: 'video/mp4',
     contextInfo: contextInfo,
    })
   } else {
    await message.send('*_Video not Found_*')
   }

   try {
    fs.unlinkSync('' + downloadUrl)
   } catch {}

   return
  } catch (ytError) {
   return message.error(`${ytError}\n\ncommand: ytmp4`, ytError, '*Video not Found*')
  }
 }
}
module.exports = ytMP4
async function mediaFire(message, url) {
 try {
  if (!url || !url.includes('mediafire.com')) {
   return message.reply('*_Give Me MediaFire Link_*')
  }

  const apiUrl = `https://api.maher-zubair.tech/download/mediafire?url=${encodeURIComponent(url)}`
  const response = await fetch(apiUrl)

  if (!response.ok) {
   return message.reply(`*_Error: ${response.status} ${response.statusText}_*`)
  }

  const data = await response.json()
  const result = data.result

  if (!result || !result.link) {
   return message.reply('*_Could not find the file!_*')
  }
  const mediaInfo = {
   document: {
    url: result.link,
   },
   fileName: result.name,
   mimetype: result.mime,
  }

  await message.bot.sendMessage(message.chat, mediaInfo)
 } catch (error) {
  message.error(`${error}\n\ncommand: mediafire`, error, '*_File not found!!_*')
 }
}
module.exports = mediaFire

async function ytSearch(message, searchQuery) {
 try {
  if (!searchQuery) {
   return await message.reply('*_Give Me Search Query!_*')
  }

  let searchResults = await yts(searchQuery)
  let responseMessage = `
\t ʏᴏᴜᴛᴜʙᴇ ᴅʟ 

_Reply Any Number To Download._
  _For Audio: 1 mp3._
  _For Video: 1 video._
  _For Document: 1 document._

_Results For: ${searchQuery}_ 

`
  let resultIndex = 1
  for (let result of searchResults.all) {
   responseMessage += `
*${resultIndex++}: ${result.title} ${result.timestamp ? `(${result.timestamp})` : ''}*
*Url: ${result.url}*
`
  }

  return await message.sendMessage(
   message.chat,
   {
    image: {
     url: searchResults.all[0].thumbnail,
    },
    caption: responseMessage,
   },
   {
    quoted: message,
   }
  )
 } catch (error) {
  console.error(error)
 }
}
module.exports = ytSearch
async function threadsDl(message, text) {
 try {
  // Check if the text is provided
  if (!text) {
   return await message.send('*_Please provide a Threads link_*')
  }

  // Construct the API URL
  const apiUrl = `https://api.maher-zubair.tech/download/threads?url=${text}`

  // Fetch data from the API
  const response = await fetch(apiUrl)
  const jsonResponse = await response.json()

  // Check if the API response status is 200 (OK)
  if (jsonResponse.status === 200) {
   const { result } = jsonResponse
   const { image_urls: imageUrls, video_urls: videoUrls } = result

   // Send each image URL
   if (imageUrls.length > 0) {
    for (const imageUrl of imageUrls) {
     await message.send(imageUrl, { caption: Config.caption }, 'image', message)
    }
   }

   // Send each video URL
   if (videoUrls.length > 0) {
    for (const videoUrl of videoUrls) {
     await message.send(videoUrl, { caption: Config.caption }, 'video', message)
    }
   }
  } else {
   await message.send('*_Request could not be processed!!_*')
  }
 } catch (error) {
  await message.error(`${error}\n\ncommand: threads`, error, '*_No response from API, Sorry!!_*')
 }
}
module.exports = threadsDl
async function instaDl2(message, text) {
 try {
  // Check if the text is provided
  if (!text) {
   return await message.send('*_Please provide an Instagram link_*')
  }

  // Construct the API URL
  const apiUrl = `https://api.maher-zubair.tech/download/instagram?url=${text}`

  // Fetch data from the API
  const response = await fetch(apiUrl)
  const jsonResponse = await response.json()

  // Check if the API response status is 200 (OK)
  if (jsonResponse.status === 200) {
   const result = jsonResponse.result[0]
   await message.send(result.url, { caption: Config.caption }, 'image', message)
  } else {
   await message.send('*_Request could not be processed!!_*')
  }
 } catch (error) {
  await message.error(`${error}\n\ncommand: instagram`, error, '*_No response from API, Sorry!!_*')
 }
}
module.exports = instaDl2

async function ytMp3(message, text) {
 try {
  let query = text ? text : message.reply_text
  let fileType = query.toLowerCase().includes('doc') ? 'document' : 'audio'
  const ytIdMatches = ytIdRegex.exec(query) || []

  if (!query || !ytIdMatches[0]) {
   return await message.reply('*_Please provide a valid YouTube video URL!_*')
  }

  try {
   let videoInfo = await ytdl.getInfo(ytIdMatches[0])

   if (videoInfo.videoDetails.lengthSeconds >= videotime) {
    fileType = 'document'
   }

   let title = videoInfo.videoDetails.title
   let filePath = `./temp/${ytIdMatches[1]}.mp3`
   const audioStream = ytdl(ytIdMatches[0], {
    filter: format => format.audioBitrate === 160 || format.audioBitrate === 128,
   }).pipe(fs.createWriteStream(filePath))

   await new Promise((resolve, reject) => {
    audioStream.on('error', reject)
    audioStream.on('finish', resolve)
   })

   let contextInfo = await message.bot.contextInfo(Config.botname, 'YouTube audio')
   let mediaInfo = {
    [fileType]: fs.readFileSync(filePath),
    mimetype: 'audio/mpeg',
    fileName: title,
    contextInfo: contextInfo,
   }

   await message.bot.sendMessage(message.jid, mediaInfo, { quoted: message })
   try {
    await fs.unlinkSync(filePath)
   } catch {}
  } catch (error) {
   console.log('ytdl-core error:', error)
   try {
    let audioUrl = await yt.download(ytIdMatches[1], {
     type: 'audio',
     quality: 'best',
    })

    let contextInfo = await message.bot.contextInfo(Config.botname, 'YouTube audio')

    if (audioUrl) {
     await message.bot.sendMessage(message.jid, {
      [fileType]: {
       url: audioUrl,
      },
      mimetype: 'audio/mpeg',
      fileName: Config.caption,
      contextInfo: contextInfo,
     })
    } else {
     await message.send('*_Audio not found!_*')
    }

    try {
     fs.unlinkSync(audioUrl)
    } catch {}
   } catch (err) {
    await message.error(`${err}\n\ncommand: ytmp3`, err, '*_Oops! The audio file could not be found!_*')
   }
  }
 } catch (error) {
  await message.error(`${error}\n\ncommand: ytmp3`, error, '*_Oops! Something went wrong with the command!_*')
 }
}
module.exports = ytMp3
async function ytDocument(message, text) {
 try {
  let query = text ? text : message.reply_text
  const ytIdMatches = ytIdRegex.exec(query) || []

  if (!query || !ytIdMatches[0]) {
   return await message.reply('❌ Please provide a valid YouTube video URL')
  }

  let videoTitle = ytIdMatches[1]
  let downloadPath = false

  try {
   let videoInfo = await ytdl.getInfo(ytIdMatches[0])
   videoTitle = videoInfo.videoDetails.title

   let filePath = `./temp/Asta-Md ${ytIdMatches[1]}.mp3`
   const audioStream = ytdl(ytIdMatches[0], {
    filter: format => format.audioBitrate === 160 || format.audioBitrate === 128,
   }).pipe(fs.createWriteStream(filePath))

   downloadPath = filePath

   await new Promise((resolve, reject) => {
    audioStream.on('error', reject)
    audioStream.on('finish', resolve)
   })
  } catch (error) {
   console.log('ytdl-core error:', error)

   try {
    downloadPath = await yt.download(ytIdMatches[1], {
     type: 'audio',
     quality: 'best',
    })
   } catch (err) {
    return await message.error(`${err}\n\ncommand: ytdoc`, err, '*_File not found!_*')
   }
  }

  if (!downloadPath) {
   return await message.send('*_Oops! The video could not be found!_*')
  }

  let contextInfo = await message.bot.contextInfo(Config.botname, 'YouTube document MP3')
  let mediaInfo = {
   document: {
    url: downloadPath,
   },
   mimetype: 'audio/mpeg',
   fileName: `mediafile--${ytIdMatches[1]}.mp3`,
   contextInfo: contextInfo,
  }

  await message.bot.sendMessage(message.jid, mediaInfo, { quoted: message })

  try {
   await fs.unlinkSync(downloadPath)
  } catch {}
 } catch (error) {
  await message.error(`${error}\n\ncommand: ytdoc`, error, '*_Oops! Something went wrong with the command!_*')
 }
}
module.exports = ytDocument
