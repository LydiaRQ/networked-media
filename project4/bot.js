//import env outside
require("dotenv").config();

//import maston library to interface with our mastodon server
const m = require("masto")
const masto = m.createRestAPIClient({
    url: "https://networked-media.itp.io/",
    accessToken: process.env.TOKEN,
})

const stream = m.createStreamingAPIClient({
    accessToken: process.env.TOKEN,
    streamingApiUrl: "wss://networked-media.itp.io", // special url we use for sockets
  });
let lastReplyTime = 0;
let mood = ["It's time to eat something","Are you hungry?","Do you feel like having a snack?","How about taking a bite?","Maybe it's time to eat."]
const food = [
    "Spaghetti Carbonara",
    "Beef Wellington",
    "Chicken Tikka Masala",
    "Pad Thai",
    "Tacos al Pastor",
    "Sushi Platter",
    "Margherita Pizza",
    "Eggplant Parmesan",
    "Lamb Rogan Josh",
    "Pho Ga",
    "Baked Ziti",
    "Pulled Pork Sandwich",
    "Ramen Tonkotsu",
    "Bibimbap",
    "Falafel with Hummus",
    "Grilled Cheese Sandwich",
    "Fish and Chips",
    "Peking Duck",
    "Paella Valenciana",
    "Lasagna Bolognese"
];

async function makeStatus(text){
    const status= await masto.v1.statuses.create({
        status: text,
        visibility: "public"
    })
}

function getRandomFood(){
    const index = Math.floor(Math.random()*food.length);
    return food[index]
}

async function reply() {
    // finding the specific route to watch for notifications
    // based off the stream client and the notification path
    const notificationSubscription = await stream.user.notification.subscribe();
  
    // makes sure objects exist in the returned obj before going through array
    for await (let notif of notificationSubscription) {
  
      // printing the structure to the console to see how to access data
      // console.log(notif.payload.type);
  
      // local variables for each piece of data i want
      let type = notif.payload.type;
      let acct = notif.payload.account.acct;
      let replyId = notif.payload.status.id;
  
      const currentTime = Date.now();
      // if the type of notification is a mention
      if (type === "mention" && (currentTime-lastReplyTime)>1000) {
        const replyFood = getRandomFood();

          // create a status
        await masto.v1.statuses.create({
          status: `@${acct} ${replyFood}`,    // reply to user that originally mentioned
          visibility: "public",
          in_reply_to_id: replyId,        // id # of the mention post so that you reply in the thread
        });
        lastReplyTime = currentTime;
      }
    }

  }
  
  reply();

function multipleStatuses(){
    let ran = Math.floor(Math.random()*mood.length)
    let post = mood[ran]
    makeStatus(post)
}

setInterval(multipleStatuses,360000)