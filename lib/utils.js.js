const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const Jimp = require("jimp");
const fetch = require("node-fetch");
const {
  getBuffer,
  fetchJson,
  runtime,
  isUrl,
  GIFBufferToVideoBuffer
} = require("./serials.js");
let sides = "*";
const {
  tlang,
  TelegraPh,
  dare,
  truth,
  random_question
} = require("./scraper.js");
const {
  bot_
} = require("./program.js");
const Config = require("../config.js");
let caption = Config.caption || "";
const {
  Innertube,
  UniversalCache,
  Utils
} = require("youtubei.js");
const {
  existsSync,
  mkdirSync,
  createWriteStream
} = require("fs");
let yt = {};
yt.getInfo = async (_0x3c2895, _0x49e43c = {}) => {
  try {
    if (!global.OfficialRepo) {
      return;
    }
    const _0x3f4543 = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true
    });
    let _0x538e69 = await _0x3f4543.getInfo(_0x3c2895, _0x49e43c);
    let _0x1cb8d4 = [];
    for (let _0x21836a = 0; _0x21836a < _0x538e69.streaming_data.formats.length; _0x21836a++) {
      await _0x1cb8d4.push(_0x538e69.streaming_data.formats[_0x21836a].quality_label);
    }
    let _0x3ea204 = _0x1cb8d4.includes("360p") ? "360p" : "best";
    let _0x3296e8 = {
      status: true,
      title: _0x538e69.basic_info.title,
      id: _0x538e69.basic_info.id,
      quality: _0x1cb8d4,
      pref_Quality: _0x3ea204,
      duration: _0x538e69.basic_info.duration,
      description: _0x538e69.basic_info.short_description,
      keywords: _0x538e69.basic_info.keywords,
      thumbnail: _0x538e69.basic_info.thumbnail[0].url,
      author: _0x538e69.basic_info.author,
      views: _0x538e69.basic_info.view_count,
      likes: _0x538e69.basic_info.like_count,
      category: _0x538e69.basic_info.category,
      channel: _0x538e69.basic_info.channel,
      basic_info: _0x538e69
    };
    return _0x3296e8;
  } catch (_0x39b819) {
    console.log("./lib/asta/yt.getInfo()\n", _0x39b819.message);
    return {
      status: false
    };
  }
};
yt.download = async (_0x1ea0cb, _0x5c75ae = {
  type: "video",
  quality: "best",
  format: "mp4"
}) => {
  try {
    if (!global.OfficialRepo) {
      return;
    }
    const _0x47c128 = await Innertube.create({
      cache: new UniversalCache(false),
      generate_session_locally: true
    });
    let _0x2d2cde = _0x5c75ae.type ? _0x5c75ae.type : "video";
    let _0x12faa2 = _0x2d2cde === "audio" ? "best" : _0x5c75ae.quality ? _0x5c75ae.quality : "best";
    let _0x52ce78 = _0x5c75ae.format ? _0x5c75ae.format : "mp4";
    const _0xdd017a = await _0x47c128.download(_0x1ea0cb, {
      type: _0x2d2cde,
      quality: _0x12faa2,
      format: _0x52ce78
    });
    const _0x150898 = "./temp";
    if (!existsSync(_0x150898)) {
      mkdirSync(_0x150898);
    }
    let _0x35b4d2 = _0x2d2cde === "video" ? "mp4" : "m4a";
    let _0x3991fc = _0x150898 + "/Asta-Md " + _0x1ea0cb + "." + _0x35b4d2;
    var _0x1dcf9 = createWriteStream(_0x3991fc);
    for await (const _0x32868e of Utils.streamToIterable(_0xdd017a)) {
      _0x1dcf9.write(_0x32868e);
    }
    return _0x3991fc;
  } catch (_0x26244e) {
    console.log("./lib/asta/yt.dowanload()\n", _0x26244e.message);
    return false;
  }
};
async function sendAnimeReaction(_0x5c448a, _0x46face = "punch", _0x50961f = "", _0x426154 = "") {
  try {
    var _0x1b5aac = await fetchJson("https://api.waifu.pics/sfw/" + _0x46face);
    const _0x55f096 = await axios.get(_0x1b5aac.url, {
      responseType: "arraybuffer"
    });
    const _0x43f098 = Buffer.from(_0x55f096.data, "utf-8");
    let _0x5b40dd = _0x5c448a.mentionedJid ? _0x5c448a.mentionedJid[0] : _0x5c448a.quoted ? _0x5c448a.quoted.sender : false;
    let _0x21964f = await GIFBufferToVideoBuffer(_0x43f098);
    let _0x51f2b9 = _0x5b40dd ? sides + "@" + _0x5c448a.sender.split("@")[0] + " " + _0x50961f + " @" + _0x5b40dd.split("@")[0] + sides : sides + "@" + _0x5c448a.sender.split("@")[0] + " " + _0x426154 + sides;
    if (_0x5b40dd) {
      return await _0x5c448a.bot.sendMessage(_0x5c448a.chat, {
        video: _0x21964f,
        gifPlayback: true,
        mentions: [_0x5b40dd, _0x5c448a.sender],
        caption: _0x51f2b9
      }, {
        quoted: _0x5c448a,
        messageId: _0x5c448a.bot.messageId()
      });
    } else {
      return await _0x5c448a.bot.sendMessage(_0x5c448a.chat, {
        video: _0x21964f,
        gifPlayback: true,
        mentions: [_0x5c448a.sender],
        caption: _0x51f2b9
      }, {
        quoted: _0x5c448a,
        messageId: _0x5c448a.bot.messageId()
      });
    }
  } catch (_0x1b7c90) {
    return await _0x5c448a.error(_0x1b7c90 + "\nERROR AT : /lib/utils.js/sendAnimeReaction()\n\ncommand: " + _0x46face);
  }
}
async function sendGImages(_0x4a189d, _0x4eee7c, _0x205b7c = caption, _0x1caf0d = "") {
  try {
    let _0x5a7b69 = require("async-g-i-s");
    let _0x13a23e = await _0x5a7b69(_0x4eee7c);
    let _0x56c98f = _0x13a23e[Math.floor(Math.random() * _0x13a23e.length)].url;
    let _0xd91af3 = {
      image: {
        url: _0x56c98f
      },
      caption: _0x205b7c,
      contextInfo: {
        externalAdReply: {
          title: tlang().title,
          body: _0x1caf0d,
          thumbnail: log0,
          mediaType: 1,
          mediaUrl: gurl,
          sourceUrl: gurl
        }
      }
    };
    return await _0x4a189d.bot.sendMessage(_0x4a189d.chat, _0xd91af3, {
      quoted: _0x4a189d,
      messageId: _0x4a189d.bot.messageId()
    });
  } catch (_0x36d8e7) {
    await _0x4a189d.error(_0x36d8e7);
    return console.log("./lib/utils.js/sendGImages()\n", _0x36d8e7);
  }
}
async function AudioToBlackVideo(_0x2bac4d, _0x568b06) {
  try {
    try {
      fs.unlinkSync(_0x568b06);
    } catch (_0x1ca356) {}
    const _0x4b7070 = "ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 " + _0x2bac4d;
    const {
      stdout: _0x356d80
    } = await exec(_0x4b7070);
    const _0x4ffac3 = parseFloat(_0x356d80);
    let _0x222ae6 = "./temp/blackScreen.mp4";
    try {
      fs.unlinkSync(_0x222ae6);
    } catch (_0x526371) {}
    const _0x32b4ee = "ffmpeg -f lavfi -i color=c=black:s=1280x720:d=" + _0x4ffac3 + " -vf \"format=yuv420p\" " + _0x222ae6;
    await exec(_0x32b4ee);
    const _0x332e3c = "ffmpeg -i " + _0x222ae6 + " -i " + _0x2bac4d + " -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 " + _0x568b06;
    await exec(_0x332e3c);
    console.log("Audio converted to black screen video successfully!");
    return {
      result: true
    };
  } catch (_0x4971e7) {
    console.error("./lib/Aviator.js/AudioToBlackVideo()\n", _0x4971e7);
    return {
      result: false
    };
  }
}
async function textToLogoGenerator(_0x371218, _0x4f590d = "", _0x13a1c2 = "", _0x11339e = "ser", _0x2091c1 = "textpro", _0x1bd248 = true) {
  let _0x19543f = {};
  let _0x1d4467 = {};
  let _0x44b219 = /1|ephoto|ephoto360/gi.test(_0x2091c1) ? "https://ephoto360.com/" + _0x4f590d + ".html" : /2|potoxy|photooxy/gi.test(_0x2091c1) ? "https://photooxy.com/" + _0x4f590d + ".html" : /3|enphoto|en360/gi.test(_0x2091c1) ? "https://en.ephoto360.com/" + _0x4f590d + ".html" : "https://textpro.me/" + _0x4f590d + ".html";
  try {
    const {
      textpro: _0x4cf419
    } = require("mumaker");
    if (_0x13a1c2) {
      _0x19543f = await _0x4cf419(_0x44b219, [_0x13a1c2, _0x11339e]);
    }
    let _0x339d4a = {} || {
      ...(await _0x371218.bot.contextInfo("ᴛᴇxᴛ ᴛᴏ ʟᴏɢᴏ", "Hello " + _0x371218.senderName))
    };
    return await _0x371218.bot.sendMessage(_0x371218.jid, {
      image: {
        url: _0x19543f.image
      },
      caption: caption,
      contextInfo: _0x339d4a
    }, {
      messageId: _0x371218.bot.messageId()
    });
  } catch (_0x4845d6) {
    try {
      let _0x4a65d4 = global.api_smd + ("/api/maker?text1=" + _0x13a1c2 + "&text2=" + _0x11339e + "&url=" + _0x44b219);
      _0x1d4467 = await fetchJson(_0x4a65d4);
      if ((!_0x1d4467 || !_0x1d4467.status || !_0x1d4467.img) && _0x1bd248) {
        return _0x371218.error(_0x4845d6 + "\nWebinfo:" + (_0x1d4467.img || _0x1d4467) + "\n\nfileName: textToLogoGenerator->s.js", _0x4845d6);
      }
      await _0x371218.bot.sendMessage(_0x371218.jid, {
        image: {
          url: _0x1d4467.img
        }
      }, {
        messageId: _0x371218.bot.messageId()
      });
    } catch (_0x549deb) {
      let _0xa9ebc6 = _0x19543f && _0x19543f.image ? _0x19543f.image : _0x1d4467 && _0x1d4467.img ? _0x1d4467.img : false;
      if (_0x1bd248) {
        _0x371218.error(_0x4845d6 + "\n\nAPI Error : " + _0x549deb + "\n\nfileName: textToLogoGenerator->s.js", _0x4845d6, (_0xa9ebc6 ? "Here we go\n\n" + _0xa9ebc6 : "Error, Request Denied!").trim());
      }
    }
  }
}
async function photoEditor(_0x17796b, _0x343213 = "ad", _0xf62b7f = "", _0xe1eb47 = true) {
  let _0xc6e0fc = ["imageMessage"];
  try {
    let _0x430f77 = _0xc6e0fc.includes(_0x17796b.mtype) ? _0x17796b : _0x17796b.reply_message;
    if (!_0x430f77 || !_0xc6e0fc.includes(_0x430f77?.mtype || "null")) {
      return await _0x17796b.send("*_Uhh Dear, Reply to an image_*");
    }
    let _0x2de3c4 = await _0x17796b.bot.downloadAndSaveMediaMessage(_0x430f77);
    let _0x9a4084 = await TelegraPh(_0x2de3c4);
    try {
      fs.unlinkSync(_0x2de3c4);
    } catch (_0x408f7d) {}
    return await _0x17796b.bot.sendMessage(_0x17796b.chat, {
      image: {
        url: "https://api.popcat.xyz/" + _0x343213 + "?image=" + _0x9a4084
      },
      caption: _0xf62b7f
    }, {
      quoted: _0x17796b,
      messageId: _0x17796b.bot.messageId()
    });
  } catch (_0x23ac28) {
    if (_0xe1eb47) {
      await _0x17796b.error(_0x23ac28 + "\n\ncommand: " + _0x343213 + "\nfileName: photoEditor->s.js", _0x23ac28);
    }
  }
}
async function plugins(userSession, command, pluginUrl = '', pluginsPath = '') {
 let responseMessage = ''

 try {
  // Retrieve or create the bot configuration for the user
  let botConfig =
   (await bot_.findOne({ id: 'bot_' + userSession.user })) || (await bot_.new({ id: 'bot_' + userSession.user }))
  let installedPlugins = botConfig.plugins

  if (command.toLowerCase() === 'install') {
   let installedPluginNames = ''

   for (let url of isUrl(pluginUrl)) {
    let pluginUrl = new URL(url.replace(/[_*]+$/, ''))
    pluginUrl = pluginUrl.href.includes('raw') ? pluginUrl.href : pluginUrl.href + '/raw'

    const { data: pluginData } = await axios.get(pluginUrl)

    let pluginNameMatch =
     /pattern: ["'](.*)["'],/g.exec(pluginData) ||
     /cmdname: ["'](.*)["'],/g.exec(pluginData) ||
     /name: ["'](.*)["'],/g.exec(pluginData)

    if (!pluginNameMatch) {
     responseMessage += '*gist not found:* _' + pluginUrl + '_ \n'
     continue
    }

    let pluginName = pluginNameMatch[1].split(' ')[0] || Math.random().toString(36).slice(-5)
    let sanitizedPluginName = pluginName.replace(/[^A-Za-z]/g, '')

    if (installedPluginNames.includes(sanitizedPluginName)) {
     continue
    } else {
     installedPluginNames += `["${sanitizedPluginName}"] `
    }

    if (installedPlugins[sanitizedPluginName]) {
     responseMessage += `*Plugin _'${sanitizedPluginName}'_ already installed!*\n`
     continue
    }

    let pluginFilePath = `${pluginsPath}/${sanitizedPluginName}.js`
    await fs.writeFileSync(pluginFilePath, pluginData, 'utf8')

    try {
     require(pluginFilePath)
    } catch (error) {
     fs.unlinkSync(pluginFilePath)
     responseMessage += `*Invalid :* _${pluginUrl}_\n \`\`\`${error}\`\`\`\n\n `
     continue
    }

    if (!installedPlugins[sanitizedPluginName]) {
     installedPlugins[sanitizedPluginName] = pluginUrl
     await bot_.updateOne({ id: 'bot_' + userSession.user }, { plugins: installedPlugins })
     responseMessage += `*Plugin _'${sanitizedPluginName}'_ Successfully installed!*\n`
    }
   }
  } else if (command.toLowerCase() === 'remove') {
   if (pluginUrl === 'all') {
    let removedPlugins = ''

    for (const pluginName in installedPlugins) {
     try {
      fs.unlinkSync(`${pluginsPath}/${pluginName}.js`)
      removedPlugins += `${pluginName},`
     } catch (error) {
      console.log(`❌ ${pluginName} ❌ NOT BE REMOVED`, error)
     }
    }

    await bot_.updateOne({ id: 'bot_' + userSession.user }, { plugins: {} })
    responseMessage = `*External plugins ${removedPlugins ? removedPlugins : 'all'} removed!!!*`
   } else {
    try {
     if (installedPlugins[pluginUrl]) {
      try {
       fs.unlinkSync(`${pluginsPath}/${pluginUrl}.js`)
      } catch {}

      delete installedPlugins[pluginUrl]
      await bot_.updateOne({ id: 'bot_' + userSession.user }, { plugins: installedPlugins })
      responseMessage += `*Plugin _'${pluginUrl}'_ Successfully removed!*`
     } else {
      responseMessage += `*_plugin not exist in ${Config.botname}_*`
     }
    } catch (error) {
     console.log('Error while removing plugins \n ', error)
    }
   }
  } else if (command.toLowerCase() === 'plugins') {
   if (pluginUrl) {
    responseMessage = installedPlugins[pluginUrl] ? `*_${pluginUrl}:_* ${installedPlugins[pluginUrl]}` : false
   } else {
    let count = 1
    for (const pluginName in installedPlugins) {
     responseMessage += `*${count}:* ${pluginName} \n*Url:* ${installedPlugins[pluginName]}\n\n`
     count++
    }
   }
  }
  return responseMessage
 } catch (error) {
  console.log('Plugins : ', error)
  return (responseMessage + ' \n\nError: ' + error).trim()
 }
}

async function updateProfilePicture(_0x222037, _0x288358, _0x356e2d, _0x42b490 = "pp") {
  try {
    if (_0x42b490 === "pp" || _0x42b490 === "gpp") {
      let _0x25ce47 = await _0x222037.bot.downloadAndSaveMediaMessage(_0x356e2d);
      await _0x222037.bot.updateProfilePicture(_0x288358, {
        url: _0x25ce47
      });
    } else {
      async function _0x2e4ae1(_0x2fed3e) {
        const _0x451493 = await Jimp.read(_0x2fed3e);
        const _0x160ea5 = _0x451493.getWidth();
        const _0x130adc = _0x451493.getHeight();
        const _0xa030b1 = _0x451493.crop(0, 0, _0x160ea5, _0x130adc);
        return {
          img: await _0xa030b1.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
          preview: await _0xa030b1.normalize().getBufferAsync(Jimp.MIME_JPEG)
        };
      }
      try {
        const _0x44a93d = await _0x356e2d.download();
        const {
          query: _0xb7b2b0
        } = _0x222037.bot;
        const {
          preview: _0x27ac1a
        } = await _0x2e4ae1(_0x44a93d);
        await _0xb7b2b0({
          tag: "iq",
          attrs: {
            to: _0x288358,
            type: "set",
            xmlns: "w:profile:picture"
          },
          content: [{
            tag: "picture",
            attrs: {
              type: "image"
            },
            content: _0x27ac1a
          }]
        });
      } catch (_0x242917) {
        let _0x463b86 = await _0x222037.bot.downloadAndSaveMediaMessage(_0x356e2d);
        await _0x222037.bot.updateProfilePicture(_0x288358, {
          url: _0x463b86
        });
        return await _0x222037.error(_0x242917 + " \n\ncommand: update pp", _0x242917, false);
      }
    }
    return await _0x222037.reply("*_Profile icon updated Succesfully!!_*");
  } catch (_0x24cb69) {
    return await _0x222037.error(_0x24cb69 + " \n\ncommand: " + (_0x42b490 ? _0x42b490 : "pp"), _0x24cb69);
  }
}
async function forwardMessage(_0x56dbe1, _0x5eaf75, _0x561de2 = "") {
  let _0x48c6f4 = _0x5eaf75.quoted.mtype;
  let _0x3af25e;
  if (_0x48c6f4 === "videoMessage" && _0x561de2 === "ptv") {
    _0x3af25e = {
      ptvMessage: {
        ..._0x5eaf75.quoted
      }
    };
  } else if (_0x48c6f4 === "videoMessage") {
    _0x3af25e = {
      videoMessage: {
        ..._0x5eaf75.quoted
      }
    };
  } else if (_0x48c6f4 === "imageMessage") {
    _0x3af25e = {
      imageMessage: {
        ..._0x5eaf75.quoted
      }
    };
  } else if (_0x48c6f4 === "audioMessage") {
    _0x3af25e = {
      audioMessage: {
        ..._0x5eaf75.quoted
      }
    };
  } else if (_0x48c6f4 === "documentMessage") {
    _0x3af25e = {
      documentMessage: {
        ..._0x5eaf75.quoted
      }
    };
  } else if (_0x48c6f4 === "conversation" || _0x48c6f4 === "extendedTextMessage") {
    return await _0x5eaf75.send(_0x5eaf75.quoted.text, {}, "", _0x5eaf75, _0x56dbe1);
  }
  if (_0x3af25e) {
    try {
      await Suhail.bot.relayMessage(_0x56dbe1, _0x3af25e, {
        messageId: _0x5eaf75.key.id
      });
    } catch (_0x27920e) {
      console.log("Error in " + _0x561de2 + "-cmd in forwardMessage \n", _0x27920e);
      if (_0x561de2 === "ptv" || _0x561de2 === "save") {
        await _0x5eaf75.error(_0x27920e);
      }
    }
  }
}
async function generateSticker(_0x43a996, _0x5c979b, _0x116cae = {
  pack: Config.packname,
  author: Config.author
}, _0x5b1252 = true) {
  try {
    const {
      Sticker: _0x92981e,
      createSticker: _0x1a1a97,
      StickerTypes: _0x5f17c1
    } = require("wa-sticker-formatter");
    let _0x54c67c = new _0x92981e(_0x5c979b, {
      ..._0x116cae
    });
    return await _0x43a996.bot.sendMessage(_0x43a996.chat, {
      sticker: await _0x54c67c.toBuffer()
    }, {
      quoted: _0x43a996,
      messageId: _0x43a996.bot.messageId()
    });
  } catch (_0x32ee71) {
    if (_0x5b1252) {
      await _0x43a996.error(_0x32ee71 + "\n\nfileName: generateSticker->s.js\n");
    }
  }
}
async function getRandom(_0xf0461b = ".jpg", _0x48110d = 10000) {
  return "" + Math.floor(Math.random() * _0x48110d) + _0xf0461b;
}
async function getRandomFunFact(type) {
  try {
    switch (type) {
      case "question":
        return await random_question();
      case "truth":
        return await truth();
      case "dare":
        return await dare();
      case "joke":
        const jokeResponse = await fetch("https://official-joke-api.appspot.com/random_joke");
        const jokeData = await jokeResponse.json();
        return `*Joke:* ${jokeData.setup}\n*Punchline:* ${jokeData.punchline}`;
      case "joke2":
        const joke2Response = await fetch("https://v2.jokeapi.dev/joke/Any?type=single");
        const joke2Data = await joke2Response.json();
        return `*Joke:* ${joke2Data.joke}`;
      case "fact":
        const factResponse = await axios.get("https://nekos.life/api/v2/fact");
        return `*Fact:* ${factResponse.data.fact}`;
      case "quotes":
        const quoteResponse = await axios.get("https://favqs.com/api/qotd");
        return `╔════◇\n║ *🎗️Content:* ${quoteResponse.data.quote.body}\n║ *👤Author:* ${quoteResponse.data.quote.author}\n║\n╚════════════╝`;
      default:
        throw new Error("Invalid type provided");
    }
  } catch (error) {
    msg.error(error);
    console.log("./lib/utils.js/getRandomFunFact()\n", error);
  }
}

async function audioEditor(message, effect = "bass", options = "") {
  if (!message.quoted) {
    return await message.send("*Reply to audio*");
  }

  let mediaType = message.quoted.mtype || message.mtype;
  if (!/audio/.test(mediaType)) {
    return await message.send("*_Reply to the audio you want to change with_*", {}, "", options);
  }

  try {
    let filterCommand = "-af equalizer=f=54:width_type=o:width=2:g=20";

    switch (effect.toLowerCase()) {
      case "bass":
        filterCommand = "-af equalizer=f=54:width_type=o:width=2:g=20";
        break;
      case "blown":
        filterCommand = "-af acrusher=.1:1:64:0:log";
        break;
      case "deep":
        filterCommand = "-af atempo=4/4,asetrate=44500*2/3";
        break;
      case "earrape":
        filterCommand = "-af volume=12";
        break;
      case "fast":
        filterCommand = '-filter:a "atempo=1.63,asetrate=44100"';
        break;
      case "fat":
        filterCommand = '-filter:a "atempo=1.6,asetrate=22100"';
        break;
      case "nightcore":
        filterCommand = "-filter:a atempo=1.06,asetrate=44100*1.25";
        break;
      case "reverse":
        filterCommand = '-filter_complex "areverse"';
        break;
      case "robot":
        filterCommand = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';
        break;
      case "slow":
        filterCommand = '-filter:a "atempo=0.7,asetrate=44100"';
        break;
      case "smooth":
        filterCommand = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';
        break;
      case "tupai":
        filterCommand = '-filter:a "atempo=0.5,asetrate=65100"';
        break;
      default:
        break;
    }

    let audioFilePath = await message.bot.downloadAndSaveMediaMessage(message.quoted);
    let outputFilePath = "temp/" + (message.sender.slice(6) + effect) + ".mp3";

    exec(`ffmpeg -i ${audioFilePath} ${filterCommand} ${outputFilePath}`, async (error, stdout, stderr) => {
      try {
        fs.unlinkSync(audioFilePath);
      } catch {}

      if (error) {
        return message.error(error);
      } else {
        let editedAudio = fs.readFileSync(outputFilePath);
        try {
          fs.unlinkSync(outputFilePath);
        } catch {}

        let contextInfo = {
          ...(await message.bot.contextInfo("Sir " + message.senderName + " 🤍", "⇆ㅤ ||◁ㅤ❚❚ㅤ▷||ㅤ ⇆"))
        };

        return message.bot.sendMessage(
          message.chat,
          {
            audio: editedAudio,
            mimetype: "audio/mpeg",
            ptt: /ptt|voice/.test(message.test || "") ? true : false,
            contextInfo: contextInfo
          },
          {
            quoted: message,
            messageId: message.bot.messageId()
          }
        );
      }
    });
  } catch (error) {
    await message.error(error + "\n\ncmdName : " + effect + "\n");
    return console.log("./lib/utils.js/audioEditor()\n", error);
  }
}

async function send(message, content, options = { packname: "", author: "Xstro" }, additionalInfo = "", additionalParams = "", chatId = "") {
  if (!content || !message) {
    return;
  }

  try {
    let targetChatId = chatId ? chatId : message.chat;
    return await message.send(content, options, additionalInfo, additionalParams, targetChatId);
  } catch (error) {
    console.log("./lib/utils.js/sendMessage()\n", error);
  }
}

async function react(message, reactionText, targetMessage = "") {
  try {
    if (!reactionText || !message) {
      return;
    }

    let targetKey = targetMessage && targetMessage.key ? targetMessage.key : message.key;
    return await message.bot.sendMessage(
      message.chat,
      {
        react: {
          text: reactionText,
          key: targetKey
        }
      },
      {
        messageId: message.bot.messageId()
      }
    );
  } catch (error) {
    console.log("./lib/utils.js/sendReaction()\n", error);
  }
}

let note = {
  info: "Make sure to provide the bot number as the first parameter in the format {user: botNumber} and the note text or ID as the second parameter."
};

note.addnote = async (botInfo, noteText) => {
  try {
    let botData = await bot_.findOne({ id: "bot_" + botInfo.user }) || await bot_.new({ id: "bot_" + botInfo.user });
    let notes = botData.notes || {};
    let noteId = 0;

    while (notes[noteId] !== undefined) {
      noteId++;
    }

    notes[noteId] = noteText;
    await bot_.updateOne({ id: "bot_" + botInfo.user }, { notes });

    return {
      status: true,
      id: noteId,
      msg: `*New note added at ID: ${noteId}*`
    };
  } catch (error) {
    console.log("note.addNote ERROR:", error);
    return {
      status: false,
      error,
      msg: "*Can't add new notes due to an error!*"
    };
  }
};

note.delnote = async (botInfo, noteId) => {
  try {
    let botData = await bot_.findOne({ id: "bot_" + botInfo.user }) || await bot_.new({ id: "bot_" + botInfo.user });
    let notes = botData.notes || {};
    let responseMsg = "*Please provide a valid note ID!*";

    if (notes[noteId] !== undefined) {
      delete notes[noteId];
      await bot_.updateOne({ id: "bot_" + botInfo.user }, { notes });
      responseMsg = `*Note with ID: ${noteId} deleted successfully!*`;
    }

    return {
      status: true,
      msg: responseMsg
    };
  } catch (error) {
    console.log("note.deleteNote ERROR:", error);
    return {
      status: false,
      error,
      msg: "*Can't delete notes due to an error!*"
    };
  }
};

note.delallnotes = async (botInfo) => {
  try {
    await bot_.updateOne({ id: "bot_" + botInfo.user }, { notes: {} });
    return {
      status: true,
      msg: "*All saved notes deleted from the server!*"
    };
  } catch (error) {
    console.log("note.deleteAllNotes ERROR:", error);
    return {
      status: false,
      error,
      msg: "*Request could not be processed, sorry!*"
    };
  }
};

note.allnotes = async (botInfo, noteId = "") => {
  try {
    let botData = await bot_.findOne({ id: "bot_" + botInfo.user }) || await bot_.new({ id: "bot_" + botInfo.user });
    let notes = botData.notes || {};
    let responseMsg = "*Please provide a valid note ID!*";

    if (noteId === "all" || !noteId) {
      let allNotes = "";
      for (const id in notes) {
        allNotes += `*NOTE ${id}:* ${notes[id]}\n\n`;
      }
      responseMsg = allNotes ? allNotes : "*No notes found!*";
    } else if (noteId && notes[noteId]) {
      responseMsg = `*Note ${noteId}:* ${notes[noteId]}`;
    }

    return {
      status: true,
      msg: responseMsg
    };
  } catch (error) {
    console.log("note.getAllNotes ERROR:", error);
    return {
      status: false,
      error,
      msg: "*Can't retrieve notes due to an error!*"
    };
  }
};

async function sendWelcome(
 messageData,
 welcomeMessage = '',
 caption = '',
 groupUrl = '',
 messageType = 'msg',
 includeContext = false
) {
 try {
  if (!global.OfficialRepo) {
   return 'Get Out'
  }

  if (welcomeMessage) {
   if (messageData.isGroup) {
    welcomeMessage = welcomeMessage
     .replace(/@gname|&gname/gi, messageData.metadata.subject)
     .replace(/@desc|&desc/gi, messageData.metadata.desc)
     .replace(/@count|&count/gi, messageData.metadata.participants.length)
   }

   let parsedMessage = welcomeMessage
    .replace(/@user|&user/gi, '@' + messageData.senderNum)
    .replace(/@name|&name/gi, messageData.senderName || '_')
    .replace(/@gname|&gname/gi, '')
    .replace(/@desc|&desc/gi, '')
    .replace(/@count|&count/gi, '1')
    .replace(/@pp|&pp|@gpp|&gpp|@context|&context/g, '')
    .replace(/@time|&time/gi, messageData.time)
    .replace(/@date|&date/gi, messageData.date)
    .replace(/@bot|&bot/gi, Config.botname)
    .replace(/@owner|&owner/gi, Config.ownername)
    .replace(/@caption|&caption/gi, caption)
    .replace(/@gurl|@website|&gurl|&website|@link|&link/gi, groupUrl)
    .replace(/@runtime|&runtime|@uptime|&uptime/gi, '' + runtime(process.uptime()))
    .trim()

   try {
    parsedMessage = parsedMessage.replace(
     /@line|&line/gi,
     (await fetchJson('https://api.popcat.xyz/pickuplines')).pickupline || ''
    )
   } catch {
    parsedMessage = parsedMessage.replace(/@line|&line/gi, '')
   }

   try {
    if (/@quote|&quote/gi.test(parsedMessage)) {
     let { data: quoteData } = await axios.get('https://favqs.com/api/qotd')
     if (quoteData && quoteData.quote) {
      parsedMessage = parsedMessage
       .replace(/@quote|&quote/gi, quoteData.quote.body || '')
       .replace(/@author|&author/gi, quoteData.quote.author || '')
     }
    }
   } catch {
    parsedMessage = parsedMessage.replace(/@quote|&quote|@author|&author/gi, '')
   }

   if (!messageType || messageType === 'msg') {
    try {
     if (typeof groupUrl === 'string') {
      groupUrl = groupUrl.split(',')
     }
     if (/@user|&user/g.test(welcomeMessage) && !groupUrl.includes(messageData.sender)) {
      groupUrl.push(messageData.sender)
     }
    } catch (error) {
     console.log('ERROR:', error)
    }

    let contextInfo = {
     ...(includeContext || /@context|&context/g.test(welcomeMessage)
      ? await messageData.bot.contextInfo(Config.botname, messageData.pushName)
      : {}),
     mentionedJid: groupUrl,
    }

    if (/@pp/g.test(welcomeMessage)) {
     return await messageData.send(
      await messageData.getpp(),
      { caption: parsedMessage, mentions: groupUrl, contextInfo },
      'image',
      caption
     )
    } else if (messageData.jid && /@gpp/g.test(welcomeMessage)) {
     return await messageData.send(
      await messageData.getpp(messageData.jid),
      { caption: parsedMessage, mentions: groupUrl, contextInfo },
      'image',
      caption
     )
    } else {
     return await messageData.send(parsedMessage, { mentions: groupUrl, contextInfo }, 'asta', caption)
    }
   } else {
    return parsedMessage
   }
  }
 } catch (error) {
  console.log('./lib/utils.js/sendWelcome()\n', error)
 }
}

async function aitts(_0x33c126, _0x2b48e0 = "", _0x30230a = true) {
  try {
    if (!global.OfficialRepo || global.OfficialRepo !== "yes") {
      return "u bloody, Get out from here!!";
    }
    if (!ELEVENLAB_API_KEY || !ELEVENLAB_API_KEY.length > 8) {
      return _0x33c126.reply("Dear, You Dont Have ELEVENLAB_API_KEY \nCreate ELEVENLAB KEY from below Link \nhttps://elevenlabs.io/\n\nAnd Set it in ELEVENLAB_API_KEY Var\n\n" + caption);
    }
    const _0x1afcdb = ["21m00Tcm4TlvDq8ikWAM", "2EiwWnXFnvU5JabPnv8n", "AZnzlk1XvdvUeBnXmlld", "CYw3kZ02Hs0563khs1Fj", "D38z5RcWu1voky8WS1ja", "EXAVITQu4vr4xnSDxMaL", "ErXwobaYiN019PkySvjV", "GBv7mTt0atIp3Br8iCZE", "IKne3meq5aSn9XLyUdCD", "LcfcDJNUP1GQjkzn1xUU", "MF3mGyEYCl7XYWbV9V6O", "N2lVS1w4EtoT3dr4eOWO", "ODq5zmih8GrVes37Dizd", "SOYHLrjzK2X1ezoPC6cr", "TX3LPaxmHKxFdv7VOQHJ", "ThT5KcBeYPX3keUQqHPh", "TxGEqnHWrfWFTfGW9XjX", "VR6AewLTigWG4xSOukaG", "XB0fDUnXU5powFXDhCwa", "XrExE9yKIg1WjnnlVkGX", "Yko7PKHZNXotIFUBG7I9", "ZQe5CZNOzWyzPSCn5a3c", "Zlb1dXrM653N07WRdFW3", "bVMeCyTHy58xNoL34h3p", "flq6f7yk4E4fJM5XTYuZ", "g5CIjZEefAph4nQFvHAz", "jBpfuIE2acCO8z3wKNLl", "jsCqWAovK2LkecY7zXl4", "oWAxZDx7w5VEj9dCyTzz", "onwK4e9ZLuTAKqWW03F9", "pMsXgVXv3BLzUgSXRplE", "pNInz6obpgDQGcFmaJgB", "piTKgcLEGmPE4e6mEKli", "t0jbNlBVZ17f02VDIeMI", "wViXBPUzp2ZZixB1xQuM", "yoZ06aMxZJJ28mfd3POQ", "z9fAnlkpzviPz146aGWa", "zcAOhNBS3c14rBihAFp1", "zrHiDhphv9ZnVXBqCLjz"];
    const _0x1cf518 = parseInt(aitts_Voice_Id);
    if (!_0x2b48e0 && !_0x33c126.isCreator) {
      return _0x33c126.reply("*Uhh Dear, Please Provide text..!*\n*Example: _.aitts i am " + _0x33c126.pushName + "._*");
    } else if (!_0x2b48e0 && _0x33c126.isCreator || _0x2b48e0 === "setting" || _0x2b48e0 === "info") {
      return _0x33c126.bot.sendMessage(_0x33c126.jid, {
        text: "*Hey " + _0x33c126.pushName + "!.*\n  _Please provide text!_\n  *Example:* _.aitts i am " + _0x33c126.pushName + "._\n\n  *You Currently " + (!isNaN(_0x1cf518) && _0x1cf518 > 0 && _0x1cf518 <= 39 ? "set Voice Id: " + _0x1cf518 + "*\nUpdate" : "not set any Specific Voice*\nAdd Specific") + " Voice: _.addvar AITTS_ID:35/4/32,etc._\n\n\n  *Also use available voices*```\n\n  1: Rachel\n  2: Clyde\n  3: Domi\n  4: Dave\n  5: Fin\n  6: Bella\n  7: Antoni\n  8: Thomas\n  9: Charlie\n  10: Emily\n  11: Elli\n  12: Callum\n  13: Patrick\n  14: Harry\n  15: Liam\n  16: Dorothy\n  17: Josh\n  18: Arnold\n  19: Charlotte\n  20: Matilda\n  21: Matthew\n  22: James\n  23: Joseph\n  24: Jeremy\n  25: Michael\n  26: Ethan\n  27: Gigi\n  28: Freya\n  29: Grace\n  30: Daniel\n  31: Serena\n  32: Adam\n  33: Nicole\n  34: Jessie\n  35: Ryan\n  36: asta\n  37: Glinda\n  38: Giovanni\n  39: Mimi\n  ```" + ("\n\n  *Example:* _.aitts i am " + _0x33c126.pushName + "_:36 \n  *OR:* _.aitts i am " + _0x33c126.pushName + "_:asta     \n\n\n  " + caption).trim()
      }, {
        messageId: _0x33c126.bot.messageId()
      });
    }
    let _0x19e7c5 = _0x2b48e0;
    var _0x30713a = 0 || Math.floor(Math.random() * _0x1afcdb.length);
    let _0x53e63c = false;
    if (!isNaN(_0x1cf518) && _0x1cf518 > 0 && _0x1cf518 < 39) {
      _0x53e63c = true;
      _0x30713a = _0x1cf518;
    }
    if (_0x2b48e0 && _0x2b48e0.includes(":")) {
      let _0x1e4230 = _0x2b48e0.split(":");
      let _0x2d4089 = _0x1e4230[_0x1e4230.length - 1].trim() || "";
      _0x19e7c5 = _0x1e4230.slice(0, _0x1e4230.length - 1).join(":");
      if (_0x2d4089.toLowerCase() === "richel" || _0x2d4089 === "1") {
        _0x30713a = 0;
      } else if (_0x2d4089.toLowerCase() === "clyde" || _0x2d4089 === "2") {
        _0x30713a = 1;
      } else if (_0x2d4089.toLowerCase() === "domi" || _0x2d4089 === "3") {
        _0x30713a = 2;
      } else if (_0x2d4089.toLowerCase() === "dave" || _0x2d4089 === "4") {
        _0x30713a = 3;
      } else if (_0x2d4089.toLowerCase() === "fin" || _0x2d4089 === "5") {
        _0x30713a = 4;
      } else if (_0x2d4089.toLowerCase() === "bella" || _0x2d4089 === "6") {
        _0x30713a = 5;
      } else if (_0x2d4089.toLowerCase() === "antoni" || _0x2d4089 === "7") {
        _0x30713a = 6;
      } else if (_0x2d4089.toLowerCase() === "thomas" || _0x2d4089 === "8") {
        _0x30713a = 7;
      } else if (_0x2d4089.toLowerCase() === "charlie" || _0x2d4089 === "9") {
        _0x30713a = 8;
      } else if (_0x2d4089.toLowerCase() === "emily" || _0x2d4089 === "10") {
        _0x30713a = 9;
      } else if (_0x2d4089.toLowerCase() === "elli" || _0x2d4089 === "11") {
        _0x30713a = 10;
      } else if (_0x2d4089.toLowerCase() === "callum" || _0x2d4089 === "12") {
        _0x30713a = 11;
      } else if (_0x2d4089.toLowerCase() === "patrick" || _0x2d4089 === "13") {
        _0x30713a = 12;
      } else if (_0x2d4089.toLowerCase() === "harry" || _0x2d4089 === "14") {
        _0x30713a = 13;
      } else if (_0x2d4089.toLowerCase() === "liam" || _0x2d4089 === "15") {
        _0x30713a = 14;
      } else if (_0x2d4089.toLowerCase() === "dorothy" || _0x2d4089 === "16") {
        _0x30713a = 15;
      } else if (_0x2d4089.toLowerCase() === "josh" || _0x2d4089 === "17") {
        _0x30713a = 16;
      } else if (_0x2d4089.toLowerCase() === "arnold" || _0x2d4089 === "18") {
        _0x30713a = 17;
      } else if (_0x2d4089.toLowerCase() === "charlotte" || _0x2d4089 === "19") {
        _0x30713a = 18;
      } else if (_0x2d4089.toLowerCase() === "matilda" || _0x2d4089 === "20") {
        _0x30713a = 19;
      } else if (_0x2d4089.toLowerCase() === "matthew" || _0x2d4089 === "21") {
        _0x30713a = 20;
      } else if (_0x2d4089.toLowerCase() === "james" || _0x2d4089 === "22") {
        _0x30713a = 21;
      } else if (_0x2d4089.toLowerCase() === "joseph" || _0x2d4089 === "23") {
        _0x30713a = 22;
      } else if (_0x2d4089.toLowerCase() === "jeremy" || _0x2d4089 === "24") {
        _0x30713a = 23;
      } else if (_0x2d4089.toLowerCase() === "michael" || _0x2d4089 === "25") {
        _0x30713a = 24;
      } else if (_0x2d4089.toLowerCase() === "ethan" || _0x2d4089 === "26") {
        _0x30713a = 25;
      } else if (_0x2d4089.toLowerCase() === "gigi" || _0x2d4089 === "27") {
        _0x30713a = 26;
      } else if (_0x2d4089.toLowerCase() === "freya" || _0x2d4089 === "28") {
        _0x30713a = 27;
      } else if (_0x2d4089.toLowerCase() === "grace" || _0x2d4089 === "29") {
        _0x30713a = 28;
      } else if (_0x2d4089.toLowerCase() === "daniel" || _0x2d4089 === "30") {
        _0x30713a = 29;
      } else if (_0x2d4089.toLowerCase() === "serena" || _0x2d4089 === "31") {
        _0x30713a = 30;
      } else if (_0x2d4089.toLowerCase() === "adam" || _0x2d4089 === "32") {
        _0x30713a = 31;
      } else if (_0x2d4089.toLowerCase() === "nicole" || _0x2d4089 === "33") {
        _0x30713a = 32;
      } else if (_0x2d4089.toLowerCase() === "jessie" || _0x2d4089 === "34") {
        _0x30713a = 33;
      } else if (_0x2d4089.toLowerCase() === "ryan" || _0x2d4089 === "35") {
        _0x30713a = 34;
      } else if (_0x2d4089.toLowerCase() === "asta" || _0x2d4089 === "36") {
        _0x30713a = 35;
      } else if (_0x2d4089.toLowerCase() === "glinda" || _0x2d4089 === "37") {
        _0x30713a = 36;
      } else if (_0x2d4089.toLowerCase() === "giovanni" || _0x2d4089 === "38") {
        _0x30713a = 37;
      } else if (_0x2d4089.toLowerCase() === "mimi" || _0x2d4089 === "39") {
        _0x30713a = 38;
      } else {
        _0x19e7c5 = _0x2b48e0;
        _0x30713a = _0x30713a;
      }
    }
    const _0x36112b = {
      method: "POST",
      url: "https://api.elevenlabs.io/v1/text-to-speech/" + _0x1afcdb[_0x30713a],
      headers: {
        accept: "audio/mpeg",
        "content-type": "application/json",
        "xi-api-key": "" + ELEVENLAB_API_KEY
      },
      data: {
        text: _0x19e7c5
      },
      responseType: "arraybuffer"
    };
    const {
      data: _0x43f81b
    } = await axios.request(_0x36112b);
    if (!_0x43f81b) {
      return await _0x33c126.send("*_Request not be proceed!_*");
    }
    await _0x33c126.sendMessage(_0x33c126.from, {
      audio: _0x43f81b,
      mimetype: "audio/mpeg",
      ptt: true
    }, {
      quoted: _0x33c126,
      messageId: _0x33c126.bot.messageId()
    });
  } catch (_0x54e32c) {
    if (_0x30230a) {
      await _0x33c126.error(_0x54e32c + "\n\ncommand: aitts", _0x54e32c);
    }
  }
}
let setMention = {
  mention: false
};
setMention.status = async (_0x280219, _0x510e3f = false) => {
  try {
    setMention.mention = false;
    let _0x375d7b = (await bot_.findOne({
      id: "bot_" + _0x280219.user
    })) || (await bot_.new({
      id: "bot_" + _0x280219.user
    }));
    let _0x297ec2 = _0x375d7b.mention || {};
    if (_0x510e3f) {
      if (_0x297ec2.status) {
        return await _0x280219.reply("_Mention Already Enabled!_");
      }
      _0x297ec2.status = true;
      await bot_.updateOne({
        id: "bot_" + _0x280219.user
      }, {
        mention: _0x297ec2
      });
      return await _0x280219.reply("_Mention Enabled!_");
    } else {
      if (!_0x297ec2.status) {
        return await _0x280219.reply("_Mention Already Disabled!_");
      }
      _0x297ec2.status = false;
      await bot_.updateOne({
        id: "bot_" + _0x280219.user
      }, {
        mention: _0x297ec2
      });
      return await _0x280219.reply("_Mention Disabled!_");
    }
  } catch (_0x18fc74) {
    _0x280219.error(_0x18fc74 + "\n\nCommand: mention", _0x18fc74, false);
  }
};
setMention.get = async _0x2cdc1a => {
  try {
    let _0x18ceaf = (await bot_.findOne({
      id: "bot_" + _0x2cdc1a.user
    })) || (await bot_.new({
      id: "bot_" + _0x2cdc1a.user
    }));
    let _0x584f1d = _0x18ceaf.mention || {};
    if (_0x584f1d.get) {
      return await _0x2cdc1a.reply("*Status :* " + (_0x584f1d.status ? "ON" : "OFF") + "\nUse on/off/get/test to enable and disable mention\n\n*Mention Info:* " + _0x584f1d.get);
    } else {
      return await _0x2cdc1a.reply("*You did'nt set mention message yet!*\n*please Check: https://github.com/SuhailTechInfo/Suhail-Md/wiki/mention*");
    }
  } catch (_0x4535a8) {
    _0x2cdc1a.error(_0x4535a8 + "\n\nCommand: mention", _0x4535a8, false);
  }
};
setMention.typesArray = _0x59ae98 => {
  try {
    const _0x55b13f = _0x59ae98.split("\n");
    let _0x4656bb = {
      text: []
    };
    let _0x22e9cc = ["gif", "video", "audio", "image", "sticker"];
    let _0xef10c6 = null;
    for (const _0x55bb42 of _0x55b13f) {
      const _0x1cf682 = _0x55bb42.split(" ");
      if (_0x1cf682.length >= 1) {
        const _0x243ab6 = _0x1cf682.findIndex(_0x75df3c => _0x75df3c.startsWith("type/"));
        if (_0x243ab6 !== -1) {
          _0xef10c6 = _0x1cf682[_0x243ab6].slice(5).toLowerCase();
          let _0x192321 = /asta|smd|message|chat/gi.test(_0xef10c6);
          if (!_0x4656bb[_0x192321 ? "asta" : _0xef10c6]) {
            _0x4656bb[_0x192321 ? "asta" : _0xef10c6] = [];
          }
        }
        const _0x26ebaf = _0x1cf682.filter(_0x1fa91c => _0x1fa91c !== "type/" + _0xef10c6 && _0x1fa91c !== "");
        _0xef10c6 = /asta|smd|message|chat/gi.test(_0xef10c6) ? "asta" : _0xef10c6;
        if (_0x26ebaf.length > 0) {
          if (_0x22e9cc.includes(_0xef10c6)) {
            _0x26ebaf.forEach(_0x23a80a => {
              if (/http/gi.test(_0x23a80a)) {
                _0x4656bb[_0xef10c6].push(_0x23a80a);
              }
            });
          } else if (/react/gi.test(_0xef10c6)) {
            _0x4656bb.react.push(..._0x26ebaf);
          } else {
            _0x4656bb[/asta/gi.test(_0xef10c6) ? "asta" : "text"].push(_0x26ebaf.join(" "));
          }
        }
      }
      _0xef10c6 = null;
    }
    return _0x4656bb || {};
  } catch (_0x5bc7dd) {
    console.log("Error in Mention typesArray\n", _0x5bc7dd);
  }
};
setMention.update = async (_0x526d31, _0x1520b5) => {
  try {
    setMention.mention = false;
    let _0x50fd1f = {
      status: true,
      get: _0x1520b5
    };
    try {
      const _0xb9ae11 = _0x1520b5.match(/\{.*\}/);
      if (_0xb9ae11) {
        const _0x557b75 = _0xb9ae11[0];
        const _0x3b2aa4 = JSON.parse(_0x557b75);
        _0x50fd1f.json = _0x3b2aa4;
        _0x1520b5 = _0x1520b5.replace(/\{.*\}/, "");
      }
    } catch (_0x45cb06) {
      console.log("ERROR mention JSON parse", _0x45cb06);
    }
    _0x50fd1f.text = _0x1520b5;
    _0x50fd1f.type = setMention.typesArray(_0x1520b5) || {};
    await bot_.updateOne({
      id: "bot_" + _0x526d31.user
    }, {
      mention: _0x50fd1f
    });
    return await _0x526d31.send("*Mention updated!*", {
      mentios: [_0x526d31.user]
    });
  } catch (_0x1235b9) {
    _0x526d31.error(_0x1235b9 + "\n\nCommand: mention", _0x1235b9, false);
  }
};
setMention.cmd = async (_0x501ec5, _0x2a1c43 = "") => {
  try {
    let _0x22516b = setMention.mention || false;
    if (!_0x22516b) {
      let _0x380929 = (await bot_.findOne({
        id: "bot_" + _0x501ec5.user
      })) || (await bot_.new({
        id: "bot_" + _0x501ec5.user
      }));
      _0x22516b = _0x380929.mention || false;
      setMention.mention = _0x22516b;
    }
    if (global.OfficialRepo !== "yes") {
      return;
    }
    if (_0x2a1c43 === "get" || _0x2a1c43 === "info" || !_0x2a1c43 && _0x22516b.status && _0x22516b.get) {
      setMention.get(_0x501ec5);
    } else if (!_0x2a1c43) {
      _0x501ec5.reply("_Read wiki to set mention message https://github.com/SuhailTechInfo/Suhail-Md/wiki/mention_", {}, "smd");
    } else if (["off", "deact", "disable", "false"].includes(_0x2a1c43.toLowerCase() || _0x2a1c43)) {
      setMention.status(_0x501ec5, false);
    } else if (["on", "act", "enable", "true", "active"].includes(_0x2a1c43.toLowerCase() || _0x2a1c43)) {
      setMention.status(_0x501ec5, true);
    } else if (["check", "test", "me"].includes(_0x2a1c43.toLowerCase() || _0x2a1c43)) {
      setMention.check(_0x501ec5, _0x2a1c43, true);
    } else {
      setMention.update(_0x501ec5, _0x2a1c43);
    }
  } catch (_0x278867) {
    console.log("ERROR IN MENTION CMD \n ", _0x278867);
  }
};
setMention.randome = _0x464e51 => {
  try {
    const _0x47aeca = Object.keys(_0x464e51 || {});
    if (_0x47aeca.length > 1) {
      const _0x2589e6 = _0x47aeca[Math.floor(Math.random() * (_0x47aeca.length - 1)) + 1];
      const _0x3755b9 = _0x464e51[_0x2589e6];
      if (_0x3755b9 && _0x3755b9.length > 0) {
        const _0x281c61 = Math.floor(Math.random() * _0x3755b9.length);
        return {
          type: _0x2589e6,
          url: _0x3755b9[_0x281c61]
        };
      }
    }
    if (_0x464e51 && _0x464e51.text) {
      return {
        url: _0x464e51.text.join(" ") || "",
        type: "smd"
      };
    } else {
      return undefined;
    }
  } catch (_0x21a02a) {
    console.log(_0x21a02a);
  }
};
global.creator = process.env.CREATOR || true;
setMention.check = async (_0x373988, _0x3c756b = "", _0xde3e80 = false) => {
  try {
    const _0x313fc4 = _0xde3e80 || _0x373988.mentionedJid.includes(_0x373988.user) || _0x3c756b.includes("@" + _0x373988.user.split("@")[0]) || global.creator && (_0x373988.mentionedJid.includes("@2348039607375@s.whatsapp.net") || _0x373988.mentionedJid.includes("@2349027862116@s.whatsapp.net") || /@2348039607375|@2349027862116/g.test(_0x3c756b));
    if (_0x313fc4) {
      if (global.OfficialRepo !== "yes") {
        return;
      }
      let _0x5f58a2 = setMention.mention || false;
      if (!_0x5f58a2) {
        let _0x30a79a = (await bot_.findOne({
          id: "bot_" + _0x373988.user
        })) || (await bot_.new({
          id: "bot_" + _0x373988.user
        }));
        _0x5f58a2 = _0x30a79a.mention || false;
        setMention.mention = _0x5f58a2;
      }
      if (typeof _0x5f58a2 !== "object" || !_0x5f58a2 || !_0x5f58a2.status) {
        return;
      }
      const _0x4f16eb = setMention.randome(_0x5f58a2.type);
      if (_0x4f16eb) {
        let _0x4a0e2b = _0x4f16eb.type;
        const _0x445c8c = {};
        if (_0x4f16eb.type === "gif") {
          _0x4a0e2b = "video";
          _0x445c8c = {
            gifPlayback: true
          };
        }
        try {
          const _0x24fb8e = {
            ..._0x5f58a2.json,
            ..._0x445c8c
          };
          if (_0x24fb8e.contextInfo && _0x24fb8e.contextInfo.externalAdReply && _0x24fb8e.contextInfo.externalAdReply.thumbnail) {
            _0x24fb8e.contextInfo.externalAdReply.thumbnail = (await getBuffer(_0x24fb8e.contextInfo.externalAdReply.thumbnail)) || log0;
          }
          await _0x373988.send(_0x4f16eb.url, _0x24fb8e, _0x4a0e2b, _0x373988);
        } catch (_0x37d7fa) {
          console.log("Error Sending ContextInfo in mention ", _0x37d7fa);
          try {
            _0x373988.send(_0x4f16eb.url, {
              ..._0x445c8c
            }, _0x4a0e2b, _0x373988);
          } catch (_0x112900) {}
        }
      }
    }
  } catch (_0x20c76e) {
    console.log("Error in Mention Check\n", _0x20c76e);
  }
};
let mention = setMention;
let setFilter = {
  filter: false
};
setFilter.set = async (_0x7cffc5, _0x172f0c = "") => {
  try {
    if (!_0x172f0c) {
      return _0x7cffc5.send("*Use " + prefix + "filter word:reply_text!*");
    }
    let [_0x27ba2d, _0x116d5b] = _0x172f0c.split(":").map(_0x40b25d => _0x40b25d.trim());
    if (!_0x27ba2d || !_0x116d5b) {
      return _0x7cffc5.send("*Use " + prefix + "filter " + (_0x27ba2d || "word") + ": " + (_0x116d5b || "reply_text") + "!*");
    }
    let _0x17fc2c = (await bot_.findOne({
      id: "bot_" + _0x7cffc5.user
    })) || (await bot_.new({
      id: "bot_" + _0x7cffc5.user
    }));
    let _0x5dd7ac = _0x17fc2c.filter || {};
    _0x5dd7ac[_0x27ba2d] = _0x116d5b;
    setFilter.filter = _0x5dd7ac;
    let _0x24a4a0 = await bot_.updateOne({
      id: "bot_" + _0x7cffc5.user
    }, {
      filter: _0x5dd7ac
    });
    _0x7cffc5.send("*Successfully set filter to '" + _0x27ba2d + "'!*");
  } catch (_0x152f1f) {
    _0x7cffc5.error(_0x152f1f + "\n\nCommand:filter", _0x152f1f, "_Can't set filter!_");
  }
};
setFilter.stop = async (_0x103724, _0xc4e239 = "") => {
  try {
    if (!_0xc4e239) {
      return _0x103724.send("*Provide a word that set in filter!*\n*Use " + prefix + "flist to get list of filtered words!*");
    }
    let _0xc0b98a = (await bot_.findOne({
      id: "bot_" + _0x103724.user
    })) || (await bot_.new({
      id: "bot_" + _0x103724.user
    }));
    let _0x23f901 = _0xc0b98a.filter || {};
    if (!_0x23f901[_0xc4e239]) {
      return _0x103724.reply("*Given Word ('" + _0xc4e239 + "') not set to any filter!*");
    }
    delete _0x23f901[_0xc4e239];
    setFilter.filter = _0x23f901;
    await bot_.updateOne({
      id: "bot_" + _0x103724.user
    }, {
      filter: _0x23f901
    });
    _0x103724.reply("*_Filter word '" + _0xc4e239 + "' deleted!_*");
  } catch (_0x153068) {
    _0x103724.error(_0x153068 + "\n\nCommand:fstop", _0x153068, "*Can't delete filter!*");
  }
};
setFilter.list = async (_0xdb3bd0, _0x43f090 = "") => {
  try {
    let _0xda9bc2 = (await bot_.findOne({
      id: "bot_" + _0xdb3bd0.user
    })) || (await bot_.new({
      id: "bot_" + _0xdb3bd0.user
    }));
    let _0x31a8d4 = _0xda9bc2.filter || {};
    let _0x55d089 = Object.entries(_0x31a8d4).map(([_0x3b1bef, _0x597ecb]) => _0x3b1bef + " : " + _0x597ecb).join("\n");
    if (_0xda9bc2.filter && _0x55d089) {
      _0xdb3bd0.reply("*[LIST OF FILTERED WORDS]*\n\n" + _0x55d089);
    } else {
      _0xdb3bd0.reply("*_You didn't set any filter!_*");
    }
  } catch (_0x213cc9) {
    _0xdb3bd0.error(_0x213cc9 + "\n\nCommand:flist", _0x213cc9, false);
  }
};
setFilter.check = async (_0x26e5fd, _0x1061b1 = "") => {
  try {
    let _0x148446 = setFilter.filter || false;
    if (!_0x148446) {
      let _0x577104 = (await bot_.findOne({
        id: "bot_" + _0x26e5fd.user
      })) || (await bot_.new({
        id: "bot_" + _0x26e5fd.user
      }));
      _0x148446 = _0x577104.filter || {};
      setFilter.filter = _0x577104.filter || {};
    }
    if (_0x148446[_0x1061b1]) {
      _0x26e5fd.reply(_0x148446[_0x1061b1], {}, "smd", _0x26e5fd);
    }
  } catch (_0x5ce3b) {
    console.log(_0x5ce3b);
  }
};
let filter = setFilter;
module.exports = {
  yt: yt,
  sendAnimeReaction: sendAnimeReaction,
  sendGImages: sendGImages,
  AudioToBlackVideo: AudioToBlackVideo,
  textToLogoGenerator: textToLogoGenerator,
  photoEditor: photoEditor,
  updateProfilePicture: updateProfilePicture,
  getRandomFunFact: getRandomFunFact,
  plugins: plugins,
  getRandom: getRandom,
  generateSticker: generateSticker,
  forwardMessage: forwardMessage,
  audioEditor: audioEditor,
  send: send,
  react: react,
  note: note,
  sendWelcome: sendWelcome,
  aitts: aitts,
  mention: mention,
  filter: filter
};