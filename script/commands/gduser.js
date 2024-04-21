const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "gduser",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Fetch GD profile info and screenshot",
    usePrefix: true,
    commandCategory: "GD Server",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    if (!args[0]) {
        return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗎𝗌𝖾𝗋𝗇𝖺𝗆𝖾.", event.threadID);
    }

    const content = args[0];
    const apiUrl = `https://gdbrowser.com/api/profile/${content}`;
    const screenshotUrl = `https://api.screenshotmachine.com/?key=904180&url=https://gdbrowser.com/u/${content}&dimension=1024x768`;

    const checkingMessage = await api.sendMessage("𝖢𝗁𝖾𝖼𝗄𝗂𝗇𝗀 𝗍𝗁𝖾 𝖯𝗋𝗈𝖥𝗂𝗅𝖾 𝖦𝖾𝗈𝗆𝖾𝗍𝗋𝗒 𝖣𝖺𝗌𝗁 𝖴𝗌𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖶𝖺𝗂𝗍...", event.threadID);

    try {
        const profileResponse = await axios.get(apiUrl);
        const profileInfo = profileResponse.data;

        const getOrDefault = (obj, key, defaultValue = 'Unknown') => obj && obj[key] ? obj[key] : defaultValue;

        let profileMessage = `𝖴𝗌𝖾𝗋𝗇𝖺𝗆𝖾: ${getOrDefault(profileInfo, 'username')}\n`;
        profileMessage += `𝖯𝗅𝖺𝗒𝖾𝗋 𝖨𝖣: ${getOrDefault(profileInfo, 'playerID')}\n`;
        profileMessage += `𝖠𝖼𝖼𝗈𝗎𝗇𝗍 𝖨𝖣: ${getOrDefault(profileInfo, 'accountID')}\n`;
        profileMessage += `𝖱𝖺𝗇𝗄: ${getOrDefault(profileInfo, 'rank')}\n`;
        profileMessage += `𝖲𝗍𝖺𝗋𝗌: ${getOrDefault(profileInfo, 'stars')}\n`;
        profileMessage += `𝖣𝗂𝖺𝗆𝗈𝗇𝖽𝗌: ${getOrDefault(profileInfo, 'diamonds')}\n`;
        profileMessage += `𝖢𝗈𝗂𝗇𝗌: ${getOrDefault(profileInfo, 'coins')}\n`;
        profileMessage += `𝖯𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝖾𝗋 𝖣𝖾𝗆𝗈𝗇𝗌: \n`;
        profileMessage += `- easy: ${getOrDefault(profileInfo.classicDemonsCompleted, 'easy', 0)}\n`;
        profileMessage += `- medium: ${getOrDefault(profileInfo.classicDemonsCompleted, 'medium', 0)}\n`;
        profileMessage += `- hard: ${getOrDefault(profileInfo.classicDemonsCompleted, 'hard', 0)}\n`;
        profileMessage += `- insane: ${getOrDefault(profileInfo.classicDemonsCompleted, 'insane', 0)}\n`;
        profileMessage += `- extreme: ${getOrDefault(profileInfo.classicDemonsCompleted, 'extreme', 0)}\n`;
        profileMessage += `- weekly: ${getOrDefault(profileInfo.classicDemonsCompleted, 'weekly', 0)}\n`;
        profileMessage += `- gauntlet: ${getOrDefault(profileInfo.classicDemonsCompleted, 'gauntlet', 0)}\n`;
        profileMessage += `𝖯𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝖾𝗋 𝖫𝖾𝗏𝖾𝗅 𝖢𝗈𝗆𝗉𝗅𝖾𝗍𝖾𝖽: \n`;
        profileMessage += `- auto: ${getOrDefault(profileInfo.classicLevelsCompleted, 'auto', 0)}\n`;
        profileMessage += `- easy: ${getOrDefault(profileInfo.classicLevelsCompleted, 'easy', 0)}\n`;
        profileMessage += `- normal: ${getOrDefault(profileInfo.classicLevelsCompleted, 'normal', 0)}\n`;
        profileMessage += `- hard: ${getOrDefault(profileInfo.classicLevelsCompleted, 'hard', 0)}\n`;
        profileMessage += `- harder: ${getOrDefault(profileInfo.classicLevelsCompleted, 'harder', 0)}\n`;
        profileMessage += `- insane: ${getOrDefault(profileInfo.classicLevelsCompleted, 'insane', 0)}\n`;
        profileMessage += `- daily: ${getOrDefault(profileInfo.classicLevelsCompleted, 'daily', 0)}\n`;
        profileMessage += `- gauntlet: ${getOrDefault(profileInfo.classicLevelsCompleted, 'gauntlet', 0)}\n`;
        profileMessage += `𝖯𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝖾𝗋 𝖡𝖺𝗅𝗅: ${getOrDefault(profileInfo, 'balls')}\n`;
        profileMessage += `𝖯𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝖾𝗋 𝖲𝗁𝗂𝗉: ${getOrDefault(profileInfo, 'ship')}\n`;
        profileMessage += `𝖯𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝖾𝗋 𝖴𝖥𝖮: ${getOrDefault(profileInfo, 'ufo')}\n`;
        profileMessage += `𝖯𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝖾𝗋 𝖶𝖺𝗏𝖾: ${getOrDefault(profileInfo, 'wave')}\n`;

        const screenshotPath = `./HaroldModules/${content}.png`;

        if (!fs.existsSync(screenshotPath)) {
            const screenshotResponse = await axios.get(screenshotUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(screenshotPath, screenshotResponse.data);
        }

        await api.sendMessage({ body: profileMessage, attachment: fs.createReadStream(screenshotPath) }, event.threadID, event.messageID);
        await api.unsendMessage(checkingMessage.messageID, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ | 𝖯𝗋𝗈𝖿𝗂𝗅𝖾 𝗎𝗌𝖾𝗋 𝗂𝗌 𝗇𝗈𝗍 𝖾𝗑𝗂𝗌𝗍 𝗈𝗇 𝖦𝖾𝗈𝗆𝖾𝗍𝗋𝗒 𝖣𝖺𝗌𝗁 𝖲𝖾𝗋𝗏𝖾𝗋.", event.threadID, event.messageID);
        await api.unsendMessage(checkingMessage.messageID, event.threadID);
    }
};
