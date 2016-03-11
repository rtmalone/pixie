var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  twilio = require('twilio'),
  Pwinty = require('../controllers/pwinty');

var orderOpts = {
  'headers': {
    'X-Pwinty-MerchantId': process.env.PWINTY_MERCHANT_ID,
    'X-Pwinty-REST-API-Key': process.env.PWINTY_API_KEY
  },
  'json': true,
  'url': 'https://sandbox.pwinty.com/v2.2/Orders',
  'method': 'POST',
  'body': orderParams = {
    'recipientName': 'Tyler Malone',
    'address1': '1438 McAlpine Ave',
    'address2': '',
    'addressTownOrCity': 'Nashville',
    'stateOrCounty': 'TN',
    'postalOrZipCode': '37216',
    'countryCode': 'US',
    'destinationCountryCode': 'US',
    'useTrackedShipping': false,
    'payment': 'InvoiceMe',
    'qualityLevel': 'Standard'
  }
};

module.exports = function (app) {
  app.use('/', router);
};

router.use(function (req, res, next) {
  console.log('Timestamp: ', Date.now());
  next();
});

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Pixie',
    description: 'the SMS/MMS application for Pixt.',
  });
});

router.post('/sendMMS', function(req, res) {
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

router.post('/sendSMS', function(req, res) {
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

router.post('/message', function(req, res) {
  console.log('Twilio request to POST /message', req.body);
  var twiml = new twilio.TwimlResponse();

  twiml.message(function() {
    this.body('Thanks!');
    // this.media('http://i.imgur.com/Act0Q.gif');
  });

  res.type('text/xml');
  res.send(twiml.toString());

  Pwinty.order(orderOpts)
    .then(Pwinty.addPhoto(order, req.body.MediaUrl0))
    .then(Pwinty.validateOrder(orderId))
    .then(Pwinty.submitOrder())
    .catch(console.log('PWINTY createOrder Error: ', err));
});
