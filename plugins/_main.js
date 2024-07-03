
const util = require("util");
const fs = require("fs-extra");
const {
  cmd
} = require("../lib/plugins");
const {
  formatp,
  TelegraPh,
  aitts,
  smd,
  prefix,
  runtime,
  Config,
  sleep,
  createUrl,
} = require("../lib");
const axios = require("axios");
const fetch = require("node-fetch");
const os = require("os");
const speed = require("performance-now");

let pmtypes = ["videoMessage", "imageMessage"];
cmd({
  pattern: "url",
  alias: ["createurl"],
  category: "general",
  filename: __filename,
  desc: "image to url.",
  use: "<video | image>"
}, async _0x4e4351 => {
  try {
    let _0x680da4 = pmtypes.includes(_0x4e4351.mtype) ? _0x4e4351 : _0x4e4351.reply_message;
    if (!_0x680da4 || !pmtypes.includes(_0x680da4?.mtype)) {
      return _0x4e4351.reply("*_Uhh Dear, Reply To An Image/Video!_*");
    }
    let _0x349452 = await _0x4e4351.bot.downloadAndSaveMediaMessage(_0x680da4);
    let _0x536aa6 = await createUrl(_0x349452);
    if (!_0x536aa6) {
      return _0x4e4351.reply("*_Failed To Create Url!_*");
    }
    try {
      fs.unlink(_0x349452);
    } catch {}
    await _0x4e4351.send(util.format(_0x536aa6), {}, "asta", _0x680da4);
  } catch (_0x2ee8cc) {
    await _0x4e4351.error(_0x2ee8cc + "\n\ncommand url", _0x2ee8cc);
  }
});
cmd({
  pattern: "upload",
  alias: ["url2"],
  category: "general",
  filename: __filename,
  desc: "image to url.",
  use: "<video | image>"
}, async _0xbda24 => {
  try {
    let _0x7d6de1 = pmtypes.includes(_0xbda24.mtype) ? _0xbda24 : _0xbda24.reply_message;
    if (!_0x7d6de1 || !pmtypes.includes(_0x7d6de1?.mtype)) {
      return _0xbda24.reply("*_Uhh Dear, Reply To An Image/Video!_*");
    }
    let _0xeb95de = await _0xbda24.bot.downloadAndSaveMediaMessage(_0x7d6de1);
    let _0x3e1ea8 = await createUrl(_0xeb95de, "uguMashi");
    try {
      fs.unlink(_0xeb95de);
    } catch {}
    if (!_0x3e1ea8 || !_0x3e1ea8.url) {
      return _0xbda24.reply("*_Failed To Create Url!_*");
    }
    await _0xbda24.send(util.format(_0x3e1ea8.url), {}, "asta", _0x7d6de1);
  } catch (_0x1a2f02) {
    await _0xbda24.error(_0x1a2f02 + "\n\ncommand upload", _0x1a2f02);
  }
});
smd({
  pattern: "calc",
  desc: "calculate an equation.",
  category: "general",
  use: "<equation>",
  filename: __filename
}, async (_0x5d95a7, _0x28af98) => {
  try {
    if (!_0x28af98) {
      return await _0x5d95a7.reply("*Please enter a math operation*\n*Example: .calc 22+12*");
    }
    let _0xcebecd = _0x28af98.replace(/\s+/g, "");
    if (!/^(\d+([-+%*/]\d+)+)$/.test(_0xcebecd)) {
      return await _0x5d95a7.reply("Please enter a valid mathematical operation.");
    }
    const _0x38ba36 = _0x3b53fe => {
      return new Function("return " + _0x3b53fe)();
    };
    const _0x5e0640 = _0x38ba36(_0xcebecd);
    if (_0xcebecd.includes("/") && _0xcebecd.split("/").some(_0x413293 => _0x413293 === "0")) {
      return _0x5d95a7.reply("Cannot divide by zero.");
    }
    if (_0xcebecd.split(/[-+%*/]/).length <= 2) {
      const [_0x120f57, _0x1de7dc, _0x112a0e] = _0xcebecd.match(/\d+|[-+%*/]/g);
      return await _0x5d95a7.reply(_0x120f57 + " " + _0x1de7dc + " " + _0x112a0e + " = " + _0x5e0640);
    } else {
      return await _0x5d95a7.reply("Result: " + _0x5e0640);
    }
  } catch (_0x120f52) {
    return await _0x5d95a7.error(_0x120f52 + "\n\ncommand: calc", _0x120f52);
  }
});
async function getDateTime() {
  const _0x2e0403 = new Date();
  const _0x142ad5 = _0x2e0403.toISOString().slice(0, 10);
  const _0x144a84 = _0x2e0403.toLocaleTimeString();
  return {
    date: _0x142ad5,
    time: _0x144a84
  };
}
smd({
  pattern: "repo",
  alias: ["git", "sc", "script"],
  desc: "Sends info about repo",
  category: "general",
  filename: __filename
}, async _0x45da98 => {
  try {
    let {
      data: _0x44f98c
    } = await axios.get("https://api.github.com/repos/Astropeda/Asta-Md");
    let _0x1c73f9 = ("\nᴀsᴛᴀ ᴍᴅ ᴀ sɪᴍᴘʟᴇ ᴡʜᴀᴛsᴀᴘᴘ ʙᴏᴛ, ᴍᴀᴅᴇ ʙʏ ᴀsᴛʀᴏᴘᴇᴅᴀ ᴀɴᴅ ᴅᴇᴘʟᴏʏᴇᴅ ʙʏ *" + Config.ownername + "*.\n\n  *❲❒❳ Stars:* " + (_0x44f98c?.stargazers_count || "120+") + " stars\n  *❲❒❳ Forks:* " + (_0x44f98c?.forks_count || "1000+") + " forks\n  *❲❒❳ Authors:* Astropeda\n  *❲❒❳ Created On:* " + (_0x44f98c?.created_at || "undefined") + "\n  *❲❒❳ Repo:* _https://github.com/Astropeda/Asta-Md_\n  *❲❒❳ Scan:* _" + scan + "_" + (Config.caption ? "\n\n" + Config.caption : "")).trim();
    return await _0x45da98.sendUi(_0x45da98.jid, {
      caption: _0x1c73f9
    });
  } catch (_0x5816fe) {
    await _0x45da98.error(_0x5816fe + "\n\ncommand: repo", _0x5816fe);
  }
});
smd({
  pattern: "cpu",
  desc: "To check bot status",
  category: "general",
  filename: __filename
}, async _0x51c639 => {
  try {
    const _0x78d515 = process.memoryUsage();
    const _0x14b376 = os.cpus().map(_0x4baa78 => {
      _0x4baa78.total = Object.keys(_0x4baa78.times).reduce((_0x124129, _0x54fdbe) => _0x124129 + _0x4baa78.times[_0x54fdbe], 0);
      return _0x4baa78;
    });
    const _0x52bb92 = _0x14b376.reduce((_0x371aab, _0x42f37d, _0x41ec3e, {
      length: _0x3f2c1a
    }) => {
      _0x371aab.total += _0x42f37d.total;
      _0x371aab.speed += _0x42f37d.speed / _0x3f2c1a;
      _0x371aab.times.user += _0x42f37d.times.user;
      _0x371aab.times.nice += _0x42f37d.times.nice;
      _0x371aab.times.sys += _0x42f37d.times.sys;
      _0x371aab.times.idle += _0x42f37d.times.idle;
      _0x371aab.times.irq += _0x42f37d.times.irq;
      return _0x371aab;
    }, {
      speed: 0,
      total: 0,
      times: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0
      }
    });
    timestampe = speed();
    latensie = speed() - timestampe;
    var _0x54755f = performance.now();
    var _0x366cd8 = performance.now();
    respon = ("*❲❒❳ " + Config.botname + " Server Info ❲❒❳*\n\n  *❲❒❳ Runtime:* " + runtime(process.uptime()) + "\n  *❲❒❳ Speed:* " + latensie.toFixed(3) + "/" + (_0x366cd8 - _0x54755f).toFixed(3) + " ms\n  *❲❒❳ RAM:* " + formatp(os.totalmem() - os.freemem()) + " / " + formatp(os.totalmem()) + "\n\n  *❲❒❳ Memory Usage:*\n      " + Object.keys(_0x78d515).map((_0x4a444a, _0xf623b7, _0x26f7ee) => _0x4a444a.padEnd(Math.max(..._0x26f7ee.map(_0x470f51 => _0x470f51.length)), " ") + ": " + formatp(_0x78d515[_0x4a444a])).join("\n      ") + "\n\n" + (_0x14b376[0] ? "  *❲❒❳ Total CPU Usage:*\n  *" + _0x14b376[0].model.trim() + " (" + _0x52bb92.speed + " MHZ)*\n      " + Object.keys(_0x52bb92.times).map(_0x1a945a => "-" + (_0x1a945a + "").padEnd(6) + ": " + (_0x52bb92.times[_0x1a945a] * 100 / _0x52bb92.total).toFixed(2) + "%").join("\n      ") + "\n\n  *❲❒❳ CPU Core Usage (" + _0x14b376.length + " Core CPU)*\n  " + _0x14b376.map((_0x1ada4d, _0x5999d4) => "*Core " + (_0x5999d4 + 1) + ": " + _0x1ada4d.model.trim() + " (" + _0x1ada4d.speed + " MHZ)*\n      " + Object.keys(_0x1ada4d.times).map(_0x2cc08d => "-" + (_0x2cc08d + "").padEnd(6) + ": " + (_0x1ada4d.times[_0x2cc08d] * 100 / _0x1ada4d.total).toFixed(2) + "%").join("\n      ")).join("\n\n") : "") + "\n").trim();
    return await _0x51c639.send(respon, {}, "", _0x51c639);
  } catch (_0x102a1d) {
    await _0x51c639.error(_0x102a1d + "\n\ncommand: cpu", _0x102a1d, "*_No responce from Server side, Sorry!!_*");
  }
});