import config from './config.js';
import spam from './spam.js';
import games from './games.js';
import images from './images.js';
import util from './util.js';
import planner from './planner.js';
import qrcode from 'qrcode-terminal';
import pkg from 'whatsapp-web.js';
import { spawn } from 'child_process';
import OpenAI from "openai";
const { Client, LocalAuth, Buttons, List, MessageMedia } = pkg;

function calculateRemainingTime(targetDate) {
    const currentDate = new Date();
    const currentTimezoneOffset = currentDate.getTimezoneOffset();
    const currentOffsetMilliseconds = currentTimezoneOffset * 60 * 1000;
    const targetTimezoneOffset = -60; // CET is UTC+1
    const targetOffsetMilliseconds = targetTimezoneOffset * 60 * 1000;
    const totalOffsetMilliseconds = targetOffsetMilliseconds - currentOffsetMilliseconds;
    const remainingTime = targetDate.getTime() - currentDate.getTime() + totalOffsetMilliseconds;
    const remainingDays = Math.floor(remainingTime / (1000 * 3600 * 24));
    const remainingHours = Math.floor((remainingTime % (1000 * 3600 * 24)) / (1000 * 3600));
    const remainingMinutes = Math.floor((remainingTime % (1000 * 3600)) / (1000 * 60));
    return { days: remainingDays, hours: remainingHours, minutes: remainingMinutes };
}

const client = new Client({
  authStrategy: new LocalAuth(),
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/110.0',
});

client.on('qr', (qr) => {
  console.log('QR Code received:', qr);
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('Chop chop. Client is ready!');
});

client.on('message', async (message) => {
  console.log('Received message:', message);

  const author = message.author || message.from;
  const isVip = config.vips.includes(author);

// Función para enviar el informe al modroom
async function sendReport() {
    let map = {};
    const chats = await client.getChats();

    // Bucle para encontrar comunidades
    for (const chat of chats) {
        if (chat.groupMetadata && chat.groupMetadata.isParentGroup) {
            let groupId = chat.id._serialized;

            map[groupId] = {
                name: chat.name,
                members: [],
            };

            for (const participant of chat.participants) {
                map[groupId]['members'].push(participant.id._serialized);
            }
        }
    }

    // Bucle para encontrar anuncios
    for (const chat of chats) {
        if (chat.groupMetadata && chat.groupMetadata.announce) {
            let groupId = chat.id._serialized;
            let parentId = chat.groupMetadata.parentGroup._serialized;

            if (!map[parentId]) {
                continue;
            }

            map[parentId]['inAnnouncements'] = [];

            for (const participant of chat.participants) {
                map[parentId]['inAnnouncements'].push(participant.id._serialized);
            }
        }
    }

    // Comparar miembros y miembros en anuncios y enviar el informe al modroom
    for (const communityId in map) {
        const community = map[communityId];
        console.log(community.name);

        const difference = community.members.filter((member) => !community.inAnnouncements.includes(member));
        console.log('Difference: ', difference);

        if (difference.length > 0) {
            const message = `Los siguientes miembros no están en el grupo de anuncios de ${community.name}: ${difference.join(', ')}`;
            await client.sendMessage((config.modRoom), message); // Reemplazar <modroom-number> con el número del modroom
        }
    }
}

    
//Pruebas y test

  if (message.body.match(/(!test)/gi) && isVip) {
    message.reply('Up and working Boss 🤖');
      
  }

  if (message.body.match(/(fuck robert)/gi)) {
    message.reply('No, Fuck you');
  }

     //Countdown command

if (message.body.match(/!countdown/gi)) {
     // Get the current date and time when the command is triggered
     const currentDate = new Date();
     const currentFormattedTime = currentDate.toLocaleString('en-US', { timeZone: 'CET', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false });
     console.log(`Command "!countdown" triggered at: ${currentDate.toLocaleString()} (${currentFormattedTime} CET)`);

     const currentYear = currentDate.getFullYear();
     const targetDate1 = new Date(Date.UTC(currentYear, 6, 19, 15, 0, 0)); // July 19 of the current year, at 17:00 (5:00 PM) CET
     const targetDate2 = new Date(Date.UTC(currentYear, 6, 26, 15, 0, 0)); // July 26 of the current year, at 17:00 (5:00 PM) CET

     if (currentDate.getMonth() > 6 || (currentDate.getMonth() === 6 && currentDate.getDate() > 19)) {
         targetDate1.setUTCFullYear(currentYear + 1);
     }

     if (currentDate.getMonth() > 6 || (currentDate.getMonth() === 6 && currentDate.getDate() > 26)) {
         targetDate2.setUTCFullYear(currentYear + 1);
     }

     console.log(`Current Date: ${currentDate.toLocaleString()} (${currentFormattedTime} CET)`);
     console.log(`Target Date 1: ${targetDate1.toLocaleString()} CET`);
     console.log(`Target Date 2: ${targetDate2.toLocaleString()} CET`);

     const { days: days1, hours: hours1, minutes: minutes1 } = calculateRemainingTime(targetDate1);
     const messageTime1 = targetDate1.toLocaleString('en-US', { timeZoneName: 'short', hour: 'numeric', minute: 'numeric', hour12: true });
     const messageText1 = `There are ${days1} days, ${hours1} hours, and ${minutes1} minutes left until Tomorrowland W1 (July 19, 2024, 5:00 PM CET).`;


     const { days: days2, hours: hours2, minutes: minutes2 } = calculateRemainingTime(targetDate2);
     const messageTime2 = targetDate2.toLocaleString('en-US', { timeZoneName: 'short', hour: 'numeric', minute: 'numeric', hour12: true });
     const messageText2 = ` There are ${days2} days, ${hours2} hours, and ${minutes2} minutes left until Tomorrowland W2 (July 26, 2024, 5:00 PM CET).`;

     const combinedMessage = `${messageText1}\n\&\n${messageText2}`;

     await client.sendMessage(message.from, combinedMessage);
}
     
   //Mensajes que necesitan mencionc
    
  if (message.mentionedIds.includes(config.me)) {
    
    if (message.body.match(/(hello)/gi)) {
      message.reply('Hi');
    }

    if (message.body.match(/(do you like sara?)/gi)) {
      message.reply('You better punch me in the face 😒');
    }

    if (message.body.match(/(thank you)/gi)) {
      message.reply('welcome');
    }
}

  if (message.body.startsWith('!delete') && isVip) {
    message.delete(true)
    return
  }

  if (message.body.startsWith('!karma') && isVip) {
    client.sendMessage(
      config.modRoom,
      `Karma:

${util.karmaList(config.karma)}`
    )

    return
  }



  if (message.body.startsWith('!clear') && isVip) {
    if (message.hasQuotedMsg) {
      const flaggedMessage = await message.getQuotedMessage()
      const flaggedAuthor = flaggedMessage.author || flaggedMessage.from
      delete config.karma[flaggedAuthor]
    }

    message.mentionedIds.forEach((mention) => {
      delete config.karma[mention]
    })

    return
  }

 if (message.body.startsWith('!status') && isVip) {
    client.sendMessage(
      config.modRoom,
      `Yo! I'm up and running.

Blacklisted: ${util.phoneList(config.blacklist)}
Mute: ${util.phoneList(config.mutelist)}
Trusted: ${util.phoneList(config.trustlist)}
Vips: ${util.phoneList(config.vips)}
`
    )

    return
  }


  if (message.body.startsWith('!flag') && isVip) {
    if (message.hasQuotedMsg) {
      const flaggedMessage = await message.getQuotedMessage()
      const flaggedAuthor = flaggedMessage.author || flaggedMessage.from
      console.error('Flagged: ', {
        body: flaggedMessage.body,
        author: flaggedAuthor,
      })
      flaggedMessage.delete(true)
      config.blacklist.push(flaggedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.blacklist.push(mention)
    })

    console.log('Blacklist:', config.blacklist)

    return
  }

  if (message.body.startsWith('!unflag') && isVip) {
    if (message.hasQuotedMsg) {
      const flaggedMessage = await message.getQuotedMessage()
      const flaggedAuthor = flaggedMessage.author || flaggedMessage.from
      config.blacklist = config.blacklist.filter((user) => user != quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.blacklist = config.blacklist.filter((user) => user != mention)
    })

    console.log('Blacklist:', config.blacklist)

    return
  }

  if (message.body.startsWith('!mute') && isVip) {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage()
      const quotedAuthor = quotedMessage.author || quotedMessage.from
      quotedMessage.delete(true)
      config.mutelist.push(quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.mutelist.push(mention)
    })

    console.log('Mutelist:', config.mutelist)

    return
  }
  if (message.body.startsWith('!vip') && isVip) {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage()
      const quotedAuthor = quotedMessage.author || quotedMessage.from
      quotedMessage.delete(false)
      config.vips.push(quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.vips.push(mention)
    })

    console.log('Vips:', config.vips)

    return
  }

  if (message.body.startsWith('!unmute') && isVip) {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage()
      const quotedAuthor = quotedMessage.author || quotedMessage.from
      config.mutelist = config.mutelist.filter((user) => user != quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.mutelist = config.mutelist.filter((user) => user != mention)
    })

    console.log('Mutelist:', config.mutelist)

    return
  }

  if (message.body.startsWith('!trust') && isVip) {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage()
      const quotedAuthor = quotedMessage.author || quotedMessage.from
      quotedMessage.delete(true)
      config.trustlist.push(quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.trustlist.push(mention)
    })

    console.log('Trustlist:', config.trustlist)

    return
  }

  if (message.body.startsWith('!untrust') && isVip) {
    if (message.hasQuotedMsg) {
      const quotedMessage = await message.getQuotedMessage()
      const quotedAuthor = quotedMessage.author || quotedMessage.from
      config.trustlist = config.trustlist.filter((user) => user != quotedAuthor)
    }

    message.mentionedIds.forEach((mention) => {
      config.trustlist = config.trustlist.filter((user) => user != mention)
    })

    console.log('Trustlist:', config.trustlist)

    return
  }

  if ((!isVip) && spam.isSuspicious(message.body)) {
    const chat = await message.getChat()
    const contact = await message.getContact()

    config.karma[author] = (config.karma[author] || 0) + 10

    client.sendMessage(
      config.modRoom,
      `⛔ WARNING! ⛔ @${contact.id.user} (Karma: ${config.karma[author]}), has sent messages with suspicious content to "${chat.name}".`,
      { mentions: [contact] }
    )
  }

  if (isVip) {
    return
  }
  if (config.blacklist.includes(author)) {
    message.delete(true)

    return
  }

  if (config.mutelist.includes(author)) {
    message.delete(true)
    return
  }

  if (config.trustlist.includes(author)) {
    return
  }



  var spamScore = spam.getSpamScore(message.body)

  if (author.startsWith('254')) {
    spamScore += 100
  }

  if (spamScore >= 20) {
    message.delete(true)
    config.karma[author] = (config.karma[author] || 0) + spamScore
    const contact = await message.getContact()
    client.sendMessage(
      config.modRoom,
      `I have deleted a message from @${contact.id.user}, with a spam score of ${spamScore}:

${message.body}
`,
      { mentions: [contact] }
    )
  }
});


client.on('message', async (message) => {
  console.log('Received message:', message);

  const author = message.author || message.from;
  const karmaThreshold = 100;

  console.log(`Author: ${author}, Karma: ${config.karma[author] || 0}`);

  if (config.karma[author] === 30) {
    const senderContact = await message.getContact();
    const responseMessage = `Hey @${senderContact.id.user}! Your karma level has reached "30" for sending messages with inappropriate content. If your karma reaches level "100" you will be removed from the group. 
If you think it is a mistake, send a message to an admin to clear your karma level.✌️😎`;

    client.sendMessage(message.from, responseMessage, { mentions: [senderContact] });
  }
  
  if (config.karma[author] === 80) {
    const senderContact = await message.getContact();
    const responseMessage = `Hey @${senderContact.id.user}! 😰😰 its me again, your karma level has now reached "80" for sending messages with inappropriate content. If your karma reaches level "100" you will be removed from the group. ⚠️
If you think it is a mistake, send a message to an admin to clear your karma level.✌️😎`;

    
    client.sendMessage(message.from, responseMessage, { mentions: [senderContact] });
  }


  if (config.karma[author] >= karmaThreshold || author.startsWith('254') || author.startsWith('92')) {
  const senderContact = await message.getContact();
    
    try {
      console.log('Before getting the group');
      const group = await message.getChat();
      console.log('Group obtained:', group);

      console.log('Before removing participant');
      await group.removeParticipants([author]);
      console.log('Participant removed');
      
     
      const modroom = await client.getChatById(config.modRoom); 
      const chat = await message.getChat(); 
      const contact = await message.getContact(); 

      await modroom.sendMessage(`@${contact.id.user} has been removed from "${chat.name}" by Robert for reaching the karma limit. 💪😎`,
        { mentions: [contact] }
      );

      console.log(`User ${author} removed by ${senderContact.number}`);
      return;
    } catch (error) {
      console.error('Error:', error);
    }
  }
});

client.initialize();
