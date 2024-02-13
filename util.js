export default {
  phoneList: function (contactList) {
    return contactList.map((contact) => {
      const item = contact.item.replace('@c.us', '');
      const userId = contact.userId;
      return `${item} (ID: ${userId})`;
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
