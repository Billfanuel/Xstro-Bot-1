const fs = require('fs-extra')
const { unlink } = require('fs').promises
const axios = require('axios')
const moment = require('moment-timezone')
const { sizeFormatter } = require('human-readable')
const util = require('util')
const child_process = require('child_process')

// Convert a date to Unix timestamp in seconds
const unixTimestampSecond = (date = new Date()) => Math.floor(date.getTime() / 1000)

// Create a promise that resolves after a specified time
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

// Check if a string is a valid URL
const isUrl = url => {
 const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi
 return url.match(urlRegex)
}

// Generate a message tag
const generateMessageTag = suffix => {
 let tag = unixTimestampSecond().toString()
 if (suffix) {
  tag += `.--${suffix}`
 }
 return tag
}

// Calculate process time
const processTime = (timestamp, now) => {
 return moment.duration(now - moment(timestamp * 1000)).asSeconds()
}

// Get buffer from URL, file, or Buffer
const getBuffer = async (source, options = {}, method = 'get') => {
 try {
  if (Buffer.isBuffer(source)) {
   return source
  }
  if (/^https?:\/\//i.test(source)) {
   const response = await axios({
    method,
    url: source,
    headers: {
     DNT: 1,
     'Upgrade-Insecure-Request': 1,
    },
    ...options,
    responseType: 'arraybuffer',
   })
   return response.data
  }
  if (fs.existsSync(source)) {
   return fs.readFileSync(source)
  }
  return source
 } catch (error) {
  console.log('Error while getting data in buffer:', error)
  return false
 }
}

// Fetch JSON from URL
const fetchJson = async (url, options = {}, method = 'GET') => {
 try {
  const response = await axios({
   method,
   url,
   headers: {
    'User-Agent':
     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
   },
   ...options,
  })
  return response.data
 } catch (error) {
  console.log('Error while fetching data in JSON:', error)
  return false
 }
}
exports.runtime = function (seconds, dayLabel = ' d', hourLabel = ' h', minuteLabel = ' m', secondLabel = ' s') {
 seconds = Number(seconds)
 const days = Math.floor(seconds / 86400)
 const hours = Math.floor((seconds % 86400) / 3600)
 const minutes = Math.floor((seconds % 3600) / 60)
 const secs = Math.floor(seconds % 60)

 const dayStr = days > 0 ? days + dayLabel + ', ' : ''
 const hourStr = hours > 0 ? hours + hourLabel + ', ' : ''
 const minuteStr = minutes > 0 ? minutes + minuteLabel + ', ' : ''
 const secondStr = secs > 0 ? secs + secondLabel : ''

 return dayStr + hourStr + minuteStr + secondStr
}

exports.clockString = function (seconds) {
 const hours = isNaN(seconds) ? '--' : Math.floor((seconds % 86400) / 3600)
 const minutes = isNaN(seconds) ? '--' : Math.floor((seconds % 3600) / 60)
 const secs = isNaN(seconds) ? '--' : Math.floor(seconds % 60)
 return [hours, minutes, secs].map(v => v.toString().padStart(2, 0)).join(':')
}

exports.getTime = (format, date) => {
 const timezone = global.timezone || 'Africa/Lagos'
 return date ? moment.tz(date, timezone).format(format) : moment.tz(timezone).format(format)
}

exports.formatDate = (date, locale = 'id') => {
 const options = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
 }
 return new Date(date).toLocaleDateString(locale, options)
}

exports.formatp = sizeFormatter({
 std: 'JEDEC',
 decimalPlaces: 2,
 keepTrailingZeroes: false,
 render: (literal, symbol) => literal + ' ' + symbol + 'B',
})

exports.jsonformat = obj => JSON.stringify(obj, null, 2)

exports.format = (...args) => util.format(...args)

exports.logic = (input, list, result) => {
 if (list.length !== result.length) throw new Error('Input and Output must have same length')
 for (let i in list) {
  if (util.isDeepStrictEqual(input, list[i])) return result[i]
 }
 return null
}

exports.generateProfilePicture = async buffer => {
 const jimp = await jimp.read(buffer)
 const min = jimp.getWidth()
 const max = jimp.getHeight()
 const cropped = jimp.crop(0, 0, min, max)
 return {
  img: await cropped.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG),
  preview: await cropped.scaleToFit(720, 720).getBufferAsync(jimp.MIME_JPEG),
 }
}

exports.bytesToSize = (bytes, decimals = 2) => {
 if (bytes === 0) return '0 Bytes'
 const k = 1024
 const dm = decimals < 0 ? 0 : decimals
 const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
 const i = Math.floor(Math.log(bytes) / Math.log(k))
 return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

exports.getSizeMedia = path => {
 return new Promise((resolve, reject) => {
  if (/http/.test(path)) {
   axios.get(path).then(res => {
    let length = parseInt(res.headers['content-length'])
    let size = exports.bytesToSize(length, 3)
    if (!isNaN(length)) resolve(size)
   })
  } else if (Buffer.isBuffer(path)) {
   let length = Buffer.byteLength(path)
   let size = exports.bytesToSize(length, 3)
   if (!isNaN(length)) resolve(size)
  } else {
   reject('Error: Invalid path or buffer provided')
  }
 })
}

exports.parseMention = (text = '') => {
 return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

exports.GIFBufferToVideoBuffer = async image => {
 let anime = 'reaction'
 const filename = `${anime}`
 await fs.writeFileSync(`./temp/${filename}.gif`, image)
 child_process.exec(
  `ffmpeg -i ./${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ./${filename}.mp4`
 )
 await new Promise(resolve => setTimeout(resolve, 6000))
 var buffer = await fs.readFileSync(`./${filename}.mp4`)
 Promise.all([unlink(`./${filename}.mp4`), unlink(`./${filename}.gif`)])
 return buffer
}
module.exports = {
  unixTimestampSecond,
  sleep,
  delay: sleep,
  isUrl,
  generateMessageTag,
  processTime,
  getBuffer,
  smdBuffer: getBuffer,
  fetchJson,
  astroJson: fetchJson,
 }