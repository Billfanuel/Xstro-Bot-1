const ffmpeg = require("fluent-ffmpeg");
const { randomBytes } = require("crypto");
const fs = require("fs");
const { getHttpStream, toBuffer } = require("@whiskeysockets/baileys");
const sharp = require("sharp");
const { spawn } = require("child_process");
const path = require("path");
const { fromBuffer } = require("file-type");
const { tmpdir } = require("os");
const webp = require("node-webpmux");

async function toGif(buffer) {
  try {
    const webpPath = `./${randomBytes(3).toString("hex")}.webp`;
    const gifPath = `./${randomBytes(3).toString("hex")}.gif`;
    fs.writeFileSync(webpPath, buffer.toString("binary"), "binary");
    
    const outputPath = await new Promise((resolve) => {
      spawn("convert", [webpPath, gifPath])
        .on("error", (error) => { throw error; })
        .on("exit", () => resolve(gifPath));
    });
    
    const gifBuffer = fs.readFileSync(outputPath);
    fs.unlinkSync(webpPath);
    fs.unlinkSync(gifPath);
    return gifBuffer;
  } catch (error) {
    console.log(error);
  }
}

async function toMp4(input) {
  try {
    const gifPath = `./${randomBytes(3).toString("hex")}.gif`;
    const inputPath = fs.existsSync(input) ? input : save(input, gifPath);
    const mp4Path = `./${randomBytes(3).toString("hex")}.mp4`;
    
    const outputPath = await new Promise((resolve) => {
      ffmpeg(inputPath)
        .outputOptions([
          "-pix_fmt yuv420p",
          "-c:v libx264",
          "-movflags +faststart",
          "-filter:v crop='floor(in_w/2)*2:floor(in_h/2)*2'"
        ])
        .toFormat("mp4")
        .noAudio()
        .save(mp4Path)
        .on("exit", () => resolve(mp4Path));
    });
    
    const mp4Buffer = await fs.promises.readFile(outputPath);
    fs.unlinkSync(inputPath);
    fs.unlinkSync(mp4Path);
    return mp4Buffer;
  } catch (error) {
    console.log(error);
  }
}

const EightD = async (input) => {
  const inputPath = `./temp/${randomBytes(3).toString("hex")}.mp3`;
  const actualInput = Buffer.isBuffer(input) ? save(input, inputPath) : input;
  const outputPath = `./temp/${randomBytes(3).toString("hex")}.mp3`;
  
  const processedPath = await new Promise((resolve) => {
    ffmpeg(actualInput)
      .audioFilter(["apulsator=hz=0.125"])
      .audioFrequency(44100)
      .audioChannels(2)
      .audioBitrate("128k")
      .audioCodec("libmp3lame")
      .audioQuality(5)
      .toFormat("mp3")
      .save(outputPath)
      .on("end", () => resolve(outputPath));
  });
  
  return processedPath;
};

function save(buffer, filePath = "./temp/saveFile.jpg") {
  try {
    fs.writeFileSync(filePath, buffer.toString("binary"), "binary");
    return filePath;
  } catch (error) {
    console.log(error);
  }
}

const resizeImage = (buffer, width, height) => {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error("Input is not a Buffer");
  }
  return sharp(buffer).resize(width, height, { fit: "contain" }).toBuffer();
};

const _parseInput = async (input, extension = false, outputType = "path") => {
  const buffer = await toBuffer(await getHttpStream(input));
  const filePath = `./temp/file_${randomBytes(3).toString("hex")}.${extension || (await fromBuffer(buffer)).ext}`;
  const actualPath = Buffer.isBuffer(input) ? save(input, filePath) : fs.existsSync(input) ? input : input;
  
  if (outputType === "path") {
    return actualPath;
  } else if (outputType === "buffer") {
    const fileBuffer = await fs.promises.readFile(actualPath);
    try {
      await fs.promises.unlink(actualPath);
    } catch (error) {}
    return fileBuffer;
  }
};

async function imageToWebp(buffer) {
  const webpPath = path.join(tmpdir(), `${randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
  const jpgPath = path.join(tmpdir(), `${randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`);
  fs.writeFileSync(jpgPath, buffer);
  
  await new Promise((resolve, reject) => {
    ffmpeg(jpgPath)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([
        "-vcodec", "libwebp",
        "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
      ])
      .toFormat("webp")
      .save(webpPath);
  });
  
  const webpBuffer = fs.readFileSync(webpPath);
  fs.unlinkSync(webpPath);
  fs.unlinkSync(jpgPath);
  return webpBuffer;
}

async function videoToWebp(buffer) {
  const webpPath = path.join(tmpdir(), `${randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
  const mp4Path = path.join(tmpdir(), `${randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`);
  fs.writeFileSync(mp4Path, buffer);
  
  await new Promise((resolve, reject) => {
    ffmpeg(mp4Path)
      .on("error", reject)
      .on("end", () => resolve(true))
      .addOutputOptions([
        "-vcodec", "libwebp",
        "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
        "-loop", "0",
        "-ss", "00:00:00",
        "-t", "00:00:05",
        "-preset", "default",
        "-an",
        "-vsync", "0"
      ])
      .toFormat("webp")
      .save(webpPath);
  });
  
  const webpBuffer = fs.readFileSync(webpPath);
  fs.unlinkSync(webpPath);
  fs.unlinkSync(mp4Path);
  return webpBuffer;
}

async function writeExif(buffer, options, type) {
  const webpBuffer = type === "img" ? await imageToWebp(buffer) : type === "vid" ? await videoToWebp(buffer) : buffer;
  const tempPath = path.join(tmpdir(), `${randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
  const outputPath = path.join(tmpdir(), `${randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`);
  fs.writeFileSync(tempPath, webpBuffer);
  
  if (options.packname || options.author) {
    const img = new webp.Image();
    const json = {
      "sticker-pack-id": "Asta-Md",
      "sticker-pack-name": options.packname,
      "sticker-pack-publisher": options.author,
      "emojis": options.categories ? options.categories : [""]
    };
    const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
    const jsonBuffer = Buffer.from(JSON.stringify(json), "utf-8");
    const exif = Buffer.concat([exifAttr, jsonBuffer]);
    exif.writeUIntLE(jsonBuffer.length, 14, 4);
    await img.load(tempPath);
    fs.unlinkSync(tempPath);
    img.exif = exif;
    await img.save(outputPath);
    return outputPath;
  }
}

module.exports = {
  imageToWebp,
  videoToWebp,
  writeExifImg: (buffer, options) => writeExif(buffer, options, "img"),
  writeExifVid: (buffer, options) => writeExif(buffer, options, "vid"),
  writeExifWebp: (buffer, options) => writeExif(buffer, options, "webp"),
  toGif,
  toMp4,
  EightD,
  _parseInput,
  resizeImage
};