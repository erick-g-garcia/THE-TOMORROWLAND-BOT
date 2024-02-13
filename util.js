export default {
  phoneList: function (list, userData) {
    const formattedList = list.map((item) => {
      const user = userData[item];
      if (user) {
        return `${item} (@${user})`;
      } else {
        return item;
      }
    });
    return formattedList.join(', ');
  },

  karmaList: function (list, userData) {
    var items = []
    Object.keys(list).forEach((phone) => {
      const user = userData[phone];
      if (user) {
        items.push(`@${user}: ${list[phone]}`);
      } else {
        items.push(`${phone}: ${list[phone]}`);
      }
    });

    return items.join('\n');
  }
};
