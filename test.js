import test from 'ava'
import spam from './spam.js'
import games from './games.js'
import planner from './planner.js'
import util from './util.js'

test('it counts emoji in a string', (t) => {
  t.is(0, spam.countEmojis('Lorem ipsum dolor'))
  t.is(2, spam.countEmojis('📖 in here 📖 in there'))
})

test('it scores long messages', async (t) => {
  t.is(10, spam.getSpamScore('Lorem ipsum dolor'.repeat(200)))
})

test('it scores too many line breaks', async (t) => {
  t.is(10, spam.getSpamScore('Lorem\n\n\n\n\n\n\n\n\n\n\n'))
})

test('it scores suspicious URLs', async (t) => {
  t.is(10, spam.getSpamScore('Hey join http://www.blah.com'))
})

test('it scores chat invitations', async (t) => {
  t.is(15, spam.getSpamScore('Hey join http://chat.whatsapp.com'))
})

test('it scores too much emoji', async (t) => {
  t.is(10, spam.getSpamScore('📖 in here 📖 in there'.repeat(5)))
})

test('it scores spammy words', async (t) => {
  t.is(10, spam.getSpamScore('Hey join invest'))
})

test('it scores more spammy words', async (t) => {
  t.is(
    35,
    spam.getSpamScore(
      'Book for exams, assignments and tests early as were currently taking a few bookings\r\n\r\n\r\nFOR ASSIGNMENT AND EXAMS HELP CLICK THE LINK BELOW OR DM US IN INSTAGRAM @annete_barry the spammer 📖📖📖📖📖📖📖\r\n\r\nhttps://linktr.ee/peekay'
    )
  )
})

test('it does not overscore spammy words without context', async (t) => {
  t.is(10, spam.getSpamScore('Hey dm us on instagram its cool'))
})

test('it detects suspicious emoji', async (t) => {
  t.is(true, spam.isSuspicious('Hey dm us on for 🍬🔌 its lit'))
})

test('it detects suspicious keywords', async (t) => {
  t.is(true, spam.isSuspicious('Hey dm us on for candy its lit'))
})

test('it generates magic ball', async (t) => {
  t.regex(games.magicBall(), /\w+/)
})

test('it generates advice', async (t) => {
  t.regex(games.advice(), /\w+/)
})

test('it generates facts', async (t) => {
  t.regex(games.fact(), /\w+/)
})

test('it generates jokes', async (t) => {
  t.regex(games.joke(), /\w+/)
})

test('it creates phone lists', async (t) => {
  t.is(
    '123456789, 123456788',
    util.phoneList(['123456789@c.us', '123456788@c.us'])
  )
})

test('it creates karma lists', async (t) => {
  t.is(
    '123456789: 10\n123456788: 40',
    util.karmaList({ '123456789@c.us': 10, '123456788@c.us': 40 })
  )
})

test('it gets a forecast', async (t) => {
  t.regex(await planner.getForecast(), /precipitation/)
})
