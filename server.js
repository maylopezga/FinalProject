var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var moment = require('moment');
const http = require('http');

var event = "";

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (request, response) => {
  response.sendStatus(200);
});

  // var myText = getNotification();
  // setInterval(() => {
  //   console.log('m: ', event);
  //   event = getMessage();
  //   console.log('m2: ', event);
  // }, 8000)
              
  setInterval(() => {
    console.log('This is');
    event = getMessage();
    // const mytext = getNotification();
    // ll;;;;
    request.post('https://hooks.slack.com/services/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', {
      json: event
    }, 
     
    (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      console.log(body)
    })
    console.log('.....');
  }, 60000);


  app.post("/", function (req, res) {
    console.log('Hi');
    const reply = {};
    const attachment = {};
    reply.text = 'Hey '
    res.send('hi');
    // const opt = {
    //   uri: 'https://hooks.slack.com/services/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',
    //   method: 'POST'
    //   body: 
    // }
    // getNotifications()
    //   .then(events => {
    //        if(events.length == 0){
    //          reply.text = 'No Meetups found in  :sleuth_or_spy: .\nMake sure the location you entered is correct and try again.:slightly_smiling_face:';
    //          return res.json(reply);
    //        }
    //        reply.text = 'Hey ,\nThis is the list of the envens.\nIf you want to go the event, click in the name of event and confirm the assistance in Meetup';
    //        events.forEach(event => {
    //          var status = (event.status != undefined) ? ('Status - '+event.status) : 'Status - visible only to Members';
    //          var date = new Date(event.time + event.utc_offset);
    //          date = moment(date).format('lll');
    //          var venue = (event.venue != undefined) ? event.venue.address_1 : 'Only visible to members';
    //          attachment.push({
    //            title: 'Group - '+event.group.name,
    //            text: '<'+event.link+'| Event - '+event.name+'>',
    //            author_name: status,
    //            title_link: 'https://www.meetup.com/'+event.group.urlname,
    //            color: "#764FA5",
    //            fields: [
    //              { "title": "Date", "value": date, "short": true },
    //              { "title": "Venue", "value": venue, "short": true },
    //              { "title": "RSVP Count", "value": event.yes_rsvp_count, "short": true }
    //            ]
    //          });
    //        });
    //        reply.attachments = attachment;
    //        return res.json(reply);
    //     })
    //      .catch(e => {
    //        console.log("Occured an error in getEvent. " + e);
    //        return res.json({text: 'Ops Occurred an error. Please try again'});
    //     });
  })

/*
* /hello_mybot calls the meetupbot and response is a greeting along
*/
app.post('/meetupbot', function (req, res) {
  var userName = req.body.user_name;
  var attachment=[];
  var reply = {};
  var nameMeetup = 'node_co';
  
  var reply = {
    "text": "Hello, " +userName+ " I am a MeetupBot. I show list of meetups.\n Try following command :",
    "attachments": [
       {
         title: '/next-event',
         text: 'use this to find meetup-events.',
         color: '#764FA5'
       }
    ]
  };
  res.json(reply);
});

/* 
* /next_event call the next-event and response a list of following events
*/
app.post('/next-event', function (req, res) {
    var userName = req.body.user_name;
    var attachment=[];
    var reply = {};
    var nameMeetup = 'node_co';
  
    getEvents(nameMeetup)
      .then(events => {
           if(events.length == 0){
             reply.text = 'No Meetups found in  :sleuth_or_spy: .\nMake sure the location you entered is correct and try again.:slightly_smiling_face:';
             return res.json(reply);
           }
           reply.text = 'Hey '+userName+',\nThis is the list of the envens.\nIf you want to go the event, click in the name of event and confirm the assistance in Meetup';
           console.log('m.m');
           events.forEach(event => {
             var status = (event.status != undefined) ? ('Status - '+event.status) : 'Status - visible only to Members';
             var date = new Date(event.time + event.utc_offset);
             date = moment(date).format('lll');
             var venue = (event.venue != undefined) ? event.venue.address_1 : 'Only visible to members';
             attachment.push({
               title: 'Group - '+event.group.name,
               text: '<'+event.link+'| Event - '+event.name+'>',
               author_name: status,
               title_link: 'https://www.meetup.com/'+event.group.urlname,
               color: "#764FA5",
               fields: [
                 { "title": "Date", "value": date, "short": true },
                 { "title": "Venue", "value": venue, "short": true },
                 { "title": "RSVP Count", "value": event.yes_rsvp_count, "short": true }
               ]
             });
           });
           reply.attachments = attachment;
           return res.json(reply);
        })
         .catch(e => {
           console.log("Occured an error in getEvent. " + e);
           return res.json({text: 'Ops Occurred an error. Please try again'});
        });
  });
    
async function getMessage() {
  let reply = {};
  let attachment = {};
  let myActualTime = moment();
  // actualTime = new Date(actualTime+ event.utc_offset);
  console.log(myActualTime);
  event = await getEvents('node_co');
  console.log(typeof event)
  if (event.length === 0){
    event = 'There are not events';
  } else {
    reply.text = 'The next event is...'
    event.forEach(event => {
      const actualTime = new Date (myActualTime + event.utc_offset);
      console.log(actualTime);
      const dateEvent = new Date(event.time + event.utc_offset);
      console.log(dateEvent);
      if (dateEvent > actualTime) {
        var status = (event.status != undefined) ? ('Status - '+event.status) : 'Status - visible only to Members';
        var venue = (event.venue != undefined) ? event.venue.address_1 : 'Only visible to members';
        console.log('Es mayor');
        console.log('Es mayor');
        attachment = {
         title: 'Group - '+event.group.name,
         text: '<'+event.link+'| Event - '+event.name+'>',
         author_name: status,
         title_link: 'https://www.meetup.com/'+event.group.urlname,
         color: "#764FA5",
         fields: [
           { "title": "Date", "value": dateEvent, "short": true },
           { "title": "Venue", "value": venue, "short": true },
           { "title": "RSVP Count", "value": event.yes_rsvp_count, "short": true }
          ]
        };
        reply.attachments = attachment;
        console.log(reply);
        return reply;
      }
    })
    return 'There are not events';
  }
  // console.log('....................................................................................', event );
  
 
       // .then(events => {
        //      if(events.length == 0){
        //        reply.text = 'No Meetups found in  :sleuth_or_spy: .\nMake sure the location you entered is correct and try again.:slightly_smiling_face:';
        //        // return res.json(reply);
        //        return reply;
        //      }
        //      reply.text = 'Hey ,\nThis is the list of the envens.\nIf you want to go the event, click in the name of event and confirm the assistance in Meetup';
        //      events.forEach(event => {
        //        var status = (event.status != undefined) ? ('Status - '+event.status) : 'Status - visible only to Members';
        //        var date = new Date(event.time + event.utc_offset);
        //        date = moment(date).format('lll');
        //        var venue = (event.venue != undefined) ? event.venue.address_1 : 'Only visible to members';
        //        attachment.push({
        //          title: 'Group - '+event.group.name,
        //          text: '<'+event.link+'| Event - '+event.name+'>',
        //          author_name: status,
        //          title_link: 'https://www.meetup.com/'+event.group.urlname,
        //          color: "#764FA5",
        //          fields: [
        //            { "title": "Date", "value": date, "short": true },
        //            { "title": "Venue", "value": venue, "short": true },
        //            { "title": "RSVP Count", "value": event.yes_rsvp_count, "short": true }
        //          ]
        //        });
        //      });
        //      reply.attachments = attachment;
        //       // myText = reply;
        //      // return res.json(reply);
        //      return reply;
        //   })
        //    .catch(e => {
        //      console.log("Occured an error in getEvent. " + e);
        //      // myText = 'Error '+ e;
        //      // return res.json({text: 'Ops Occurred an error. Please try again'});
        //      return 'Error '+ e;
        //   });
 
}

/*
* function to get events of meetup using meetup API
*/
function getEvents(nameMeetup) {
  var key = process.env.SECRET;
  
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: 'https://api.meetup.com/'+nameMeetup+'/events',
      params: {
        key: key,
        urlname: nameMeetup
      }
    };

    console.log(options, ' options');
    request(options, function (error, response, body) {
      if (error) {
        console.log("error occured in getEvents as "+error);
        reject('Erorr');
      } else {
        body = JSON.parse(body);
        console.log(body.length);
        resolve(body);
      }
    });

  });
  
  // return m;
}

/*
 * function to get the notifications
 */
function getNotifications() {
    var key = process.env.SECRET;
    console.log('Notifi');
    const value =  new Promise((resolve, reject) => {
      var options = {
        method: 'GET',
        url: 'https://api.meetup.com/notifications',
        params: {
          key: key
        }
      };

      console.log(options, ' options');
      request(options, function (error, response, body) {
        console.log('estestes', error);
        if (error) {
          console.log("error occured in getEvents as "+error);
          reject('Erorr');
        } else {
          // body = JSON.parse(body);
          console.log('.;.;.; ', body.length, ' /// ', body);
          m = body;
          resolve(body);
        }
      });

    });
}

/*
* function to get the confirmation of event of meetup using meetup API
*/
function getConfirmation(nameMeetup, idEvent) {
  var key = process.env.SECRET;
  
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: 'https://api.meetup.com/'+nameMeetup+'/events/'+idEvent+'/rsvps',
      params: {
        key: key,
        urlname: nameMeetup,
        event_id: idEvent
      }
    };

    console.log(options, ' options');
    request(options, function (error, response, body) {
      if (error) {
        console.log("error occured in getEvents as "+error);
        reject('Erorr');
      } else {
        body = JSON.parse(body);
        console.log(body.length);
        resolve(body);
      }
    });

  });
}
/*
*function to get meetups using meetup API
*/
function getMeetup() {
  var key = process.env.SECRET;
  
  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: 'https://api.meetup.com/node_co',
      params: {
        key: key,
        urlname: 'node_co'
      }
    };

    console.log(options, ' opt');
    request(options, function (error, response, body) {
      if (error) {
        console.log("error occured in getMeetup as "+error);
        reject('Erorr');
      } else {
        body = JSON.parse(body);
        console.log(body.length);
        resolve(body);
      }
    });

  });
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

