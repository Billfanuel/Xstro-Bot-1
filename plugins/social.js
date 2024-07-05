const { Index } = require('../lib')
const TelegramStickers = require('../lib/Base/scraper')
const InstaDl = require('../lib/Base/scraper')
const fbDl = require('../lib/Base/scraper')
const SearchApk = require('../lib/Base/scraper')
const fetchRepos = require('../lib/Base/scraper')
const dlMp4 = require('../lib/Base/scraper')
const playYt = require('../lib/Base/scraper')
const TiktokDl2 = require('../lib/Base/scraper')
const ytSongDl = require('../lib/Base/scraper')
const mediaFire = require('../lib/Base/scraper')
const threadsDl = require('../lib/Base/scraper')
const ytMp3 = require('../lib/Base/scraper')
const ytDocument = require('../lib/Base/scraper')
const instaDl2 = require('../lib/Base/scraper')
const ytSearch = require('../lib/Base/scraper')
const ytMP4 = require('../lib/Base/scraper')
const PinterestSrc = require('../lib/Base/scraper')
const TiktokDl = require('../lib/Base/scraper')
const ytVideo = require('../lib/Base/scraper')
const textSpeech = require('../lib/Base/scraper')
const SoundCloud = require('../lib/Base/scraper')
const ApkDl = require('../lib/Base/scraper')
const Wiki = require('../lib/Base/scraper')
const fbToAudio = require('../lib/Base/scraper')
const spotifyDL = require('../lib/Base/scraper')
const googleDriveDl = require('../lib/Base/scraper')
const AllSocial = require('../lib/Base/scraper')

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
 },
 fetchRepos
)

Index(
 {
  pattern: 'tts',
  desc: 'text to speech.',
  category: 'downloader',
 },
 textSpeech
)
Index(
 {
  pattern: 'dlmp4',
  desc: 'download mp4 from url.',
  category: 'downloader',
 },
 dlMp4
)
Index(
 {
  pattern: 'video',
  desc: 'Downloads video from YouTube using yt-search.',
  category: 'downloader',
 },
 ytVideo
)

Index(
 {
  pattern: 'play',
  desc: 'Download Youtube Audio.',
  category: 'downloader',
 },
 playYt
)

Index(
 {
  pattern: 'tiktok',
  desc: 'Downloads Tiktok Videos Via Url.',
  category: 'downloader',
 },
 TiktokDl
)
Index(
 {
  pattern: 'tiktok2',
  desc: 'Downloads Tiktok Videos Via Url.',
  category: 'downloader',
 },
 TiktokDl2
)
Index(
 {
  pattern: 'ringtone',
  desc: 'Downloads ringtone.',
  category: 'downloader',
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
 },
 PinterestSrc
)
Index(
 {
  pattern: 'mediafire',
  desc: 'Downloads media from Mediafire.',
  category: 'downloader',
 },
 mediaFire
)
Index(
 {
  pattern: 'song',
  desc: 'Downloads audio from youtube.',
  category: 'downloader',
 },
 ytSongDl
)
Index(
 {
  pattern: 'ytsrc',
  desc: 'Search Song From youtube',
  category: 'downloader',
 },
 ytSearch
)
Index(
 {
  pattern: 'ytmp4',
  desc: 'Downloads video from youtube.',
  category: 'downloader',
 },
 ytMP4
)
Index(
 {
  pattern: 'threads',
  category: 'downloader',
  desc: 'Download media from Threads.',
 },
 threadsDl
)
Index(
 {
  pattern: 'insta2',
  category: 'downloader',
  desc: 'Download Instagram media.',
 },
 instaDl2
)
Index(
 {
  pattern: 'ytmp3',
  desc: 'Downloads audio by yt link.',
  category: 'downloader',
 },
 ytMp3
)
Index(
 {
  pattern: 'ytdoc',
  desc: 'Downloads audio by yt link as document.',
  category: 'downloader',
 },
 ytDocument
)
Index(
 {
  on: 'text',
 },
 async (message, text, { isCreator }) => {
  if (message.quoted && message.text) {
   const quotedLines = message.quoted.text.split('\n')

   if (quotedLines[0].includes('ᴀsᴛᴀ-ᴍᴅ • sᴏɴɢ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ')) {
    const urlLine = quotedLines.find(line => line.startsWith('Url :'))
    let url = urlLine.replace('Url :', '').trim()

    try {
     await message.sendMessage(message.chat, {
      react: {
       text: '✨',
       key: message.key,
      },
     })

     let filePath
     let fileType

     if (message.text.startsWith('1')) {
      fileType = message.text.toLowerCase().includes('doc')
       ? 'document'
       : message.text.toLowerCase().includes('mp3')
       ? 'audio'
       : 'video'
      filePath = './temp/ytsong.mp4'

      const videoStream = ytdl(url, {
       filter: format => format.itag == 22 || format.itag == 18,
      }).pipe(fs.createWriteStream(filePath))

      await new Promise((resolve, reject) => {
       videoStream.on('error', reject)
       videoStream.on('finish', resolve)
      })
     } else if (message.text.startsWith('2')) {
      fileType = message.text.toLowerCase().includes('doc') ? 'document' : 'audio'
      filePath = './temp/ytsong.mp3'

      const audioStream = ytdl(url, {
       filter: format => format.audioBitrate == 160 || format.audioBitrate == 128,
      }).pipe(fs.createWriteStream(filePath))

      await new Promise((resolve, reject) => {
       audioStream.on('error', reject)
       audioStream.on('finish', resolve)
      })
     }

     if (filePath) {
      await message.sendMessage(
       message.chat,
       {
        [fileType]: fs.readFileSync(filePath),
        mimetype: fileType === 'audio' ? 'audio/mpeg' : 'video/mp4',
        fileName: Config.caption,
        caption: Config.caption,
       },
       { quoted: message }
      )

      try {
       fs.unlinkSync(filePath)
      } catch {}
     }
    } catch (error) {
     return await message.reply('Error while downloading video: ' + error)
    }
   } else if (quotedLines[0].includes('ʏᴏᴜᴛᴜʙᴇ ᴅᴏᴡɴʟᴏᴀᴅ')) {
    let commandPrefix = '*' + message.text.split(' ')[0] + ' : '
    const lineWithUrl = quotedLines.find(line => line.startsWith(commandPrefix))

    if (lineWithUrl) {
     try {
      let appName = lineWithUrl.replace(commandPrefix, '').split('*')[0].trim()
      const nextLine = quotedLines[quotedLines.indexOf(lineWithUrl) + 1]
      const url = nextLine.split('*')[1].replace('Url : ', '').trim()

      if (url.startsWith('http')) {
       await message.sendMessage(message.chat, {
        react: {
         text: '✨',
         key: message.key,
        },
       })

       let fileType = message.text.toLowerCase().includes('doc')
        ? 'document'
        : message.text.toLowerCase().includes('mp3')
        ? 'audio'
        : 'video'
       let filePath = `./temp/Yts Download ${Math.floor(Math.random() * 10000)}.mp4`

       const downloadStream = ytdl(url, {
        filter: format => format.itag == 22 || format.itag == 18,
       }).pipe(fs.createWriteStream(filePath))

       await new Promise((resolve, reject) => {
        downloadStream.on('error', reject)
        downloadStream.on('finish', resolve)
       })

       let caption = `${appName} \n ${Config.caption}`
       let mediaInfo = {
        [fileType]: fs.readFileSync(filePath),
        mimetype: fileType === 'audio' ? 'audio/mpeg' : 'video/mp4',
        fileName: appName,
        caption: caption,
       }

       await message.sendMessage(message.chat, mediaInfo, { quoted: message })

       try {
        fs.unlinkSync(filePath)
       } catch {}
      }
     } catch (error) {
      message.error(error + '\n\nCommand yts Listener', error, '*Video not found!*')
     }
    }
   } else if (quotedLines[0].includes('ᴀᴘᴋ ᴅᴏᴡɴʟᴏᴀᴅ ʟɪsᴛ')) {
    let commandPrefix = '*' + message.text.split(' ')[0] + ' : '
    const lineWithId = quotedLines.find(line => line.startsWith(commandPrefix))

    if (lineWithId) {
     try {
      let appName = lineWithId.replace(commandPrefix, '').split('*')[0].trim()
      const nextLine = quotedLines[quotedLines.indexOf(lineWithId) + 1]
      const appId = nextLine.split('*')[1].replace('Id : ', '').trim()

      await message.sendMessage(message.chat, {
       react: {
        text: '✨',
        key: message.key,
       },
      })

      let appInfo = await download(appId)
      let caption =
       `*App Name :* ${appInfo.name}\n` +
       `*App id        :* ${appInfo.package}\n` +
       `*Last Up       :* ${appInfo.lastup}\n` +
       `*App Size     :* ${appInfo.size}\n\n`

      let mediaInfo = {
       document: {
        url: appInfo.dllink,
       },
       mimetype: 'application/vnd.android.package-archive',
       fileName: `${appInfo.name}.apk`,
       caption: caption,
      }

      await message.sendMessage(message.chat, mediaInfo, { quoted: message })
     } catch (error) {
      message.reply("*Can't download, app limit exceed*")
     }
    }
   }
  }
 }
)
