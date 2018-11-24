var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var moment = require('moment');
const http = require('http');

var userNames = '';
var eventId = '';

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (request, response) => {
  response.sendStatus(200);
});

setInterval (async ()  => {
  const myText = await getMessage();
  request.post('https://hooks.slack.com/services/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', {
    json:{ text: myText }
  }, 
  
  (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
  })
}, 30000);

setInterval (async ()  => {
  const myText = await getReminder();
  request.post('https://hooks.slack.com/services/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', {
    json:{ text: myText }
  },

  (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(`statusCode: ${res.statusCode}`)
    console.log(body)
  })
}, 60000);

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
        title: '/next-event name lastName',
        text: 'Use this to find the next events.',
        color: '#764FA5'
      },
      {
        title: '/information-group',
        text: 'Use this to show the information of meetup.',
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
    var name = req.body.text;
    var attachment=[];
    var reply = {};
    var nameMeetup = 'node_co';
    if(name !== '') {
      userNames = name;
      getEvents(nameMeetup)
      .then(events => {
          if(events.length == 0) {
            reply.text = 'No Meetups found in  :sleuth_or_spy: .\nMake sure the location you entered is correct and try again.:slightly_smiling_face:';
            return res.json(reply);
          }
          reply.text = 'Hey '+userName+',\nThis is the list of the envens.\nIf you want to go the event, click in the name of event and confirm the assistance in Meetup';
          events.forEach(event => {
            eventId = event.id;
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
    } else {
      reply.text = 'Please @'+userName + ', enter the mail as follows. \n /next-event yourEmail@gmail.com';
      return res.json(reply);
    }
  });

/*
* /next_event call the next-event and response a list of following events
*/
app.post('/group', function (req, res) {
    var userName = req.body.user_name;
    var attachment=[];
    var reply = {};

    getMeetup()
      .then(event => {
          const date = new Date(event.created).toDateString();
          reply.text = 'Hey '+userName+',\nThis is the information of meetup. \n Name: <'+event.link+'| Event - '+event.name+'>\n Created: '+ date + ' \n City: '+ event.city + ' \n Country: '+event.localized_country_name+' \n Organaizer: '+event.organizer.name+' \n Category: '+event.category.name+' \n Members: '+event.members;
          return res.json(reply);
        })
        .catch(e => {
          console.log("Occured an error in getEvent. " + e);
          return res.json({text: 'Ops Occurred an error. Please try again'});
        });
});


/* Get the events and return de next event */
async function getMessage() {
  let reply = {};
  let attachment = {};
  let temp = '';
  let myActualTime = moment();

  try {
    const ev = await getEvents('node_co');
    if(ev.length == 0){
            reply.text = 'No found';
            return 'No found';
          }
          ev.forEach(event => {
      const actualTime = new Date (myActualTime + event.utc_offset);
      const dateEvent = new Date(event.time + event.utc_offset);
      if (dateEvent > actualTime && temp === '') {
        var status = (event.status != undefined) ? ('Status - '+event.status) : 'Status - visible only to Members';
        var venue = (event.venue != undefined) ? event.venue.address_1 : 'Only visible to members';
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
        eventId = event.id;
        temp = 'The next event is <'+event.link+'| Event - '+event.name+'>\nDate: '+moment(dateEvent).format('lll')+'\nVenue: '+venue+'\nRSVP Count: '+event.yes_rsvp_count;
      }
    })
    return temp;
  } catch (e) {
    console.log('e');
  } 
}

/* Get the events and return de next event */
async function getReminder() {
  let reply = {};
  let attachment = {};
  let temp = '';
  let myActualTime = moment();

  if(eventId !== '' && userNames !== '') {
      try {
        const ev = await getRsvps('node_co', eventId);
        if(ev.length == 0){
                reply.text = 'No found';
                return 'No found';
              }
              ev.forEach(event => {
              var member = event.member.name;
              if(member === userNames) {
                var response = event.response;
                const dateEvent = new Date(event.event.time + event.event.utc_offset);
                const link = 'https://www.meetup.com/es-ES/node_co/'+event.event.id;
                temp = response === 'yes' ? 'You have confirmed attendance for the next event \n <'+link+'| Event - '+event.event.name+'>\nDate: '+moment(dateEvent).format('lll')+'\nVenue: '+event.venue.city+' '+event.venue.name+'\n Address: '+event.venue.address_1: '';
              }
              })
        return temp;
      } catch (e) {
        console.log('e');
      }
  } else {
    console.log('No data');
  }
}

/*
* Function to get confirmation to the event
*/
function getRsvps(nameMeetup, eventId) {
  var key = process.env.SECRET;

  return new Promise((resolve, reject) => {
    var options = {
      method: 'GET',
      url: 'https://api.meetup.com/'+nameMeetup+'/events/'+eventId+'/rsvps',
      params: {
        key: key,
        urlname: nameMeetup,
        event_id: eventId,
      }
    };

    request(options, function (error, response, body) {
      if (error) {
        console.log("error occured in getEvents as "+error);
        reject('Erorr');
      } else {
        console.log(response.statusCode, 'get rsvps')
        body = JSON.parse(body);
        console.log(body.length);
        resolve(body);
      }
    });
   });
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