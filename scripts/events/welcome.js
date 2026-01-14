const { getTime, drive } = global.utils;
const axios = require('axios');
const fs = require('fs');

if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

// GIFs TRON ARES pour les messages de bienvenue
const tronWelcomeGifs = [
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // Effets lumière bleue
  "https://media.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif", // Circuits
  "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",  // Grille numérique
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", // Animation cyberpunk
  "https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif",  // Énergie
  "https://media.giphy.com/media/26ufdgrZhHp3QnEQY/giphy.gif",  // Interface holographique
  "https://i.giphy.com/media/3o7TKsQ8gTp3WqXqjq/giphy.gif",     // Données qui s'écoulent
  "https://i.giphy.com/media/26tknCqiJrBQG6DrC/giphy.gif"      // Rétroéclairage
];

// Fonction pour créer un message de bienvenue TRON ARES
function createTronWelcomeMessage(userName, boxName, session, multiple, prefix) {
  const timeEmojis = {
    morning: "🌅",
    noon: "☀️",
    afternoon: "🌇",
    evening: "🌃"
  };
  
  const sessionEmoji = timeEmojis[session] || "⚡";
  
  let message = `╭═══✨✨✨═══╮\n`;
  message += `│ ⚡ *TRON ARES SYSTEM* ⚡\n`;
  message += `├────────────────────┤\n`;
  message += `│ 👤 Nouveau programme: ${userName}\n`;
  message += `│ 🏢 Grille: ${boxName}\n`;
  message += `│ ⏰ Session: ${session} ${sessionEmoji}\n`;
  message += `│ 🤖 Bot: TRØN†ARËS†BØT\n`;
  message += `│ 🔧 Prefix: ${prefix}\n`;
  message += `╰═══✨✨✨═══╯\n\n`;
  
  // Message de bienvenue personnalisé
  message += `🎮 *Bienvenue sur la Grille TRON ARES!* 🎮\n\n`;
  message += `🔹 Accès autorisé au programme: *${userName}*\n`;
  message += `🔹 Secteur: *${boxName}*\n`;
  message += `🔹 Type: ${multiple ? "Multiples programmes" : "Programme individuel"}\n`;
  message += `🔹 Statut: *ACTIVÉ*\n\n`;
  
  // Instructions
  message += `📖 *Commandes disponibles:*\n`;
  message += `├ ${prefix}help → Menu des commandes\n`;
  message += `├ ${prefix}menu → Interface principale\n`;
  message += `├ ${prefix}cmd → Liste des commandes\n`;
  message += `╰ ${prefix}tron → Système TRON\n\n`;
  
  message += `⚡ *Que la lumière vous guide sur la Grille!* ⚡`;
  
  return message;
}

// Fonction pour obtenir un GIF TRON aléatoire
function getRandomTronGif() {
  return tronWelcomeGifs[Math.floor(Math.random() * tronWelcomeGifs.length)];
}

// Fonction pour envoyer avec GIF TRON
async function sendWelcomeWithGif(message, textContent, threadID) {
  try {
    const gifUrl = getRandomTronGif();
    
    // Essayer d'envoyer directement depuis l'URL
    try {
      const stream = await global.utils.getStreamFromURL(gifUrl);
      return message.send({
        body: textContent,
        attachment: stream
      });
    } catch (urlError) {
      console.log("URL method failed for welcome gif");
    }
    
    // Fallback: envoyer sans GIF
    return message.send(textContent);
  } catch (error) {
    console.error("Welcome GIF error:", error.message);
    return message.send(textContent);
  }
}

module.exports = {
	config: {
		name: "welcome",
		version: "2.0.0",
		author: "TRON ARES SYSTEM",
		category: "events"
	},

	langs: {
		vi: {
			session1: "sáng",
			session2: "trưa",
			session3: "chiều",
			session4: "tối",
			welcomeMessage: "Cảm ơn bạn đã mời tôi vào nhóm!\nPrefix bot: %1\nĐể xem danh sách lệnh hãy nhập: %1help",
			multiple1: "bạn",
			multiple2: "các bạn",
			defaultWelcomeMessage: "Xin chào {userName}.\nChào mừng bạn đến với {boxName}.\nChúc bạn có buổi {session} vui vẻ!"
		},
		en: {
			session1: "morning",
			session2: "noon",
			session3: "afternoon",
			session4: "evening",
			welcomeMessage: "🤖 *TRON ARES ACTIVATED!*\n🔧 Bot prefix: %1\n📖 Commands: %1help\n⚡ Grid Status: ONLINE",
			multiple1: "program",
			multiple2: "programs",
			defaultWelcomeMessage: `╭═══✨✨✨═══╮
│ ⚡ WELCOME TO THE GRID ⚡
├────────────────────┤
│ 👤 Program: {userName}
│ 🏢 Sector: {boxName}
│ ⏰ Time: {session}
│ 🔧 Prefix: {prefix}
╰═══✨✨✨═══╯`
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType == "log:subscribe")
			return async function () {
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.GoatBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				
				// Si le nouveau membre est le bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					
					// Message d'activation TRON ARES
					const botWelcomeMsg = `╭═══✨✨✨═══╮
│ ⚡ *TRON ARES ACTIVATION* ⚡
├────────────────────┤
│ 🤖 Système: TRØN†ARËS†BØT
│ 🏢 Grille: ${threadID}
│ 🔧 Prefix: ${prefix}
│ ⚡ Statut: ACTIVÉ
╰═══✨✨✨═══╯\n\n`;
					
					const welcomeText = botWelcomeMsg + getLang("welcomeMessage", prefix);
					return sendWelcomeWithGif(message, welcomeText, threadID);
				}
				
				// Si nouveau membre:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				// Ajouter les nouveaux membres au tableau
				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				// Si un timeout est défini, l'effacer
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				// Définir un nouveau timeout
				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const threadData = await threadsData.get(threadID);
					if (threadData.settings.sendWelcomeMessage == false)
						return;
						
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const dataBanned = threadData.data.banned_ban || [];
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}
					
					if (userName.length == 0) return;
					
					// Déterminer la session
					let session;
					if (hours <= 10)
						session = getLang("session1");
					else if (hours <= 12)
						session = getLang("session2");
					else if (hours <= 18)
						session = getLang("session3");
					else
						session = getLang("session4");
					
					// Obtenir le message de bienvenue personnalisé ou utiliser celui par défaut
					let { welcomeMessage = "" } = threadData.data;
					
					// Si pas de message personnalisé, utiliser le style TRON ARES
					if (!welcomeMessage || welcomeMessage.trim() === "") {
						const userNameStr = userName.join(", ");
						welcomeMessage = createTronWelcomeMessage(userNameStr, threadName, session, multiple, prefix);
					} else {
						// Formater le message personnalisé existant
						const form = {
							mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
						};
						welcomeMessage = welcomeMessage
							.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
							.replace(/\{boxName\}|\{threadName\}/g, threadName)
							.replace(
								/\{multiple\}/g,
								multiple ? getLang("multiple2") : getLang("multiple1")
							)
							.replace(
								/\{session\}/g,
								session
							)
							.replace(
								/\{prefix\}/g,
								prefix
							);
						form.body = welcomeMessage;
						
						// Ajouter des pièces jointes si définies
						if (threadData.data.welcomeAttachment) {
							const files = threadData.data.welcomeAttachment;
							const attachments = files.reduce((acc, file) => {
								acc.push(drive.getFile(file, "stream"));
								return acc;
							}, []);
							form.attachment = (await Promise.allSettled(attachments))
								.filter(({ status }) => status == "fulfilled")
								.map(({ value }) => value);
						}
						
						// Envoyer avec GIF TRON
						return sendWelcomeWithGif(message, form.body, threadID);
					}
					
					// Envoyer le message TRON ARES avec GIF
					await sendWelcomeWithGif(message, welcomeMessage, threadID);
					
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
