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

// Esta función mapea una lista de números de teléfono a una cadena que incluye tanto los números de teléfono como los nombres de usuario (si están disponibles)
function phoneList(phoneList, userData) {
  const list = Object.values(phoneList).map(phone => {
    const user = userData[phone];
    if (user) {
      return `${phone} (@${user})`;
    } else {
      return phone;
    }
  });
  return list.join(', ');
}

module.exports = {
  phoneList
};
