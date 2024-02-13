export default {
  phoneListWithContactId: function (list) {
    return list.map((item) => {
      const [phone, contactId] = item.split('@c.us');
      return { phone: phone.trim(), contactId: contactId.trim() };
    });
  },

  phoneList: function (list) {
    return list.map(item => item.phone).join(', ');
  },

  contactIdList: function (list) {
    return list.map(item => item.contactId).join(', ');
  },

  karmaList: function (list) {
    var items = [];
    Object.keys(list).forEach((phone) => {
      items.push(`${phone.replace('@c.us', '')}: ${list[phone]}`);
    });

    return items.join('\n');
  },
};


