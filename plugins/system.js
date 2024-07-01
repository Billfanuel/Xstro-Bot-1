const { exec } = require('child_process')
const { plugins, Index, Config } = require('../lib')

const isOwner = true // isOwner ?

Index(
 {
  cmdname: 'shutdown',
  info: 'To shut down the bot',
  type: 'system',
  fromMe: isOwner,
 },
 async message => {
  await message.reply('Shutting Down')
  exec('pm2 stop all')
 }
)

Index(
 {
  cmdname: 'restart',
  info: 'To restart the bot',
  type: 'system',
  fromMe: isOwner,
  filename: __filename,
 },
 async message => {
  await message.reply('Restarting')
  exec('pm2 restart all')
 }
)

Index(
 {
  cmdname: 'plugins',
  type: 'owner',
  info: 'Shows list of all externally installed modules',
  fromMe: isOwner,
  use: '<name>',
 },
 async (message, args) => {
  try {
   const pluginList = await plugins(message, 'plugins', args)
   if (!pluginList) {
    return await message.send(`*_There's no plugin installed in ${Config.botname}_*`)
   }
   if (!args) {
    return await message.send(`*All Installed Modules are:*\n\n${pluginList}`)
   }
   await message.send(pluginList)
  } catch (error) {
   message.error(`${error}\n\ncmdName: plugins\n`)
  }
 }
)

Index(
 {
  pattern: 'uninstall',
  type: 'owner',
  info: 'Removes external modules',
  fromMe: isOwner,
 },
 async (message, args) => {
  if (!args) {
   return await message.reply('*_Uhh Please, Provide Me Plugin Name_*')
  }
  if (args === 'alls') {
   return await message.reply(await plugins('remove', 'all', __dirname))
  }
  try {
   const result = await plugins(message, 'remove', args, __dirname)
   await message.send(result, {}, '', message)
  } catch (error) {
   console.error('Error removing plugin:', error)
  }
 }
)

Index(
 {
  cmdname: 'install',
  type: 'owner',
  info: 'Installs external modules',
  fromMe: isOwner,
 },
 async (message, args) => {
  const url = args || (message.quoted ? message.quoted.text : '')
  if (!url.toLowerCase().includes('https')) {
   return await message.send('*_Uhh Please, Provide Me Plugin Url_*')
  }
  const result = await plugins(message, 'install', url, __dirname)
  await message.reply(result)
 }
)
