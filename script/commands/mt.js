module.exports.config = {
    name: "maintenance",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Jonell Magallanes",
    description: "Announce Bot maintenance due errors",
  usePrefix: true,
    commandCategory: "System",
    cooldowns: 5,
};

module.exports.run = function({ api, event, args }) {
    var fs = require("fs");
    var request = require("request");
  const content = args.join(" ");

    api.getThreadList(30, null, ["INBOX"], (err, list) => {
        if (err) { 
            console.error("ERR: "+ err);
            return;
        }

        list.forEach(thread => {
            if(thread.isGroup == true && thread.threadID != event.threadID) {
                var link = "https://i.postimg.cc/NFdDc0vV/RFq-BU56n-ES.gif";  
                var callback = () => api.sendMessage({ 
                    body: `${global.config.BOTNAME} 𝖡𝖮𝖳 𝗂𝗌 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗆𝖺𝗂𝗇𝗍𝖾𝗇𝖺𝗇𝖼𝖾. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖻𝖾 𝗉𝖺𝗍𝗂𝖾𝗇𝗍.\n\n𝖱𝖾𝖺𝗌𝗈𝗇: ${content}\n\n𝖣𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋:𝖩𝗈𝗇𝖾𝗅𝗅 𝖬𝖺𝗀𝖺𝗅𝗅𝖺𝗇𝖾𝗌`, 
                    attachment: fs.createReadStream(__dirname + "/cache/maintenance.gif")
                }, 
                thread.threadID, 
                () => { 
                    fs.unlinkSync(__dirname + "/cache/maintenance.gif");
                    console.log(`Maintenance message sent to ${thread.threadID}. Now shutting down.`);
                    process.exit(); 
                });

                return request(encodeURI(link))
                    .pipe(fs.createWriteStream(__dirname + "/cache/maintenance.gif"))
                    .on("close", callback);
            }
        });
    });

    console.log("The bot is now off for maintenance.");
};