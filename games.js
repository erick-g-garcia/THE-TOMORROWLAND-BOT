import advices from './games/advices.js'
import facts from './games/facts.js'
import jokes from './games/jokes.js'

export default {
  magicBall: function () {
    var answers = [
      'It is certain.',
      'It is decidedly so.',
      'Without a doubt.',
      'Yes, definitely.',
      'You may rely on it.',
      'As I see it, yes.',
      'Most likely.',
      'Outlook good.',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now....',
      "Don't count on it.",
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubtful.',
    ]

    return answers[Math.floor(Math.random() * answers.length)] || 'Maybe.'
  },

  advice: function () {
    return advices[Math.floor(Math.random() * advices.length)] || 'Live.'
  },

  fact: function () {
    return facts[Math.floor(Math.random() * facts.length)] || 'Peanut butter.'
  },

  joke: function () {
    return jokes[Math.floor(Math.random() * jokes.length)] || 'Fart.'
  },
}
