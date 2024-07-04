const config = require('../config')
const { Index } = require('../lib')

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
*_Porject_* https://github.com/AstroFx0011/Xstro-Bot
\t ${config.botname}
`.trim()

   return await context.sendUi(context.jid, {
    caption: repoInfo,
   })
  } catch (error) {
   await context.error(`${error}\n\ncommand: repo`, error)
  }
 }
)
