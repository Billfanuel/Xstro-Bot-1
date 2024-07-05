const { Index, prefix, createUrl, createMediaUrl } = require('../lib')
Index(
 {
  pattern: 'readmore',
  desc: 'Creates a readmore Text Message.',
  category: 'misc',
 },
 async (message, text) => {
  try {
   text = text || message.reply_text
   if (!text) {
    text = '*Example:' + prefix + 'readmore text1 readmore text2*'
   } else {
    text += ' '
   }

   const readMoreChar = String.fromCharCode(8206).repeat(4001)
   const result = text.includes('readmore') ? text.replace(/readmore/, readMoreChar) : text.replace(' ', readMoreChar)

   await message.reply(result)
  } catch (error) {
   await message.error(`${error}\n\ncommand : readmore`, error, false)
  }
 }
)
Index(
 {
  pattern: 'calc',
  desc: 'calculate an equation.',
  category: 'misc',
 },
 async (message, equation) => {
  try {
   if (!equation) {
    return await message.reply('*Please enter a math operation*\n*Example: .calc 22+12*')
   }

   const sanitizedEquation = equation.replace(/\s+/g, '')
   const validEquationRegex = /^(\d+([-+%*/]\d+)+)$/

   if (!validEquationRegex.test(sanitizedEquation)) {
    return await message.reply('Please enter a valid mathematical operation.')
   }

   const calculateResult = expr => {
    return new Function('return ' + expr)()
   }

   if (sanitizedEquation.includes('/') && sanitizedEquation.split('/').some(part => part === '0')) {
    return message.reply('Cannot divide by zero.')
   }

   const result = calculateResult(sanitizedEquation)

   if (sanitizedEquation.split(/[-+%*/]/).length <= 2) {
    const [operand1, operator, operand2] = sanitizedEquation.match(/\d+|[-+%*/]/g)
    return await message.reply(`${operand1} ${operator} ${operand2} = ${result}`)
   } else {
    return await message.reply(`Result: ${result}`)
   }
  } catch (error) {
   return await message.error(`${error}\n\ncommand: calc`, error)
  }
 }
)

Index(
 {
  pattern: 'url',
  category: 'misc',
  filename: __filename,
  desc: 'Convert image or video to URL.',
 },
 async message => {
  await createMediaUrl(message, createUrl)
 }
)

Index(
 {
  pattern: 'upload',
  category: 'misc',
  desc: 'Upload image or video and get URL.',
 },
 async message => {
  await createMediaUrl(message, path => createUrl(path, 'uguMashi'))
 }
)
