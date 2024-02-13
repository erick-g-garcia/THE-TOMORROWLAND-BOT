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

  if (message.body.match(/(!test)/gi) && isVip) {
    message.reply('Up and working Boss 🤖');
      
  }

  if (message.body.match(/(fuck robert)/gi)) {
    message.reply('No, Fuck you');
  }
  


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
