const axios = require('axios');

module.exports.config = {
    name: "gdphtop",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "GDPH leaderboard",
    usePrefix: false,
    commandCategory: "GDPH",
    cooldowns: 30
};

module.exports.run = async function ({ api, event }) {
    const apiUrl = 'https://gdph-top-leaderboard-api-by-jonell.onrender.com/gdphtop';

    try {
        const response = await axios.get(apiUrl);
        const leaderboard = response.data.slice(0, 27);

        let leaderboardMessage = "📊 𝖳𝗈𝗉 27 𝖫𝖾𝖺𝖽𝖾𝗋𝖻𝗈𝖺𝗋𝖽 𝖮𝗇 𝖦𝖣𝖯𝖧 𝖲𝖾𝗋𝗏𝖾𝗋:\n\n";

        leaderboard.forEach((entry, index) => {
            leaderboardMessage += `𝖱𝖺𝗇𝗄 ${entry.rank}: ${entry.username} (𝖴𝗌𝖾𝗋𝖨𝖣: ${entry.userID}) - 𝖲𝗍𝖺𝗋𝗌: ${entry.stars}\n\n`;
        });

        api.sendMessage(leaderboardMessage, event.threadID, async (error, messageInfo) => {
            if (error) {
                console.error(error);
                api.sendMessage("An error occurred while sending the leaderboard.", event.threadID);
                return;
            }

            setTimeout(async () => {
                await api.unsendMessage(messageInfo.messageID, event.threadID);
            }, 60000);
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching the leaderboard.", event.threadID);
    }
};