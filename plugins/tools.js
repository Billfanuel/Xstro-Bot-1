const { Index, Cpu } = require('../lib')

Index({
 pattern: 'cpu',
 desc: 'To check bot status',
 category: 'tools',
},
Cpu
)
