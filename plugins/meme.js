const fs = require('fs-extra')
const { createCanvas, loadImage } = require('canvas')
const { sleep, Index, Config } = require('../lib')

// Function to add text to an image and save it
async function generateImageWithText(imagePath, outputPath, text, x, y, maxWidth, maxLines, fontSize = '30') {
 const image = await loadImage(imagePath)
 const canvas = createCanvas(image.width, image.height)
 const ctx = canvas.getContext('2d')

 ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
 ctx.font = fontSize + 'px Arial'
 ctx.fillStyle = 'black'
 ctx.textAlign = 'left'
 ctx.textBaseline = 'top'

 const lines = splitTextIntoLines(text, ctx, maxWidth)

 if (lines.length > maxLines) {
  lines.splice(maxLines)
  const lastLine = lines[maxLines - 1]
  const truncatedLine = lastLine.slice(0, lastLine.length - 10) + '...Read More'
  lines[maxLines - 1] = truncatedLine
 }

 lines.forEach((line, index) => {
  ctx.fillText(line, x, y + index * 25)
 })

 const outputStream = fs.createWriteStream(outputPath)
 const pngStream = canvas.createPNGStream()
 pngStream.pipe(outputStream)

 await new Promise(resolve => {
  outputStream.on('finish', resolve)
 })

 console.log('Image with text created:', outputPath)
 return outputPath
}

// Function to split text into lines based on max width
function splitTextIntoLines(text, ctx, maxWidth) {
 const words = text.split(' ')
 const lines = []
 let currentLine = ''

 for (const word of words) {
  const testLine = currentLine === '' ? word : currentLine + ' ' + word
  const lineWidth = ctx.measureText(testLine).width

  if (lineWidth <= maxWidth) {
   currentLine = testLine
  } else {
   lines.push(currentLine)
   currentLine = word
  }
 }

 if (currentLine !== '') {
  lines.push(currentLine)
 }

 return lines
}

const memeCommands = [
 { pattern: 'trump', image: './plugins/memes/trumSay.png', x: 70, y: 150, maxWidth: 700, maxLines: 4 },
 { pattern: 'mia', image: './plugins/memes/mia.png', x: 90, y: 120, maxWidth: 600, maxLines: 3 },
 { pattern: 'johni', image: './plugins/memes/johni.png', x: 40, y: 210, maxWidth: 570, maxLines: 3 },
 { pattern: 'elon', image: './plugins/memes/elon.jpg', x: 60, y: 130, maxWidth: 900, maxLines: 5 },
 { pattern: 'mark', image: './plugins/memes/mark.png', x: 30, y: 80, maxWidth: 500, maxLines: 3 },
 { pattern: 'ronaldo', image: './plugins/memes/ronaldo.png', x: 50, y: 140, maxWidth: 600, maxLines: 4 },
 { pattern: 'modi', image: './plugins/memes/modi.png', x: 20, y: 70, maxWidth: 500, maxLines: 4 },
 { pattern: 'imran', image: './plugins/memes/imran.png', x: 20, y: 70, maxWidth: 500, maxLines: 5 },
]

// Registering commands dynamically
memeCommands.forEach(({ pattern, image, x, y, maxWidth, maxLines }) => {
 Index(
  {
   pattern,
   category: 'meme',
   desc: 'Generates a meme with provided text',
  },
  async (message, text) => {
   try {
    if (!text) {
     return await message.send('*Provide text!*')
    }

    const tempImage = `./temp/${pattern}.png`
    const generatedImage = await generateImageWithText(image, tempImage, ' ' + text, x, y, maxWidth, maxLines, '35')
    await sleep(1500)
    await message.bot.sendMessage(message.jid, {
     image: { url: generatedImage },
     caption: Config.caption,
    })
   } catch (error) {
    return await message.error(`${error}\n\n Command: ${pattern}`, error, "*_Didn't get any results, Sorry!_*")
   }
  }
 )
})
