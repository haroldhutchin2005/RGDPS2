const axios = require('axios');

module.exports.config = {
    name: "isRated",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Check if a level is rated",
    usePrefix: true,
    commandCategory: "RGDPS TOOLS",
    usages: "[levelID]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const levelID = encodeURIComponent(args.join(" ").trim());

    const apiUrl = `https://johnrickgdp.ps.fhgdps.com/dashboard/api/whoRated.php?level=${levelID}`;

    if (!levelID) {
        return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗅𝖾𝗏𝖾𝗅 𝖨𝖣 𝗍𝗈 𝖼𝗁𝖾𝖼𝗄.\n\n𝖴𝗌𝖺𝗀𝖾: /𝗂𝗌𝖱𝖺𝗍𝖾𝖽 [𝗅𝖾𝗏𝖾𝗅𝖨𝖣]", event.threadID, event.messageID);
    }

    const waitMessage = await api.sendMessage("🔍 | 𝖢𝗁𝖾𝖼𝗄𝗂𝗇𝗀 𝗂𝖿 𝗅𝖾𝗏𝖾𝗅 𝗂𝗌 𝖱𝖺𝗍𝖾𝖽. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...", event.threadID);

    try {
        const response = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const responseData = response.data;

        if (responseData.dashboard && responseData.success) {
            const levelInfo = responseData.level;
            const rates = responseData.rates;

            let message = `✅ | 𝖱𝖺𝗍𝖾𝖫𝖾𝗏𝖾𝗅\n━━━━━━━━━━━━━━━━━━\n`;
            message += `📝 𝖫𝖾𝗏𝖾𝗅 𝖭𝖺𝗆𝖾: ${levelInfo.name}\n👤 𝖠𝗎𝗍𝗁𝗈𝗋: ${levelInfo.author}\n\n`;

            if (rates.length > 0) {
                message += "𝖱𝖺𝗍𝖾𝖫:\n";
                rates.forEach((rate, index) => {
                    message += `#${index + 1}\n👤 𝖴𝗌𝖾𝗋𝗇𝖺𝗆𝖾: ${rate.username}\n🏷️ 𝖠𝖼𝖼𝗈𝗎𝗇𝗍 𝖨𝖣: ${rate.accountID}\n🙂 𝖣𝗂𝖧𝖧𝗂𝖼𝗎𝗅𝗍𝗒: ${rate.difficulty}\n⭐ 𝖲𝗍𝖺𝗋𝗌: ${rate.stars}\n🕜 𝖳𝗂𝗆𝖾𝗌𝗍𝖺𝗆𝗉: ${rate.timestamp}\n\n`;
                });
            } else {
                message += "❌ | 𝖭𝗈 𝗋𝖺𝗍𝖾 𝖫𝖾𝗏𝖾𝗅𝗌 𝖿𝗈𝗎𝗇𝖽 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝗅𝖾𝗏𝖾𝗅.";
            }

            api.sendMessage({ body: message }, event.threadID);
        } else if (responseData.dashboard && !responseData.success && responseData.error === 3) {
            api.editMessage("☹️ | 𝖳𝗁𝗂𝗌 𝗅𝖾𝗏𝖾𝗅 𝗐𝖺𝗌𝗇'𝗍 𝗋𝖺𝗍𝖾.", waitMessage.messageID, event.threadID);
        } else {
            api.editMessage("𝖫𝖾𝖾𝗅 𝗇𝗈𝗍 𝖿𝗈𝗎𝗇𝖽 𝗈𝗋 𝖺𝗇 𝖾𝗋𝗋𝗈𝗋 𝗈𝖼𝖼𝗎𝗋𝗋𝖾𝖽 𝗐𝗁𝗂𝗅𝖾 𝗉𝗋𝗈𝖼𝖾𝖾𝖽𝗂𝗇𝗀 𝗒𝗈𝗎𝗋 𝗋𝖾𝗊𝗎𝖾𝗌𝗍.", waitMessage.messageID, event.threadID);
        }
    } catch (error) {
        console.error(error);
        api.editMessage("An error occurred while processing your request.", waitMessage.messageID, event.threadID);
    }
};
