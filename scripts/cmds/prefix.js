const fs = require("fs-extra");
const axios = require("axios");
const { utils } = global;

// GIFs TRON ARES
const tronGifs = [
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://media.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif",
  "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
  "https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif"
];

// Fonction pour créer une boîte TRON ARES
function createTronBox(content, title = null) {
  let box = `╭═══✨✨✨═══╮\n`;
  
  if (title) {
    const titleLength = title.length;
    const totalWidth = 17;
    const leftPadding = Math.floor((totalWidth - titleLength) / 2);
    const rightPadding = totalWidth - titleLength - leftPadding;
    
    box += `│${' '.repeat(leftPadding)}${title}${' '.repeat(rightPadding)}│\n`;
  }
  
  const lines = content.split('\n').filter(line => line.trim() !== '');
  lines.forEach(line => {
    box += `│ ${line}\n`;
  });
  
  box += `╰═══✨✨✨═══╯`;
  return box;
}

// Fonction pour envoyer avec GIF TRON
async function sendWithTronGif(message, textContent) {
  try {
    const gifUrl = tronGifs[Math.floor(Math.random() * tronGifs.length)];
    
    // Essayer d'envoyer directement depuis l'URL
    try {
      await message.reply({
        body: textContent,
        attachment: await global.utils.getStreamFromURL(gifUrl)
      });
      return;
    } catch (urlError) {
      console.log("URL method failed, trying download...");
    }
    
    // Télécharger puis envoyer
    const response = await axios({
      method: 'GET',
      url: gifUrl,
      responseType: 'stream',
      timeout: 15000
    });

    const gifPath = `./cache/tron_prefix_${Date.now()}.gif`;
    
    if (!fs.existsSync('./cache')) {
      fs.mkdirSync('./cache');
    }
    
    const writer = fs.createWriteStream(gifPath);
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    await message.reply({
      body: textContent,
      attachment: fs.createReadStream(gifPath)
    });
    
  } catch (error) {
    console.error("GIF error:", error.message);
    await message.reply(textContent + "\n\n⚡ *TRON ARES SYSTEM* ⚡");
  }
}

module.exports = {
	config: {
		name: "prefix",
		version: "2.0.0",
		author: "TRON ARES SYSTEM",
		countDown: 5,
		role: 0,
		description: {
			vi: "Thay đổi dấu lệnh của hệ thống TRON ARES",
			en: "Change prefix of TRON ARES system"
		},
		category: "config",
		guide: {
			en: `   ╭═══✨✨✨═══╮
   │    PREFIX GUIDE     │
   ├────────────────────┤
   │ {pn} <new prefix>   │
   │   Change in chat    │
   ├────────────────────┤
   │ {pn} <prefix> -g    │
   │ Change system-wide  │
   │   (Admin only)      │
   ├────────────────────┤
   │ {pn} reset          │
   │  Reset to default   │
   ╰═══✨✨✨═══╯`
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
		const prefix = utils.getPrefix(event.threadID);
		const systemPrefix = global.GoatBot.config.prefix;
		
		if (!args[0]) {
			// Afficher le prefix actuel avec style TRON ARES
			let result = `╭═══✨✨✨═══╮\n`;
			result += `│ ⚡ *TRON ARES PREFIX* ⚡\n`;
			result += `├────────────────────┤\n`;
			result += `│ 🌐 System: ${systemPrefix}\n`;
			result += `│ 🛸 Chat: ${prefix}\n`;
			result += `│ 🤖 Bot: TRON ARES\n`;
			result += `╰═══✨✨✨═══╯\n\n`;
			
			result += createTronBox(
				`🔧 ${systemPrefix}prefix #\n` +
				`⚡ Change chat prefix\n\n` +
				`👑 ${systemPrefix}prefix # -g\n` +
				`⚡ Change system prefix\n\n` +
				`🔄 ${systemPrefix}prefix reset\n` +
				`⚡ Reset to default`,
				"🚀 COMMANDS"
			);
			
			return await sendWithTronGif(message, result);
		}

		if (args[0] == 'reset') {
			await threadsData.set(event.threadID, null, "data.prefix");
			
			let result = createTronBox(
				`✅ Prefix reset successful!\n` +
				`🔄 New prefix: ${global.GoatBot.config.prefix}\n` +
				`⚡ System: TRON ARES`,
				"🔄 RESET COMPLETE"
			);
			
			return await sendWithTronGif(message, result);
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix
		};

		if (args[1] === "-g") {
			if (role < 2) {
				let errorMsg = createTronBox(
					`❌ Access Denied!\n` +
					`👑 Admin privileges required\n` +
					`⚡ Contact system administrator`,
					"⚠️ PERMISSION ERROR"
				);
				return await sendWithTronGif(message, errorMsg);
			}
			else {
				formSet.setGlobal = true;
				
				let confirmMsg = createTronBox(
					`⚠️ SYSTEM WIDE CHANGE\n` +
					`🔧 New prefix: ${newPrefix}\n\n` +
					`❗ This will affect ALL chats\n` +
					`⚡ React to confirm change`,
					"🌐 GLOBAL PREFIX"
				);
				
				return message.reply(confirmMsg, (err, info) => {
					formSet.messageID = info.messageID;
					global.GoatBot.onReaction.set(info.messageID, formSet);
				});
			}
		}
		else {
			formSet.setGlobal = false;
			
			let confirmMsg = createTronBox(
				`⚠️ CHAT PREFIX CHANGE\n` +
				`🔧 New prefix: ${newPrefix}\n\n` +
				`💬 This chat only\n` +
				`⚡ React to confirm change`,
				"💬 CHAT PREFIX"
			);
			
			return message.reply(confirmMsg, (err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			});
		}
	},

	onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author)
			return;
			
		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			
			let successMsg = createTronBox(
				`✅ System prefix updated!\n` +
				`🔧 New prefix: ${newPrefix}\n` +
				`🌐 All chats affected\n` +
				`⚡ TRON ARES SYSTEM`,
				"🌐 GLOBAL UPDATE"
			);
			
			return await sendWithTronGif(message, successMsg);
		}
		else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			
			let successMsg = createTronBox(
				`✅ Chat prefix updated!\n` +
				`🔧 New prefix: ${newPrefix}\n` +
				`💬 This chat only\n` +
				`⚡ TRON ARES SYSTEM`,
				"💬 CHAT UPDATE"
			);
			
			return await sendWithTronGif(message, successMsg);
		}
	},

	onChat: async function ({ event, message }) {
		if (event.body && event.body.toLowerCase() === "prefix") {
			const prefix = utils.getPrefix(event.threadID);
			const systemPrefix = global.GoatBot.config.prefix;
			
			let result = `╭═══✨✨✨═══╮\n`;
			result += `│ ⚡ *TRON ARES PREFIX* ⚡\n`;
			result += `├────────────────────┤\n`;
			result += `│ 🌐 System: ${systemPrefix}\n`;
			result += `│ 🛸 This chat: ${prefix}\n`;
			result += `│ 🤖 Bot: TRON ARES\n`;
			result += `╰═══✨✨✨═══╯\n\n`;
			
			result += `Type "${systemPrefix}prefix" for more options`;
			
			return message.reply(result);
		}
	}
};
