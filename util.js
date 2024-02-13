export default {
  phoneList: function (list) {
    return list.map((item) => {
      const contact = client.getContactById(item); // Assuming client.getContactById() is a function to get contact details by ID
      const phoneNumber = item.replace('@c.us', '');
      const user = contact ? `@${contact.id.user}` : ''; // Get user if contact exists
      return `${user} (${phoneNumber})`;
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
