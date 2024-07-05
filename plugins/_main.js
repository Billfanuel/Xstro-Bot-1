const config = require('../config')
const { Index } = require('../lib')

// Define the command using the Index function
Index(
 {
  pattern: 'repo',
  alias: ['script'],
  desc: 'Sends info about repo',
  category: 'main',
 },
 async context => {
  try {
   const repoInfo = `
\t 𝗫𝘀𝘁𝗿𝗼 𝗕𝗼𝘁 𝟮𝟬𝟮𝟰
*_Creator_* AstroFX0011
*_Project_* https://github.com/AstroFx0011/Xstro-Bot
\t\t ${config.botname}
      `.trim()
   await context.sendUi(context.jid, {
    caption: repoInfo,
   })
  } catch (error) {
   await context.error(`${error.message}\n\ncommand: repo`, error)
  }
 }
)
