var express = require('express');

var router = express.Router();

const groupChatsStore = {};

module.exports = whatsAppClient => {
  router.get('/', async (req, res, next) => {
    const chats = await whatsAppClient.getChats();

    const groupChats = chats.filter(chat => chat.isGroup);
    groupChats.forEach(groupChat => {
      groupChatsStore[groupChat.name] = groupChat;
    });

    res.render('chats', { groupChats });
  });

  router.get('/group/:groupName', async (req, res) => {
    const { groupName } = req.params;

    const groupChat = groupChatsStore[groupName];
    const { participants } = groupChat;

    const contacts = (
      await Promise.all(
        participants.map(participant =>
          whatsAppClient.getContactById(participant.id._serialized)
        )
      )
    ).filter(contact => !contact.isMe);

    res.render('participants', {
      groupName,
      participants: contacts,
    });
  });

  router.post('/group/:groupName', async (req, res) => {
    const { params, body } = req;
    const { groupName } = params;
    const { text } = body;

    const groupChat = groupChatsStore[groupName];
    const { participants } = groupChat;

    const contacts = (
      await Promise.all(
        participants.map(participant =>
          whatsAppClient.getContactById(participant.id._serialized)
        )
      )
    ).filter(contact => !contact.isMe);

    await Promise.all(
      contacts.map(contact => {
        whatsAppClient.sendMessage(
          contact.id._serialized,
          text.replace('${name}', contact.pushname || contact.name)
        );
      })
    );

    res.send('ok');
  });

  return router;
};
