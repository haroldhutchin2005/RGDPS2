"use strict";

const axios = require('axios');

module.exports.config = {
    name: "servercheck",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Check the status of GD servers",
    usePrefix: true,
    commandCategory: "Utility",
    cooldowns: 10
};

module.exports.run = async function ({ api, event }) {
    const servers = [
        "https://johnrickgdp.ps.fhgdps.com/",
        "https://johnrickgdp.ps.fhgdps.com/info/song.html",
        "https://johnrickgdp.ps.fhgdps.com/dashboard/api/songs.php?search=bling",
        "https://johnrickgdp.ps.fhgdps.com/dashboard/"
    ];

    const checkingMessage = await api.sendMessage("🔍 | 𝖢𝗁𝖾𝖼𝗄𝗂𝗇𝗀 𝗌𝖾𝗋𝗏𝖾𝗋 𝗌𝗍𝖺𝗍𝗎𝗌...", event.threadID);

    const results = await Promise.allSettled(
        servers.map(server => axios.get(server).then(() => '✅').catch(() => '❌'))
    );

    let status = {
        "𝖧𝗈𝗆𝖾𝗉𝖺𝗀𝖾": results[0].value,
        "𝖱𝖾𝗎𝗉𝗅𝗈𝖺𝖽 𝖬𝗎𝗌𝗂𝖼": results[1].value,
        "𝖲𝗈𝗇𝗀𝖫𝗂𝗌𝗍": results[2].value,
        "𝖨𝗇𝖽𝖾𝗑 𝖧𝗈𝗆𝖾𝗉𝖺𝗀𝖾": results[3].value
    };

    let response = `𝖱𝖦𝖣𝖯𝖲 𝖲𝖾𝗋𝗏𝖾𝗋 𝖲𝗍𝖺𝗍𝗎𝗌 𝖢𝗁𝖾𝖼𝗄\n\n`;

    for (const [server, stat] of Object.entries(status)) {
        response += `${server}: ${stat}\n`;
    }

    if (Object.values(status).every(stat => stat === '✅')) {
        response += "\n𝖠𝗅𝗅 𝗌𝖾𝗋𝗏𝖾𝗋𝗌 𝖺𝗋𝖾 𝗎𝗉.";
    } else if (Object.values(status).every(stat => stat === '❌')) {
        response += "\n𝖠𝗅𝗅 𝗌𝖾𝗋𝗏𝖾𝗋𝗌 𝖺𝗋𝖾 𝖽𝗈𝗐𝗇.";
    } else {
        response += "\n𝖲𝗈𝗆𝖾 𝗌𝖾𝗋𝗏𝖾𝗋𝗌 𝗆𝖺𝗒 𝖻𝖾 𝖾𝗑𝗉𝖾𝗋𝗂𝖾𝗇𝖼𝗂𝗇𝗀 𝗂𝗌𝗌𝗎𝖾𝗌.";
    }

    api.editMessage(response, checkingMessage.messageID, event.threadID, event.messageID);
};
