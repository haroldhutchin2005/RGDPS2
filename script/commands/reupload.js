const axios = require('axios');

module.exports.config = {
    name: "addsong",
    version: "1.1.1",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Reupload music from GDPH",
    usePrefix: true,
    commandCategory: "RGDPS",
    usages: "songlink | title (optional)",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const { body, threadID, messageID } = event;
    let link, title;

    const tiktokRegex = /(https?:\/\/)?(vm\.tiktok\.com|vt\.tiktok\.com|www\.tiktok\.com)\/[^\s]+/;
    
    const youtubeMatch = body.match(/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/[^\s]+/);
    const tiktokMatch = body.match(tiktokRegex);
    
    if (youtubeMatch) {
        link = youtubeMatch[0];
        title = args.join(" ").trim() || "YouTube Music";
    } else if (tiktokMatch) {
        link = tiktokMatch[0];
        title = args.join(" ").trim() || "TikTok Music";
    } else {
        [link, title] = args.join(" ").split("|").map(arg => arg.trim());
        return api.sendMessage("❌ | 𝖳𝗁𝗂𝗌 𝖱𝖾𝗉𝗅𝗒 𝗁𝖺𝗌 𝗇𝗈 𝖼𝗈𝗇𝗍𝖺𝗂𝗇𝖾𝖽 𝖸𝗈𝗎𝗍𝗎𝖻𝖾 𝗅𝗂𝗇𝗄𝗌", threadID, messageID);
    }

    if (!link) {
        return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗌𝗈𝗇𝗀 𝗅𝗂𝗇𝗄 𝖺𝗇𝖽 𝗍𝗂𝗍𝗅𝖾.\n\n𝖴𝗌𝖺𝗀𝖾: 𝖺𝖽𝖽𝗌𝗈𝗇𝗀 𝗌𝗈𝗇𝗀𝗅𝗂𝗇𝗄 | 𝖳𝗂𝗍𝗅𝖾 𝗈𝖿 𝖬𝗎𝗌𝗂𝖼", threadID, messageID);
    }

    const waitMessage = await api.sendMessage("☁️ | 𝖱𝖾𝗎𝗉𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗍𝗁𝖾 𝖬𝗎𝗌𝗂𝖼 𝖯𝗅𝖾𝖺𝗌𝖾 𝖶𝖺𝗂𝗍..", threadID);

    try {
        const apiUrl = `https://reuploadmusicgdpsbyjonellapis-7701ddc59ff1.herokuapp.com/api/jonell?url=${encodeURIComponent(link)}`;

        const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const data = response.data.Successfully || response.data;

        const { src: songTitle, url: songLink } = data;

        const addSongUrl = `https://johnrickgdp.ps.fhgdps.com/dashboard/api/addSong.php?download=${encodeURIComponent(songLink)}&author=RGDPSCCMUSIC&name=${encodeURIComponent(title)}`;

        const addSongResponse = await axios.get(addSongUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const { success, song: { ID, name } } = addSongResponse.data;

        if (!success) {
            return api.editMessage("An error occurred while processing your request.", waitMessage.messageID, threadID);
        }

        const message = `✅ | 𝖱𝖾-𝗎𝗉𝗅𝗈𝖺𝖽𝖾𝖽 𝖬𝗎𝗌𝗂𝖼 𝖱𝖦𝖣𝖯𝖲\n\n𝖨𝖣: ${ID}\n𝖭𝖺𝗆𝖾: ${name}`;

        api.editMessage(message, waitMessage.messageID, threadID);
    } catch (error) {
        console.error(error);
        api.editMessage("𝖬𝖺𝗂𝗇 𝖠𝗉𝗂 𝗂𝗌 𝖤𝗋𝗋𝗈𝗋", waitMessage.messageID, threadID);
    }
};
