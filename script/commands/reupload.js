const axios = require('axios');

module.exports.config = {
    name: "addsong",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Reupload music from GDPH",
    usePrefix: false,
    commandCategory: "RGDPS",
    usages: "songlink | title",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const { body, threadID, messageID } = event;
    let link, title;

    if (event.type === "message_reply") {
        const replyMessage = event.messageReply.body;
        const youtubeMatch = replyMessage.match(/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/[^\s]+/);
        if (youtubeMatch) {
            link = youtubeMatch[0];
            title = args.join(" ").trim();
        } else {
            return api.sendMessage("❌ | 𝖳𝗁𝗂𝗌 𝖬𝗎𝗌𝗂𝖼 𝗒𝗈𝗎 𝗋𝖾𝗉𝗅𝗒 𝗁𝖺𝗌 𝗇𝗈 𝖼𝗈𝗇𝗍𝖺𝗂𝗇𝖾𝖽 𝖺 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝗅𝗂𝗇𝗄𝗌", threadID, messageID);
        }
    } else {
        [link, title] = args.join(" ").split("|").map(arg => arg.trim());
    }

    if (!link) {
        return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗌𝗈𝗇𝗀 𝗅𝗂𝗇𝗄 𝖺𝗇𝖽 𝗍𝗂𝗍𝗅𝖾.\n\n𝖴𝗌𝖺𝗀𝖾: 𝖺𝖽𝖽𝗌𝗈𝗇𝗀 𝗌𝗈𝗇𝗀𝗅𝗂𝗇𝗄 | 𝖳𝗂𝗍𝗅𝖾 𝗈𝖿 𝖬𝗎𝗌𝗂𝖼", threadID, messageID);
    }

    const waitMessage = await api.sendMessage("☁️ | 𝖱𝖾𝗎𝗉𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗍𝗁𝖾 𝖬𝗎𝗌𝗂𝖼 𝖯𝗅𝖾𝖺𝗌𝖾 𝖶𝖺𝗂𝗍..", threadID);

    try {
        let uploadData;

        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

        if (youtubeRegex.test(link)) {
            const axiosUrl = `https://reuploadgdph-0816871a3a93.herokuapp.com/api/upload?link=${encodeURIComponent(link)}`;
            const uploadResponse = await axios.get(axiosUrl);
            uploadData = uploadResponse.data;

            if (!uploadData.src) {
                return api.editMessage("Failed to get src from the API.", waitMessage.messageID, threadID);
            }

            title = uploadData.src;
            link = `https://reuploadgdph-0816871a3a93.herokuapp.com/files?src=${encodeURIComponent(title)}`;
        }

        const apiUrl = `https://johnrickgdp.ps.fhgdps.com/dashboard/api/addSong.php?download=${encodeURIComponent(link)}&author=RGDPSCCMUSIC&name=${encodeURIComponent(title)}`;

        const response = await axios.get(apiUrl);
        const responseData = response.data;

        if (!responseData.success) {
            if (responseData.error === 4) {
                return api.editMessage(responseData.message, waitMessage.messageID, threadID);
            } else if (responseData.error === 3) {
                return api.editMessage(responseData.message, waitMessage.messageID, threadID);
            } else {
                return api.editMessage("An error occurred while processing your request.", waitMessage.messageID, threadID);
            }
        }

        const { song } = responseData;
        const { ID, reuploader } = song;
        const { username } = reuploader;

        const message = `✅ | 𝖱𝖾-𝗎𝗉𝗅𝗈𝖺𝖽𝖾𝖽 𝖬𝗎𝗌𝗂𝖼 𝖱𝖦𝖣𝖯𝖲\n\n𝖨𝖣: ${ID}\n𝖭𝖺𝗆𝖾: ${title}`;

        api.editMessage(message, waitMessage.messageID, threadID);
    } catch (error) {
        console.error(error);
        api.editMessage("𝖬𝖺𝗂𝗇 𝖠𝗉𝗂 𝗂𝗌 𝖤𝗋𝗋𝗈𝗋", waitMessage.messageID, threadID);
    }
};
