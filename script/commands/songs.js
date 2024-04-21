const axios = require('axios');

module.exports.config = {
    name: "searchsong",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Search music from RGDPS",
    usePrefix: false,
    commandCategory: "RGDPS",
    usages: "[searchsong]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const searchSong = encodeURIComponent(args.join(" ").trim());

    const apiUrl = `https://johnrickgdp.ps.fhgdps.com/dashboard/api/songs.php?search=${searchSong}`;

    if (!searchSong) {
        return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗌𝗈𝗇𝗀 𝗇𝖺𝗆𝖾 𝗍𝗈 𝗌𝖾𝖺𝗋𝖼𝗁 𝖿𝗈𝗋.\n\n𝖴𝗌𝖺𝗀𝖾: 𝗌𝖾𝖺𝗋𝖼𝗁𝗆𝗎𝗌𝗂𝖼 [𝗌𝖾𝖺𝗋𝖼𝗁𝗌𝗈𝗇𝗀]", event.threadID, event.messageID);
    }

    const waitMessage = await api.sendMessage("🔍 | 𝖢𝗁𝖾𝖼𝗄𝗂𝗇𝗀 𝖳𝗁𝖾 𝖣𝖺𝗍𝖺𝖻𝖺𝗌𝖾 𝖿𝗈𝗋 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖲𝗈𝗇𝗀𝗌 𝖴𝗉𝗅𝗈𝖺𝖽𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...", event.threadID);

    try {
        const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const responseData = response.data;

        if (responseData.dashboard && responseData.success) {
            const songs = responseData.songs;
            let message = `𝖱𝖦𝖣𝖯𝖲 𝖲𝗈𝗇𝗀 𝖱𝖾𝗌𝗎𝗅𝗍 𝖲𝖾𝖺𝗋𝖼𝗁 \n━━━━━━━━━━━━━━━━━━\n`;

            songs.forEach((song, index) => {
                message += `#${index + 1}\n📝 :𝖨𝖣 ${song.ID}\n👤 𝖠𝗎𝗍𝗁𝗈𝗋: ${song.author}\n𝖭𝖺𝗆𝖾: ${song.name}\n☁️ 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽: ${song.download}\n\n`;
            });

            api.sendMessage({ body: message }, event.threadID);  // Removed unnecessary mention []
        } else {
            api.editMessage("No songs found matching the search query.", waitMessage.messageID, event.threadID);
        }
    } catch (error) {
        console.error(error);
        api.editMessage("An error occurred while processing your request.", waitMessage.messageID, event.threadID);
    }
};
