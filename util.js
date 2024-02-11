export default {
  phoneList: function (list) {
    return list.map((item) => item.replace('@c.us', '')).join(', ')
  },

  karmaList: function (list) {
    var items = []
    Object.keys(list).forEach((phone) => {
      items.push(`${phone.replace('@c.us', '')}: ${list[phone]}`)
    })

    return items.join('\n')
  },
}
