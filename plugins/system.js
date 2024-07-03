const { Index, ping } = require('../lib')
const { menu } = require('../lib/Base/class')

Index(
 {
  pattern: 'menu',
  desc: 'Get All Commands',
  category: 'system',
 },
 menu
)
Index(
 {
  pattern: 'ping',
  desc: 'Ping Sever',
  category: 'system',
 },
 ping
)
