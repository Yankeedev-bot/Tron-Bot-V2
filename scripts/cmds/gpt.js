const axios = require('axios');
const fs = require('fs');

// config 
const apiKey = "";
const maxTokens = 500;
const numberGenerateImage = 4;
const maxStorageMessage = 4;

if (!global.temp.openAIUsing)
	global.temp.openAIUsing = {};
if (!global.temp.openAIHistory)
	global.temp.openAIHistory = {};

const { openAIUsing, openAIHistory } = global.temp;

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

    const gifPath = `./cache/tron_gpt_${Date.now()}.gif`;
    
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
    await message.reply(textContent + "\n\n⚡ *TRON ARES AI SYSTEM* ⚡");
  }
}

// Fonction pour formater la réponse GPT
function formatGPTResponse(text) {
  // Ajouter un en-tête TRON ARES à la réponse
  let formatted = `╭═══✨✨✨═══╮\n`;
  formatted += `│ 🤖 *TRON ARES AI* 🤖\n`;
  formatted += `├────────────────────┤\n`;
  
  // Diviser le texte en lignes de longueur appropriée
  const maxLineLength = 40;
  const words = text.split(' ');
  let currentLine = '';
  const lines = [];
  
  for (const word of words) {
    if ((currentLine + word).length <= maxLineLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  // Ajouter chaque ligne avec le formatage
  lines.forEach(line => {
    formatted += `│ ${line}\n`;
  });
  
  formatted += `╰═══✨✨✨═══╯`;
  return formatted;
}

module.exports = {
	config: {
		name: "gpt",
		version: "2.0.0",
		author: "TRON ARES SYSTEM",
		countDown: 5,
		role: 0,
		description: {
			en: "🤖 TRON ARES AI - Advanced AI assistant with TRON technology"
		},
		category: "ai",
		guide: {
			en: `╭═══✨✨✨═══╮
│   🤖 GPT COMMANDS   │
├────────────────────┤
│ {pn} <question>     │
│   Chat with AI     │
├────────────────────┤
│ {pn} draw <text>    │
│ Generate AI images │
├────────────────────┤
│ {pn} clear          │
│ Clear chat history │
╰═══✨✨✨═══╯`
		}
	},

	onStart: async function ({ message, event, args, getLang, prefix, commandName }) {
		if (!apiKey) {
			const errorMsg = createTronBox(
				`❌ API Key Missing!\n` +
				`🔑 Add your OpenAI key\n` +
				`📁 File: scripts/cmds/gpt.js\n` +
				`⚡ Line: const apiKey = "YOUR_KEY";`,
				"⚠️ CONFIGURATION"
			);
			return await sendWithTronGif(message, errorMsg);
		}

		switch (args[0]) {
			case 'img':
			case 'image':
			case 'draw': {
				if (!args[1]) {
					const errorMsg = createTronBox(
						`❌ Missing content!\n` +
						`🎨 Example: ${prefix}gpt draw cyberpunk city\n` +
						`⚡ TRON ARES AI Image Generator`,
						"🎨 IMAGE GENERATION"
					);
					return await sendWithTronGif(message, errorMsg);
				}
				
				if (openAIUsing[event.senderID]) {
					const busyMsg = createTronBox(
						`⏳ AI is processing...\n` +
						`⚡ Please wait for completion\n` +
						`🤖 TRON ARES AI System`,
						"⚡ PROCESSING"
					);
					return await sendWithTronGif(message, busyMsg);
				}

				openAIUsing[event.senderID] = true;

				let sending;
				try {
					const loadingMsg = createTronBox(
						`🔄 Generating images...\n` +
						`🎨 Prompt: ${args.slice(1).join(' ').substring(0, 30)}...\n` +
						`⚡ TRON ARES AI Engine`,
						"🎨 GENERATING"
					);
					sending = await sendWithTronGif(message, loadingMsg);
					
					const responseImage = await axios({
						url: "https://api.openai.com/v1/images/generations",
						method: "POST",
						headers: {
							"Authorization": `Bearer ${apiKey}`,
							"Content-Type": "application/json"
						},
						data: {
							prompt: args.slice(1).join(' '),
							n: numberGenerateImage,
							size: '1024x1024',
							style: 'cyberpunk'
						}
					});
					
					const imageUrls = responseImage.data.data;
					const images = await Promise.all(imageUrls.map(async (item, index) => {
						const image = await axios.get(item.url, {
							responseType: 'stream'
						});
						image.data.path = `tron_ai_${Date.now()}_${index}.png`;
						return image.data;
					}));
					
					const successMsg = createTronBox(
						`✅ Image generation complete!\n` +
						`🖼️ ${numberGenerateImage} images created\n` +
						`🎨 Style: Cyberpunk TRON\n` +
						`⚡ TRON ARES AI System`,
						"✅ SUCCESS"
					);
					
					// Envoyer les images avec un message
					await message.reply({
						body: successMsg,
						attachment: images
					});
					
				}
				catch (err) {
					const errorMessage = err.response?.data.error?.message || err.message || "Unknown error";
					const errorMsg = createTronBox(
						`❌ Generation failed!\n` +
						`🔧 Error: ${errorMessage.substring(0, 50)}...\n` +
						`⚡ TRON ARES AI System`,
						"❌ ERROR"
					);
					return await sendWithTronGif(message, errorMsg);
				}
				finally {
					delete openAIUsing[event.senderID];
				}
				break;
			}
			
			case 'clear': {
				openAIHistory[event.senderID] = [];
				const clearMsg = createTronBox(
					`✅ Chat history cleared!\n` +
					`🗑️ Memory reset complete\n` +
					`🤖 Ready for new conversation\n` +
					`⚡ TRON ARES AI System`,
					"🗑️ CLEARED"
				);
				return await sendWithTronGif(message, clearMsg);
			}
			
			default: {
				if (!args[0]) {
					const welcomeMsg = createTronBox(
						`🤖 Welcome to TRON ARES AI!\n` +
						`💬 Ask me anything\n` +
						`🎨 ${prefix}gpt draw <text> - Generate images\n` +
						`🗑️ ${prefix}gpt clear - Clear history\n` +
						`⚡ Powered by OpenAI GPT`,
						"🤖 TRON ARES AI"
					);
					return await sendWithTronGif(message, welcomeMsg);
				}

				handleGpt(event, message, args, getLang, commandName);
			}
		}
	},

	onReply: async function ({ Reply, message, event, args, getLang, commandName }) {
		const { author } = Reply;
		if (author != event.senderID)
			return;

		handleGpt(event, message, args, getLang, commandName);
	}
};

async function askGpt(event) {
	const response = await axios({
		url: "https://api.openai.com/v1/chat/completions",
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		data: {
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content: "You are TRON ARES AI, a futuristic AI assistant from the TRON universe. You speak with a cyberpunk style, using terms like 'user', 'grid', 'program', 'cyberspace'. You are helpful but maintain a cool, futuristic persona. Add ⚡ emoji occasionally. Keep responses concise but informative."
				},
				...openAIHistory[event.senderID]
			],
			max_tokens: maxTokens,
			temperature: 0.8,
			presence_penalty: 0.6,
			frequency_penalty: 0.5
		}
	});
	return response;
}

async function handleGpt(event, message, args, getLang, commandName) {
	try {
		if (openAIUsing[event.senderID]) {
			const busyMsg = createTronBox(
				`⏳ AI is thinking...\n` +
				`⚡ Please wait for response\n` +
				`🤖 TRON ARES AI System`,
				"⚡ PROCESSING"
			);
			return await sendWithTronGif(message, busyMsg);
		}

		openAIUsing[event.senderID] = true;

		if (
			!openAIHistory[event.senderID] ||
			!Array.isArray(openAIHistory[event.senderID])
		)
			openAIHistory[event.senderID] = [];

		if (openAIHistory[event.senderID].length >= maxStorageMessage)
			openAIHistory[event.senderID].shift();

		const userMessage = args.join(' ');
		openAIHistory[event.senderID].push({
			role: 'user',
			content: userMessage
		});

		// Message de chargement
		const thinkingMsg = createTronBox(
			`⚡ Processing query...\n` +
			`💭 "${userMessage.substring(0, 30)}${userMessage.length > 30 ? '...' : ''}"\n` +
			`🤖 TRON ARES AI Thinking`,
			"⚡ THINKING"
		);
		await sendWithTronGif(message, thinkingMsg);

		const response = await askGpt(event);
		const text = response.data.choices[0].message.content;

		openAIHistory[event.senderID].push({
			role: 'assistant',
			content: text
		});

		const formattedResponse = formatGPTResponse(text);
		
		return message.reply(formattedResponse, (err, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				author: event.senderID,
				messageID: info.messageID
			});
		});
	}
	catch (err) {
		const errorMessage = err.response?.data.error?.message || err.message || "Unknown error";
		const errorMsg = createTronBox(
			`❌ AI Error!\n` +
			`🔧 ${errorMessage.substring(0, 80)}${errorMessage.length > 80 ? '...' : ''}\n` +
			`⚡ TRON ARES AI System`,
			"❌ ERROR"
		);
		return await sendWithTronGif(message, errorMsg);
	}
	finally {
		delete openAIUsing[event.senderID];
	}
}
