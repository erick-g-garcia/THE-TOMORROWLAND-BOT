export default {
  phoneList: function (list) {
    return list.map((item) => item.replace('@c.us', `@${contact.id.user}`)).join(', ');

  },

  karmaList: function (list) {
    var items = []
    Object.keys(list).forEach((phone) => {
      items.push(`${phone.replace('@c.us', '')}: @${contact.id.user} `)
    })

    return items.join('\n')
  },
}
