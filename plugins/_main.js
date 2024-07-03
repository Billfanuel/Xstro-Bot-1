const config = require('../config')
const { Index } = require('../lib')
const axios = require('axios')

Index(
 {
  pattern: 'repo',
  alias: ['script'],
  desc: 'Sends info about repo',
  category: 'main',
 },
 async context => {
  try {
   const { data: repoData } = await axios.get('https://api.github.com/repos/AstroFx0011/Xstro-Bot')
   const repoInfo = `
\t 𝗫𝘀𝘁𝗿𝗼 𝗕𝗼𝘁 𝟮𝟬𝟮𝟰

𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿 AstroFX0011
𝗖𝗿𝗲𝗮𝘁𝗶𝗼𝗻 ${repoData?.created_at}
𝗦𝘁𝗮𝗿𝘀 ${repoData?.stargazers_count || '120+'} stars
𝗨𝘀𝗲𝗱 𝗕𝘆 ${repoData?.forks_count} Users
𝗦𝗰𝗿𝗶𝗽𝘁 https://github.com/AstroFx0011/Xstro-Bot

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
