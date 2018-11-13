var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var moment = require('moment');

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (request, response) => {
  response.sendStatus(200);
});

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
