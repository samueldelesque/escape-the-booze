const accountSid //twilio, required
const authToken //twilio, required

//require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);

const randomFromArray = (arr=[]) => arr[Math.floor(Math.random() * arr.length)]

function sendText(to, message, image=null){
  console.log('Send sms to:', to, message)
  if(!message || !message.length) return //cannot send empty texts
  let msg = {
    To: to,
    From: "(201) 989-1544",
    Body: message,
  }
  if(image) msg.mediaUrl = image
  client.messages.create(msg, function(err, message) {
    if(err){
      console.log('Could not send message', to, message, err)
    }
    else{
      console.log('Message sent', message.sid)
    }
  });
}


let players = []
let challenges = [
  {
    location: 'Locker 38',
    code: 631,
    steps: [
      {
        text: 'LeBron James, world\'s greatest basketball player and humanitarian, was born in which excellent city?',
        validate: /Akron|Ohio|I hate basketball/gi,
      },
      {
        text: 'What time is it in Palo Alto, according to the broken clock on the wall in the back of the office?',
        validate: /1\:5[0-9]|2\:5[0-9]|1\.5[0-9]|2\:5[0-9]/gi,
      },
      {
        text: 'Go to the freight elevator at the end of the office. Find the fire extinguisher. There is a code nearby, what is it?',
        validate: /ace lollipop|ace lolipop/gi,
      },
    ]
  },
  {
    location: 'Locker 40',
    code: 373,
    steps: [
      {
        text: 'What is 29 % 11? (If you don\'t know, as a programmer)',
        validate: /7/gi,
      },
      {
        text: `Who's living room was the dailymotion website created in? `,
        validate: /olivier|poitrey/gi,
      },
    ]
  },
  {
    location: 'Locker 18',
    code: 784,
    steps: [
      {
        text: `What is the answer to the universe and everything? (Ask a geek if you don't know)`,
        validate: /42/gi,
      },
      {
        text: 'Yeah that was easy. Now, how many phones are on the last row of desks by the partner lounge?',
        validate: /2/gi,
      },
    ]
  },
  {
    location: 'a person called Theo. He is wearing an ugly quebequian shirt',
    code: 'voulez vous coucher avec moi?',
    steps: [
      {
        text: `What is the answer to the universe and everything? (Ask a geek if you don't know)`,
        validate: /42/gi,
      },
    ]
  },
  {
    location: 'a person called Theo. He is wearing an ugly quebequian shirt',
    code: 'voulez vous coucher avec moi?',
    steps: [
      {
        text: `What's 2 + 2?`,
        validate: /4|22/gi,
      },
    ]
  },
  {
    location: 'a person called Carl - he is wearing a blue sweater with a deer',
    code: 'Jabronis are phonies',
    steps: [
      {
        text: `Who's living room was the dailymotion website created in? `,
        validate: /olivier|poitrey/gi,
      },
    ]
  },
  {
    location: 'a person called Trisha - she is wearing a red sweater with a chrismas tree',
    code: '666, watch me nay nay',
    steps: [
      {
        text: `Tell me Benoit's age.`,
        validate: /28|29/gi,
      },
    ]
  },
  {
    location: 'a person called Trisha - she is wearing a red sweater with a chrismas tree',
    code: '666, watch me nay nay',
    steps: [
      {
        text: `Who's Linus sister on Charlie brown?`,
        validate: /lucy/gi,
      },
    ]
  },
  {
    location: 'a person called Carl - he is wearing a blue sweater with a deer',
    code: 'Jabronis are phonies',
    steps: [
      {
        text: `How much diggity?`,
        validate: /no/gi,
      },
    ]
  },
]
function savePlayer(player){
  players = players.map(p=>p.phone===player.phone?player:p)
}
function sendChallenge(phone){
  const player = players.find(p=>p.phone===phone)
  const challenge = randomFromArray(challenges.filter(c=>!c.done))
  if(!challenge){
    sendText(phone, 'You have completed all challenges!')
  }
  else{
    savePlayer({...player, currentChallenge: challenge})
    sendText(phone, challenge.steps[0].text)
  }
}

function sendSmsResponse(res, text){
  console.log('Send sms', text)
  let sms = new twilio.TwimlResponse()
  sms.message(text)
  setTimeout(()=>res.send(sms.toString()), 400)
}

const samPhone //private
const benoitPhone //private
const louisPhone //private
const trishaPhone //private
const andyPhone //private
const arjumnPhone //private
let benoit = {
  init: false,
  steps: [
    {
      text: 'Ready?',
      validate: /yes/gi,
    },
    {
      text: 'Find the guy who’s crushing it. What christmas character is on his shirt?',
      validate: /nutcracker/gi,
    },
    {
      text: 'Good. What famous 3 words did Julien Charrel say repeatly to Benoit during his farewell party?',
      validate: /fuck you benoit/gi,
    },
    {
      text: 'Go to Martin’s old office. Look under the desk and you’ll find a note. Tell me what’s written.',
      validate: /starcraft/gi,
    },
    {
      text: 'Go to locker 1. Take the shot and tell me the number on the bottom of the glass.',
      validate: /16/gi,
    },
    {
      text: 'Find the prize you were given for being the ultimate ping pong champion. What is the nickname written underneath?',
      validate: /yes|no/gi,
    },
    {
      text: 'Have you ever taken drugs at the office?',
      validate: /yes|no/gi,
    },
  ]
}
let louis = {
  init: false,
  steps: [
    {
      text: 'Ready?',
      validate: /yes/gi,
    },
    {
      text: 'Find a picture of Vincent near the Partner Solution desks. Tell me what you find behind.',
      validate: /captain diet/gi,
    },
    {
      text: 'There are two christmas stockings near the main kitchen. Find the note hidden in one of them and tell me what it says.',
      validate: /miss you/gi,
    },
    {
      text: 'Tricks or Kicks?',
      validate: /trick/gi,
    },
    {
      text: 'Go to locker 21. Take the shot and tell me the number on the bottom of the glass.',
      validate: /32/gi,
    },
  ]
}

function benoitChallenge(res, text){
  const steps = benoit.steps.filter(s=>!s.done)
  if(!benoit.init){
    benoit.init = true
    return sendSmsResponse(res, `Hi Benoit. Welcome to the hunt. Are you ready?`)
  }
  if(!steps){
    return sendSmsResponse(res, `It's finished. Go home.`)
  }
  else{
    if(steps[0].validate && steps[0].validate.test(text)){
      steps[0].done = true
      if(steps.length === 1){
        setTimeout(()=>sendText(benoitPhone, 'Come on, off you go!'), 2000)
        setTimeout(()=>sendText(benoitPhone, 'Good job! Now look behind your screen.'), 50000)
        setTimeout(()=>sendText(benoitPhone, 'Nice isn\'t it? You can come and pick it up next week. And you better beat those damn starcrafters now.'), 62000)
        sendText(samPhone, `Benoit completed his challenge. Meet him at Eric's office`)
        sendText(trishaPhone, `Benoit completed his challenge. Meet him at Eric's office`)
        sendText(andyPhone, `Benoit completed his challenge. Meet him at Eric's office`)
        sendText(arjumnPhone, `Benoit completed his challenge. Meet him at Eric's office`)
        return sendSmsResponse(res, `Congrats! Now go to your office. You have 1 min.`)
      }
      else{
        return sendSmsResponse(res, `${steps[1].text}`)
      }
    }
    else{
      console.log(steps[0].text, text)
      return sendSmsResponse(res, `Try again.`)
    }
  }
}
function louisChallenge(res, text){
  const steps = louis.steps.filter(s=>!s.done)
  if(!louis.init){
    louis.init = true
    return sendSmsResponse(res, `Hi Louis. Welcome to the hunt. Are you ready?`)
  }
  if(!steps){
    return sendSmsResponse(res, `It's finished. Go home.`)
  }
  else{
    if(steps[0].validate && steps[0].validate.test(text)){
      steps[0].done = true
      if(steps.length === 1){
        setTimeout(()=>sendText(louisPhone, 'Come on, off you go!'), 2000)
        setTimeout(()=>sendText(louisPhone, 'Good job! Now find Trump. I heard he is celebrating your departure with a bottle.'), 30000)
        sendText(samPhone, `Louis completed his challenge. Meet him at Eric's office`)
        sendText(trishaPhone, `Louis completed his challenge. Meet him at Eric's office`)
        sendText(andyPhone, `Louis completed his challenge. Meet him at Eric's office`)
        sendText(arjumnPhone, `Louis completed his challenge. Meet him at Eric's office`)
        return sendSmsResponse(res, `Congrats! Now run to Eric's office. You have 1 min.`)
      }
      else{
        return sendSmsResponse(res, `${steps[1].text}`)
      }
    }
    else{
      console.log(steps[0].text, text)
      return sendSmsResponse(res, `Try again.`)
    }
  }
}

app.post('/sms_game', (req, res) => {
  const phone = req.body.From
  const player = players.find(p=>p.phone===phone)
  const text = req.body.Body
  console.log('Incoming text', req.body.From, req.body.Body)

  if(phone === louisPhone) return louisChallenge(res, req.body.Body)
  if(phone === benoitPhone) return benoitChallenge(res, req.body.Body)

  if(!player){
    players.push({
      phone,
      screenname: null,
      accomplishments: [],
      currentChallenge: null,
    })
    setTimeout(()=>sendChallenge(phone), 4000)
    return sendSmsResponse(res, 'Hello and welcome to Escape the Booze. You have now enterred the game. You can skip a quiestion by typing "reset".')
  }

  if(text.match(/quit|stop|reset/gi)){
    savePlayer({...player, currentChallenge: null})
    setTimeout(()=>sendChallenge(phone), 4000)
    return sendSmsResponse(res, 'OK - I am sorry you were too dumb for this question. Let\'s try another one.')
  }

  else if(player.currentChallenge){
    const steps = player.currentChallenge.steps.filter(s=>!s.done)
    if(!steps){
      savePlayer({...player, currentChallenge: null, accomplishments: player.accomplishments.concat(player.currentChallenge.code)})
      return sendSmsResponse(res, `Congrats! You can go to ${player.currentChallenge.location} and open with the code ${player.currentChallenge.code}.`)
    }
    else{
      if(steps[0].validate && steps[0].validate.test(text)){
        savePlayer({...player, currentChallenge: {...player.currentChallenge, steps: player.currentChallenge.steps.map(s=>{
          if(s.text === steps[0].text){
            return {...s, done: true}
          }
          return s
        })}})
        if(steps.length === 1){
          savePlayer({...player, currentChallenge: null, accomplishments: player.accomplishments.concat(player.currentChallenge.code)})
          challenges = challenges.map(c => {
            if(c.code === player.currentChallenge.code){
              return {
                ...c,
                done: true,
              }
            }
            return c
          })
          return sendSmsResponse(res, `Congrats! You can go to ${player.currentChallenge.location} and open give the code ${player.currentChallenge.code}.`)
        }
        else{
          return sendSmsResponse(res, `Well done. Now, tell me... ${steps[1].text}`)
        }
      }
      else{
        console.log('Could not resolve challenge.', text, steps[0].text)
        return sendSmsResponse(res, `Try again.`)
      }
    }
  }
  else{
    sendChallenge(phone)
  }
})
