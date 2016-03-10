var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  twilio = require('twilio'),
  Pwinty = require('../lib/pwinty');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Pixie',
    description: 'the SMS/MMS application for Pixt.',
  });
});

router.post('/sendMMS', function(req, res, next) {
  var client = new twilio.RestClient(process.env.TWILIO_TEST_SID, process.env.TWILIO_TEST_AUTH_TOKEN);

  client.sendMessage({
    to: req.body.phone,
    from: process.env.TWILIO_TEST_PHONE_NUMBER, // Twilio Test number
    // from: process.env.TWILIO_PHONE_NUMBER, // live Twilio number
    body: req.body.message,
    mediaUrl: req.body.url
  }).then(function(response){
    console.log('MMS yay!', response);
  }, function(err) {
    console.log('something is wrong');
    console.log(err);
  });
});

router.post('/sendSMS', function(req, res, next) {
  var client = new twilio.RestClient(process.env.TWILIO_TEST_SID, process.env.TWILIO_TEST_AUTH_TOKEN);

  client.sms.messages.post({
    to: req.body.phone,
    from: process.env.TWILIO_TEST_PHONE_NUMBER, // Twilio Test number
    // from: process.env.TWILIO_PHONE_NUMBER, // live Twilio number
    body: req.body.message
  }).then(function(data){
    console.log('SMS yay!', data);
  }, function(err){
    console.log('something is wrong');
    console.log(err);
  });
});

router.post('/message', function(req, res, next) {
  console.log('Twilio request to POST /message', req.body);
  var twiml = new twilio.TwimlResponse();

  twiml.message(function() {
    this.body('Thanks!');
    // this.media('http://i.imgur.com/Act0Q.gif');
  });

  res.type('text/xml');
  res.send(twiml.toString());

  Pwinty.order(req.body);
});

// TODO: refactor Pwinty Order into promis working with Twilio call.