const { Index } = require("../lib");
const { menu } = require("../lib/Base/class");

Index({
    pattern: 'menu',
    desc: 'Get All Commands',
    category: 'system'
,
},
menu
)