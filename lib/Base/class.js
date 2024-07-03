const os = require('os')
const Config = require('../../config')
const long = String.fromCharCode(8206)
const readmore = long.repeat(4001)
const { commands } = require('../plugins')
const config = require('../../config')
const { runtime, formatp } = require('../serials')
const { tiny } = require('../fonts')
const { performance } = require('perf_hooks')
const speed = require('performance-now')
async function ping(context) {
 const startTime = new Date().getTime()
 const { key: messageKey } = await context.reply('*hmm...*')
 const endTime = new Date().getTime()
 const pingTime = endTime - startTime
 await context.send(`*pong!*\n*ʟᴀᴛᴇɴᴄʏ: ${pingTime} ᴍs*`, { edit: messageKey }, '', context)
}

async function menu(message, input) {
 try {
  // Handle specific command details
  if (input.split(' ')[0]) {
   const commandDetails = await getCommandDetails(input.split(' ')[0].toLowerCase())
   if (commandDetails.length > 0) {
    await message.reply(commandDetails.join('\n'))
    return
   }
  }

  // Determine menu theme
  const menuTheme = getMenuTheme()

  // Categorize commands
  const categorizedCommands = categorizeCommands()

  // Generate menu text
  const menuText = generateMenuText(message, categorizedCommands, menuTheme, input)

  // Send menu
  const messageOptions = {
   caption: menuText,
   ephemeralExpiration: 30,
  }
  return await message.sendUi(message.chat, messageOptions, message)
 } catch (error) {
  await message.error(`${error}\nCommand: menu`, error)
 }
}

function getCommandDetails(commandName) {
 const foundCommand = commands.find(cmd => cmd.pattern === commandName)
 if (!foundCommand) return []

 const details = []
 details.push(`*🔉Command:* ${foundCommand.pattern}`)
 if (foundCommand.category) details.push(`*💁Category:* ${foundCommand.category}`)
 if (foundCommand.alias && foundCommand.alias[0]) details.push(`*💁Alias:* ${foundCommand.alias.join(', ')}`)
 if (foundCommand.desc) details.push(`*💁Description:* ${foundCommand.desc}`)
 if (foundCommand.use)
  details.push(`*〽️Usage:*\n \`\`\`${Config.prefix}${foundCommand.pattern} ${foundCommand.use}\`\`\``)
 if (foundCommand.usage) details.push(`*〽️Usage:*\n \`\`\`${foundCommand.usage}\`\`\``)

 return details
}

function getMenuTheme() {
 let themeType = Config.menu === '' ? Math.floor(Math.random() * 4) + 1 : parseInt(Config.menu)

 const themes = {
  1: {
   header: `╭━━━〔 *${Config.botname}* 〕━━━┈⊷`,
   footer: '┃✵╰──────────────\n╰━━━━━━━━━━━━━━━┈⊷',
   categoryHeader: '╭─────────────┈⊷\n│「',
   categoryFooter: '」\n╰┬────────────┈⊷',
   commandPrefix: '││◦➛',
   commandFooter: '│╰────────────┈⊷\n╰─────────────┈⊷',
  },
  2: {
   header: `╭═══ *${Config.botname}* ═══⊷\n┃❃╭──────────────`,
   footer: '┃❃╰───────────────\n╰═════════════════⊷',
   categoryHeader: '╭─❏',
   categoryFooter: '❏',
   commandPrefix: '┃❃│',
   commandFooter: '┃❃╰───────────────\n╰═════════════════⊷',
  },
  3: {
   header: `╭〘  ${Config.botname}  〙`,
   footer: '╰═══════════════⊷',
   categoryHeader: '╭─❍',
   categoryFooter: '══⊷❍',
   commandPrefix: '│',
   commandFooter: '╰════════════─⊷',
  },
 }

 return themes[themeType] || themes[3] // Default to theme 3 if invalid
}

function categorizeCommands() {
 const categorized = {}
 commands.forEach(command => {
  if (command.dontAddCommandList === false && command.pattern !== undefined) {
   if (!categorized[command.category]) {
    categorized[command.category] = []
   }
   categorized[command.category].push(command.pattern)
  }
 })
 return categorized
}

function generateMenuText(message, categorizedCommands, theme, input) {
 let menuText = `
╭═══〘 *${Config.botname}* 〙═══⊷
┃✵╭──────────────
┃✵│ \`\`\`Owner\`\`\` ${Config.ownername}
┃✵│ \`\`\`Plugins\`\`\` ${commands.length}
┃✵│ \`\`\`Runtime\`\`\` ${runtime(process.uptime())}
┃✵│ \`\`\`Ram\`\`\` ${formatp(os.totalmem() - os.freemem())}
┃✵│ \`\`\`Time\`\`\` ${message.time}
┃✵│ \`\`\`Date\`\`\` ${message.date}
┃✵│ \`\`\`Version\`\`\` ${config.VERSION}
│✵╰────────────┈⊷
╰═════════════════⊷
${readmore}
`
for (const category in categorizedCommands) {
  if (input.toLowerCase() === category.toLowerCase()) {
menuText = `
❍═══〘 *${tiny(category)}* 〙══⊷❍\n`
categorizedCommands[category].forEach(command => {
menuText += `
┃✵│ ${Config.HANDLERS} ${tiny(command, 1)}\n`})
menuText += `
┃✵╰───────────────
╰═════════════════⊷\n`
}
}
return menuText + config.caption
}

async function Cpu(message) {
 try {
  const memoryUsage = process.memoryUsage()
  const cpus = os.cpus().map(cpu => {
   cpu.total = Object.values(cpu.times).reduce((total, time) => total + time, 0)
   return cpu
  })

  const cpuUsage = cpus.reduce(
   (acc, cpu, _, { length }) => {
    for (const type in cpu.times) {
     acc.times[type] += cpu.times[type]
    }
    acc.speed += cpu.speed / length
    acc.total += cpu.total
    return acc
   },
   {
    speed: 0,
    total: 0,
    times: {
     user: 0,
     nice: 0,
     sys: 0,
     idle: 0,
     irq: 0,
    },
   }
  )

  const startTime = performance.now()
  const latency = speed() - speed()
  const endTime = performance.now()

  const response = `
 *Server Info*
 
   *Runtime:* ${runtime(process.uptime())}
   *Speed:* ${latency.toFixed(3)}/${(endTime - startTime).toFixed(3)} ms
   *RAM:* ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}
 
   *Memory Usage:*
       ${Object.entries(memoryUsage)
        .map(
         ([key, value]) =>
          `${key.padEnd(Math.max(...Object.keys(memoryUsage).map(k => k.length)), ' ')}: ${formatp(value)}`
        )
        .join('\n      ')}
 
 ${
  cpus[0]
   ? `
   *Total CPU Usage:*
   *${cpus[0].model.trim()} (${cpuUsage.speed.toFixed(2)} MHZ)*
       ${Object.entries(cpuUsage.times)
        .map(([type, time]) => `- ${type.padEnd(6)}: ${((time * 100) / cpuUsage.total).toFixed(2)}%`)
        .join('\n      ')}
 
   *CPU Core Usage (${cpus.length} Core CPU)*
   ${cpus
    .map(
     (cpu, index) => `
     *Core ${index + 1}: ${cpu.model.trim()} (${cpu.speed} MHZ)*
       ${Object.entries(cpu.times)
        .map(([type, time]) => `- ${type.padEnd(6)}: ${((time * 100) / cpu.total).toFixed(2)}%`)
        .join('\n      ')}
   `
    )
    .join('\n')}
 `
   : ''
 }
     `.trim()

  await message.send(response, {}, '', message)
 } catch (error) {
  await message.error(`${error}\n\ncommand: cpu`, error, '*_No response from Server side, Sorry!!_*')
 }
}
module.exports = { ping, menu, Cpu }
