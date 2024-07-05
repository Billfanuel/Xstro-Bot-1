const { Index, ping } = require('../lib')
const { XstroMenu } = require('../lib/Base/class')

Index(
 {
  pattern: 'menu',
  desc: 'Get All Commands',
  category: 'system',
 },
 XstroMenu
)
Index(
 {
  pattern: 'ping',
  desc: 'Ping Sever',
  category: 'system',
 },
 ping
)
