const os = require('os')
const Config = require('../.')
const { formatp, tiny } = require('../')
const long = String.fromCharCode(8206)
const readmore = long.repeat(4001)
const { commands } = require('../plugins')
const config = require('../../config')
const { runtime } = require('../serials')

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
menuText = `${theme.categoryHeader} *${tiny(category)}* ${theme.categoryFooter}\n`
   categorizedCommands[category].forEach(command => {
menuText += `${theme.commandPrefix} ${Config.HANDLERS} ${tiny(command, 1)}\n`
   })
menuText += `${theme.commandFooter}\n`
   break
  } else {
   menuText += `\n${theme.categoryHeader} *${tiny(category)}* ${theme.categoryFooter}\n`
   categorizedCommands[category].forEach(command => {
    menuText += `${theme.commandPrefix} ${Config.HANDLERS} ${tiny(command, 1)}\n`
   })
   menuText += `${theme.commandFooter}\n`
  }
 }

 return menuText + config.caption
}
module.exports = { ping, menu }
