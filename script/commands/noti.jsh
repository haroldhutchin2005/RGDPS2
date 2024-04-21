const fs = require('fs');
const request = require('request');

module.exports.config = {
    name: "noti",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Notification All Groups Only Mods can use this",
    commandCategory: "Notification",
    usePrefix: true,
    usages: "[msg]",
    cooldowns: 5,
}

let atmDir = [];

const getAtm = (atm, body) => new Promise(async (resolve) => {
    let msg = {}, attachment = [];
    msg.body = body;
    for(let eachAtm of atm) {
        await new Promise(async (resolve) => {
            try {
                let response =  await request.get(eachAtm.url),
                    pathName = response.uri.pathname,
                    ext = pathName.substring(pathName.lastIndexOf(".") + 1),
                    path = __dirname + `/cache/${eachAtm.filename}.${ext}`
                response
                    .pipe(fs.createWriteStream(path))
                    .on("close", () => {
                        attachment.push(fs.createReadStream(path));
                        atmDir.push(path);
                        resolve();
                    })
            } catch(e) { console.log(e); }
        })
    }
    msg.attachment = attachment;
    resolve(msg);
})

module.exports.handleReply = async function ({ api, event, handleReply, Users, Threads }) {
    const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Manila").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, body } = event;
    let name = await Users.getNameUser(senderID);

    switch (handleReply.type) {
        case "sendnoti": {
            let text = `𝖴𝗌𝖾𝗋 𝗁𝖺𝗌 𝖱𝖾𝗉𝗅𝗒\n\n𝖱𝖾𝗉𝗅𝗒: ${body}\n\n\n 𝖥𝗋𝗈𝗆:${name} 𝖥𝗋𝗈𝗆 𝖦𝗋𝗈𝗎𝗉 𝖢𝗁𝖺𝗍 ${(await Threads.getInfo(threadID)).threadName || "Unknow"}`;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `== User Reply ==\n\n『Reply』 : ${body}\n\n\nUser Name: ${name} From Group ${(await Threads.getInfo(threadID)).threadName || "Unknow"}`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    messID: messageID,
                    threadID
                })
            });
            break;
        }
        case "reply": {
            let text = ``;
            if(event.attachments.length > 0) text = await getAtm(event.attachments, `𝖬𝖤𝖲𝖲𝖠𝖤 𝖥𝖱𝖮𝖬  𝖬𝖮𝖣𝖤𝖱𝖠𝖳𝖮𝖱\n\n𝖬𝖾𝗌𝗌𝖺𝗀𝖾 : ${body}\n\n𝖬𝗈𝖽𝖾𝗋𝖺𝗍𝗈𝗋:  ${name}\n\n𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝖬𝖾𝗌𝗌𝖺𝗀𝖾 𝗂𝖿 𝗒𝗈𝗎 𝗐𝖺𝗇𝗍 𝗍𝗈 𝗋𝖾𝗌𝗉𝗈𝗇𝖽 𝗍𝗈 𝗍𝗁𝗂𝗌 𝖠𝗇𝗇𝗈𝗎𝗇𝖼𝖾`);
            api.sendMessage(text, handleReply.threadID, (err, info) => {
                atmDir.forEach(each => fs.unlinkSync(each))
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "sendnoti",
                    messageID: info.messageID,
                    threadID
                })
            }, handleReply.messID);
            break;
        }
    }
}

module.exports.run = async function ({ api, event, args, Users }) {
    const moment = require("moment-timezone");
    var gio = moment.tz("Asia/Manila").format("DD/MM/YYYY - HH:mm:s");
    const { threadID, messageID, senderID, messageReply } = event;
    let name = await Users.getNameUser(senderID);
    const allowedSenders = ["100070558673418", ""];
    if(!allowedSenders.includes(senderID)) {
        return api.sendMessage("𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 𝗇𝗈 𝗉𝖾𝗋𝗆𝗂𝗌𝗌𝗂𝗈𝗇 𝖿𝗈𝗋 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽. 𝖮𝗇𝗅𝗒 𝖬𝗈𝖽𝖾𝗋𝖺𝗍𝗈𝗋 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌", threadID);
    }
    if (!args[0]) return api.sendMessage("Please input message", threadID);
    let allThread = global.data.allThreadID || [];
    let can = 0, canNot = 0;
    let text = `𝖭𝗈𝗍𝗂𝖿𝗂𝖼𝖺𝗍𝗂𝗈𝗇 𝖥𝗋𝗈𝗆 𝖬𝗈𝖽𝖾𝗋𝖺𝗍𝗈𝗋\n\n𝖬𝖾𝗌𝗌𝖺𝗀𝖾:  ${args.join(" ")}\n\n𝖬𝗈𝖽𝖾𝗋𝖺𝗍𝗈𝗋 𝖭𝖺𝗆𝖾: ${name} `;
    if(event.type == "message_reply") text = await getAtm(messageReply.attachments, `𝖬𝖾𝗌𝗌𝖺𝗀𝖾 𝖿𝗋𝗈𝗆 𝖬𝗈𝖽𝖾𝗋𝖺𝗍𝗈𝗋 \n\n𝖬𝖾𝗌𝗌𝖺𝗀𝖾 :  ${args.join(" ")}\n\nModerator Name: ${name}`);
    await new Promise(resolve => {
        allThread.forEach((each) => {
            try {
                api.sendMessage(text, each, (err, info) => {
                    if(err) { canNot++; }
                    else {
                        can++;
                        atmDir.forEach(each => fs.unlinkSync(each))
                        atmDir = [];
                        global.client.handleReply.push({
                            name: this.config.name,
                            type: "sendnoti",
                            messageID: info.messageID,
                            messID: messageID,
                            threadID
                        })
                        resolve();
                    }
                })
            } catch(e) { console.log(e) }
        })
    })
    api.sendMessage(`Send to ${can} thread, not send to ${canNot} thread`, threadID);
}
