export default {
  phoneList: function (contactList) {
    return contactList.map((contact) => {
      const phoneNumber = contact.phoneNumber.replace('@c.us', '');
      const userId = contact.userId;
      return `${phoneNumber} (ID: ${userId})`;
    }).join(', ');
  },

  karmaList: function (list) {
    var items = []
    Object.keys(list).forEach((phone) => {
      items.push(`${phone.replace('@c.us', '')}: ${list[phone]}`)
    })

    return items.join('\n')
  },
}
