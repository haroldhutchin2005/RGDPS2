const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "geomods",
    version: "1.1.2",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Fetch information from geodemods API",
    usePrefix: false,
    commandCategory: "RGDPS",
    usages: "search",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const search = args.join(" ");

    if (!search) {
        return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝗉𝖾𝖼𝗂𝖿𝗒 𝗍𝗁𝖾 𝗆𝗈𝖽 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗌𝖾𝖺𝗋𝖼𝗁 𝖿𝗈𝗋.", threadID, messageID);
    }

    const waitMessage = await api.sendMessage("🔍 | 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖦𝖾𝗈𝖽𝖾 𝖬𝗈𝖽𝗌 𝖱𝖾𝗌𝗎𝗅𝗍 𝖯𝗅𝖾𝖺𝗌𝖾 𝖶𝖺𝗂𝗍..", threadID);

    try {
        const apiUrl = `https://geode-api-by-jonell-magallanes.onrender.com/geode?mods=${encodeURIComponent(search)}`;
        const response = await axios.get(apiUrl);
        const responseData = response.data;
      
api.unsendMessage(waitMessage.messageID);
      
        if (!responseData || !responseData.length) {
            return api.sendMessage("𝖭𝗈 𝗋𝖾𝗌𝗎𝗅𝗍𝗌 𝖿𝗈𝗎𝗇𝖽.", threadID, messageID);
        }

        if (responseData.length === 1) {
            const mod = responseData[0];
            const imagePath = path.join(__dirname, `./${mod.name}.jpg`);
            const writer = fs.createWriteStream(imagePath);
            const imageResponse = await axios.get(mod.imageUrl, { responseType: 'stream' });
            imageResponse.data.pipe(writer);

            writer.on('finish', () => {
                const message = {
                    body: `𝖤𝗑𝖺𝖼𝗍 𝖱𝖾𝗌𝗎𝗅𝗍 𝖦𝖾𝗈𝖽𝖾 𝖬𝗈𝖽𝗌\n\n𝖭𝖺𝗆𝖾: ${mod.name}\n𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋: ${mod.developer}\n𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇: ${mod.description}\nVersion: ${mod.version}\n\n𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽 𝖦𝖾𝗈𝖽𝖾:\nhttps://geode-sdk.org/`,
                    mentions: [{
                        tag: mod.developer,
                        id: mod.developer
                    }],
                    attachment: fs.createReadStream(imagePath)
                };
                api.sendMessage(message, threadID, () => fs.unlinkSync(imagePath));
            });

            return;
        }

        const messageArray = responseData.map(mod => {
            return `𝖭𝖺𝗆𝖾: ${mod.name}\n𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋: ${mod.developer}\n𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇: ${mod.description}\n𝖵𝖾𝗋𝗌𝗂𝗈𝗇: ${mod.version}\n\n`;
        });

        const finalMessage = {
            body: "𝖱𝖾𝗌𝗎𝗅𝗍𝗌 𝖫𝗂𝗌𝗍 𝖮𝖿 𝖦𝖾𝗈𝖽𝖾 𝖬𝗈𝖽𝗌:\n\n" + messageArray.join("\n"),
            mentions: responseData.map(mod => ({
                tag: mod.developer,
                id: mod.developer
            }))
        };

        return api.sendMessage(finalMessage, threadID, messageID);
      

    } catch (error) {
        console.error(error);
        return api.sendMessage("𝖬𝖺𝗂𝗇 𝖺𝗉𝗂 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖤𝗋𝗋𝗈𝗋 𝖯𝗅𝖾𝖺𝗌𝖾 𝖢𝗈𝗇𝗍𝖺𝖼𝗍 𝗍𝗁𝖾 𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋 𝖩𝗈𝗇𝖾𝗅𝗅 𝖬𝖺𝗀𝖺𝗅𝗅𝖺𝗇𝖾𝗌 😕", threadID, messageID);
    }
};
