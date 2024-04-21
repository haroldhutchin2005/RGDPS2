module.exports.config = {
  name: "music",
  version: "2.0.6",
  hasPermission: 0,
  credits: "Grey",
  description: "Play a song",
  commandCategory: "utility",
  usages: "[title]",
  usePrefix: true,
  cooldowns: 40,
  dependencies: {
    "fs-extra": "",
    "request": "",
    "axios": "",
    "ytdl-core": "",
    "yt-search": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const ytdl = require("ytdl-core");
  const request = require("request");
  const yts = require("yt-search");

  const input = event.body;
  const text = input.substring(12);
  const data = input.split(" ");

  if (data.length < 2) {
    return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝖾𝗇𝗍𝖾𝗋 𝗍𝗁𝖾 𝗆𝗎𝗌𝗂𝖼 𝗍𝗂𝗍𝗅𝖾", event.threadID);
  }

  data.shift();
  const song = data.join(" ");

  try {
    const findingMessage = await api.sendMessage(`𝖥𝗂𝗇𝖽𝗂𝗇𝗀 "${song}". 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...`, event.threadID);

    const searchResults = await yts(song);
    if (!searchResults.videos.length) {
      await api.unsendMessage(findingMessage.messageID);
      return api.sendMessage("Error: Invalid request.", event.threadID);
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const stream = ytdl(videoUrl, { filter: "audioonly" });

    const fileName = `${event.senderID}.mp3`;
    const filePath = __dirname + `/cache/${fileName}`;

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', async () => {
      console.info('[DOWNLOADER]', 'Starting download now!');

      const tinyUrlResponse = await axios.get(`https://jonellccapisprojectv2-a62001f39859.herokuapp.com/api/tinyurl?url=${videoUrl}`);
      const shortenedUrl = tinyUrlResponse.data.shortenedUrl;

      const messageBody = `𝖧𝖾𝗋𝖾'𝗌 𝗒𝗈𝗎𝗋 𝗆𝗎𝗌𝗂𝖼, 𝖾𝗇𝗃𝗈𝗒!\n𝖠𝗋𝗍𝗂𝗌𝗍: ${video.author.name}\n𝖸𝗈𝗎𝗍𝗎𝖻𝖾 𝖫𝗂𝗇𝗄: ${videoUrl}`;

      const message = {
        body: messageBody,
        attachment: fs.createReadStream(filePath)
      };

      api.sendMessage(message, event.threadID);
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      console.info('[DOWNLOADER] Downloaded');

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage('[ERR] The file could not be sent because it is larger than 25MB.', event.threadID);
      }

      api.unsendMessage(findingMessage.messageID);
    });
  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage('An error occurred while processing the command.', event.threadID);
  }
};
