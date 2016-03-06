var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  twilio = require('twilio'),
  pwinty = require('pwinty')(process.env.PWINTY_API_KEY, process.env.PWINTY_MERCHANT_ID, 'https://sandbox.pwinty.com/v2.2'),
  Article = mongoose.model('Article');

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
    from: '+15005550006', // Twilio Test number
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

  pwintyOrder(req.body);
});

// TODO: refactor Pwinty Order into promis working with Twilio call.

var pwintyOrder = function(twilioImageData) {
  var orderParams = {
    recipientName: 'Tyler Malone',
    address1: '1438 McAlpine Ave',
    address2: '',
    addressTownOrCity: 'Nashville',
    stateOrCountry: 'TN',
    postalOrZipCode: '37216',
    countryCode: 'US',
    desitnationCountryCode: 'US',
    useTrackedShipping: false,
    payment: 'InvoiceMe',
    qualityLevel: 'Standard'
  };

  pwinty.createOrder(orderParams, function(err, order){
    var photo = {
      type: '4x4',
      url: twilioImageData.MediaUrl0,
      copies: '1',
      sizing: 'crop',
      priceToUser: '100'
    };

    if (err) {
      res.render('error', {error: err, message: createOrder});
    } else {
      console.log('Pwinty order created: ', order);
    }

    pwinty.addPhotoToOrder(order.id, photo, function (err, order) {
      if (err) {
        res.render('error', {error: err, message: 'addPhotoToOrder'});
      } else {
        console.log('photo added: ', order);
      }
    });
  });
};
