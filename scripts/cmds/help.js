const axios = require("axios");
const fs = require("fs");
const { getPrefix } = global.utils;
const { commands } = global.GoatBot;

// FONCTION POUR LES ÉMOJIS DE CATÉGORIES
function getCategoryEmoji(cat) {
  const emojiMap = {
    "admin": "👑", "anisr": "🔍", "anime": "🎬", "bank": "🏦",
    "economy": "💎", "game": "🎮", "fun": "🎉", "media": "📥",
    "system": "🖥️", "utility": "🧰", "nsfw": "🔞", "ai": "🤖",
    "image": "🌌", "tools": "🔧", "owner": "👑", "custom": "🛠️",
    "info": "📌", "tron": "⚡", "music": "🎵", "group": "👥",
    "user": "👤", "search": "🔎", "download": "📦", "rpg": "⚔️",
    "sticker": "🖼️", "general": "🎄", "herramientas": "🪛",
    "propietario": "💼", "juegos": "🏆", "diversion": "🎉",
    "buscador": "🔍", "descargas": "📦", "maker": "🎨",
    "utilidades": "⚙️", "util": "🔧", "tools": "🔨"
  };
  return emojiMap[cat?.toLowerCase()] || "🎁";
}

// FONCTION POUR CRÉER UNE BOÎTE AVEC BORDURES TRON ARES
function createTronBox(content, title = null) {
  let box = `╭═══✨✨✨═══╮\n`;
  
  if (title) {
    // Calculer l'espacement pour centrer le titre
    const titleLength = title.length;
    const totalWidth = 17; // Largeur de la boîte
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

// FONCTION POUR CRÉER L'EN-TÊTE TRON ARES
function createTronHeader(userName) {
  const adminID = "61572476705473";
  const botName = "TRØN†ARËS†BØT";
  
  return `╭═══✨✨✨═══╮
│ ⚡💙 *TRON ARES SYSTEM* 💙⚡
│ 👤 Usuario: *${userName || "Guest"}*
│ 🤖 Bot: *${botName}*
│ 👑 Admin: *${adminID}*
╰═══✨✨✨═══╯\n\n`;
}

// FONCTION POUR CRÉER LE PIED DE PAGE TRON ARES
function createTronFooter(prefix, totalCommands) {
  return `\n╭═══✨✨✨═══╮
│ ⚡ *TRON ARES SYSTEM* ⚡
│ 🔧 Prefix: ${prefix}
│ 📊 Commands: ${totalCommands}
│ 🔍 Usage: ${prefix}help [command]
│ 🎮 Example: ${prefix}help balance
╰═══✨✨✨═══╯\n\n⚡ Powered by TRON ARES Technology ⚡`;
}

// GIFs TRON ARES - URLs directes qui fonctionnent
const tronGifs = [
  "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // Lumière bleue
  "https://media.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif", // Circuits
  "https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",  // Grille
  "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", // Cyberpunk
  "https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif",  // Énergie
  "https://media.giphy.com/media/26ufdgrZhHp3QnEQY/giphy.gif",  // Interface
  "https://media.giphy.com/media/3o7TKsQ8gTp3WqXqjq/giphy.gif", // Données
  "https://media.giphy.com/media/26tknCqiJrBQG6DrC/giphy.gif"   // Rétro
];

// URL de secours garanties
const backupGifs = [
  "https://i.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif",
  "https://i.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
  "https://i.giphy.com/media/xT0GqH01ZyKwd3aT3G/giphy.gif"
];

// Fonction pour obtenir un GIF (méthode simple sans téléchargement)
function getTronGifUrl() {
  // Essayer d'abord les GIFs principaux
  try {
    return tronGifs[Math.floor(Math.random() * tronGifs.length)];
  } catch (e) {
    // Fallback sur les GIFs de secours
    return backupGifs[Math.floor(Math.random() * backupGifs.length)];
  }
}

// FONCTION POUR ENVOYER AVEC GIF (version améliorée)
async function sendWithTronGif(message, textContent) {
  try {
    const gifUrl = getTronGifUrl();
    
    // Méthode 1: Essayer d'envoyer directement depuis l'URL
    try {
      await message.reply({
        body: textContent,
        attachment: await global.utils.getStreamFromURL(gifUrl)
      });
      return;
    } catch (urlError) {
      console.log("URL method failed, trying download...");
    }
    
    // Méthode 2: Télécharger puis envoyer (sans effacer)
    const response = await axios({
      method: 'GET',
      url: gifUrl,
      responseType: 'stream',
      timeout: 15000
    });

    // Créer un fichier temporaire avec nom unique
    const gifPath = `./cache/tron_ares_help_${Date.now()}.gif`;
    
    // S'assurer que le dossier cache existe
    if (!fs.existsSync('./cache')) {
      fs.mkdirSync('./cache');
    }
    
    const writer = fs.createWriteStream(gifPath);
    
    response.data.pipe(writer);
    
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Envoyer le message avec le GIF
    await message.reply({
      body: textContent,
      attachment: fs.createReadStream(gifPath)
    });
    
    // NE PAS EFFACER LE FICHIER - LE LAISSER DANS LE CACHE
    // Le fichier restera sur le serveur mais c'est OK
    
  } catch (error) {
    console.error("GIF error:", error.message);
    // En cas d'erreur, envoyer le texte sans GIF
    await message.reply(textContent + "\n\n⚡ *TRON ARES SYSTEM* ⚡");
  }
}

module.exports = {
  config: {
    name: "help",
    aliases: ["menu", "cmd", "tronhelp", "ares"],
    version: "5.0.0",
    author: "TRON ARES SYSTEM",
    role: 0,
    category: "System",
    shortDescription: "Affiche les commandes avec style TRON ARES",
    guide: "{pn} | {pn} [commande] | {pn} all",
    countDown: 3
  },

  onStart: async function ({ message, args, event, role }) {
    let prefix = getPrefix(event.threadID);  // CORRIGÉ: const → let
    const input = args.join(" ").trim().toLowerCase();
    
    // Obtenir le nom de l'utilisateur
    let userName = "User";
    try {
      const userInfo = await global.utils.getUserInfo(event.senderID);
      if (userInfo && userInfo.name) {
        userName = userInfo.name;
      }
    } catch (e) {
      console.log("Could not get user info:", e.message);
    }

    // COLLECTER LES COMMANDES PAR CATÉGORIE
    const categories = {};
    
    for (const [cmdName, cmd] of commands) {
      if (!cmd?.config) continue;
      
      // Vérifier les permissions
      if (cmd.config.role > role) continue;
      
      const category = (cmd.config.category || "general").toLowerCase();
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push(cmdName);
    }

    // MODE "all" - TOUTES LES COMMANDES
    if (input === "all") {
      let result = createTronHeader(userName);
      
      // Trier les catégories par ordre alphabétique
      const sortedCategories = Object.keys(categories).sort();
      
      for (const cat of sortedCategories) {
        const catCommands = categories[cat];
        if (catCommands.length === 0) continue;
        
        // Nom de catégorie formaté
        const catName = cat.toUpperCase();
        const emoji = getCategoryEmoji(cat);
        
        let boxContent = "";
        // Limiter à 8 commandes par boîte
        catCommands.slice(0, 8).forEach(cmd => {
          boxContent += `${emoji} ${prefix}${cmd}\n`;
        });
        
        if (catCommands.length > 8) {
          boxContent += `${emoji} ... +${catCommands.length - 8} more\n`;
        }
        
        result += createTronBox(boxContent, `${emoji} ${catName}`) + "\n\n";
      }
      
      const totalCommands = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0);
      result += createTronFooter(prefix, totalCommands);
      
      // Message final
      result += `\n╭═══✨✨✨═══╮
│ ⚡ *TRON ARES DATABASE* ⚡
│ 📊 Total: ${totalCommands} commandes actives
│ ⚡ Système: OPÉRATIONNEL
╰═══✨✨✨═══╯`;
      
      return await sendWithTronGif(message, result);
    }

    // HELP SPÉCIFIQUE (commande)
    if (input) {
      let foundCmd = null;
      let foundCmdName = "";
      
      for (const [cmdName, cmd] of commands) {
        if (!cmd?.config) continue;
        
        if (cmdName.toLowerCase() === input) {
          foundCmd = cmd;
          foundCmdName = cmdName;
          break;
        }
        
        // Vérifier les alias
        if (Array.isArray(cmd.config.aliases)) {
          if (cmd.config.aliases.some(alias => alias.toLowerCase() === input)) {
            foundCmd = cmd;
            foundCmdName = cmdName;
            break;
          }
        }
      }
      
      if (foundCmd) {
        const c = foundCmd.config;
        const aliases = Array.isArray(c.aliases) ? c.aliases.join(", ") : "None";
        const category = c.category || "general";
        const emoji = getCategoryEmoji(category);
        
        let result = createTronHeader(userName);
        
        // Boîte d'information de la commande
        let infoContent = `${emoji} Nom: ${prefix}${foundCmdName}\n`;
        infoContent += `📁 Catégorie: ${category.toUpperCase()}\n`;
        infoContent += `📝 Description: ${c.shortDescription || "Pas de description"}\n`;
        
        if (c.longDescription) {
          infoContent += `🔎 Détails: ${c.longDescription}\n`;
        }
        
        infoContent += `🔤 Alias: ${aliases}\n`;
        infoContent += `👥 Rôle: ${c.role === 0 ? "Tous les utilisateurs" : c.role === 1 ? "Admins de groupe" : "Admin bot"}\n`;
        infoContent += `⏱️ Cooldown: ${c.countDown || 5}s\n`;
        
        if (c.version) {
          infoContent += `🔢 Version: ${c.version}\n`;
        }
        
        if (c.author) {
          infoContent += `👨‍💻 Auteur: ${c.author}\n`;
        }
        
        result += createTronBox(infoContent, "🔍 ANALYSE DE COMMANDE") + "\n\n";
        
        // Guide d'utilisation si disponible
        if (c.guide) {
          let guideText = c.guide;
          if (typeof guideText === 'string') {
            guideText = guideText.replace(/{pn}/g, prefix + foundCmdName);
            result += createTronBox(guideText, "📚 GUIDE D'UTILISATION") + "\n\n";
          }
        }
        
        result += createTronFooter(prefix, 1);
        
        // Message final
        result += `\n╭═══✨✨✨═══╮
│ ⚡ *TRON ARES COMMAND* ⚡
│ 🎮 Statut: ACTIVÉ
│ ⚡ Type: ${category.toUpperCase()}
╰═══✨✨✨═══╯`;
        
        return await sendWithTronGif(message, result);
      }
    }

    /* ========== HELP PRINCIPAL (sans arguments) ========== */
    const totalCommands = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0);
    
    let result = createTronHeader(userName);
    
    // Catégories principales à afficher
    const mainCategories = [
      "anime", "bank", "game", "economy", "fun",
      "media", "utility", "tools", "rpg", "general"
    ];
    
    // Afficher maximum 6 catégories dans le menu principal
    let displayedCount = 0;
    for (const cat of mainCategories) {
      if (displayedCount >= 6) break;
      
      if (categories[cat] && categories[cat].length > 0) {
        const emoji = getCategoryEmoji(cat);
        const catName = cat.toUpperCase();
        
        let boxContent = "";
        // Afficher max 4 commandes par catégorie dans le menu principal
        const displayCommands = categories[cat].slice(0, 4);
        
        displayCommands.forEach(cmd => {
          boxContent += `${emoji} ${prefix}${cmd}\n`;
        });
        
        if (categories[cat].length > 4) {
          boxContent += `${emoji} ... +${categories[cat].length - 4} plus\n`;
        }
        
        result += createTronBox(boxContent, `${emoji} ${catName}`) + "\n\n";
        displayedCount++;
      }
    }
    
    // Boîte de navigation
    const navContent = `🔎 ${prefix}help all → Toutes les commandes\n`;
    navContent += `📖 ${prefix}help [cmd] → Détails d'une commande\n`;
    navContent += `🎮 Exemple: ${prefix}help balance\n`;
    navContent += `📊 Total: ${totalCommands} commandes disponibles`;
    
    result += createTronBox(navContent, "🚀 NAVIGATION RAPIDE") + "\n\n";
    
    // Pied de page
    result += createTronFooter(prefix, totalCommands);
    
    // Message final TRON ARES
    result += `\n╭═══✨✨✨═══╮
│ ⚡ *TRON ARES XMAS SYSTEM* ⚡
│ 💙 TRON ARES envoie des salutations électroniques
│ ⚡ mais sincères. Le futur commence maintenant.
╰═══✨✨✨═══╯`;
    
    return await sendWithTronGif(message, result);
  },

  // NETTOYAGE OPTIONNEL (peut être désactivé)
  onExit: function () {
    // Optionnel: Nettoyer les vieux fichiers une fois par jour
    // Tu peux commenter cette fonction si tu ne veux pas du tout nettoyer
    try {
      const now = Date.now();
      const tempFiles = fs.readdirSync('./cache').filter(file => file.startsWith('tron_ares_help_'));
      
      tempFiles.forEach(file => {
        try {
          const filePath = `./cache/${file}`;
          const stats = fs.statSync(filePath);
          const fileAge = now - stats.mtimeMs;
          
          // Supprimer seulement les fichiers de plus de 24h
          if (fileAge > 24 * 60 * 60 * 1000) {
            fs.unlinkSync(filePath);
          }
        } catch (e) {}
      });
    } catch (error) {
      // Ignorer les erreurs
    }
  }
};
