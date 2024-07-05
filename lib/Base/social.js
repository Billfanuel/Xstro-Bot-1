const { fetchJson, fancytext, yt, getBuffer, prefix, Config, isValidUrl, formatDuration } = require('../index')
const { search, download } = require('aptoide-scraper')
const googleTTS = require('google-tts-api')
const ytdl = require('ytdl-secktor')
const yts = require('secktor-pack')
const fs = require('fs-extra')
const axios = require('axios')
const fetch = require('node-fetch')
var videotime = 2000

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
