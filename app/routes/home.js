var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  twilio = require('twilio'),
  Pwinty = require('../controllers/pwinty');
  // Pwinty = require('pwinty')(process.env.PWINTY_API_KEY, process.env.PWINTY_MERCHANT_ID, 'https://sandbox.pwinty.com/v2.2/');

var orderOpts = { "headers": {
    "X-Pwinty-MerchantId": process.env.PWINTY_MERCHANT_ID,
    "X-Pwinty-REST-API-Key": process.env.PWINTY_API_KEY,
  },
  "json": true,
  "url": "https://sandbox.pwinty.com/v2.2/Orders/",
  "method": "POST",
  "body": {
    "recipientName": "Tyler Malone",
    "address1": "1438 McAlpine Ave",
    "address2": "",
    "addressTownOrCity": "Nashville",
    "stateOrCounty": "TN",
    "postalOrZipCode": "37216",
    "countryCode": "US",
    "destinationCountryCode": "US",
    "useTrackedShipping": false,
    "payment": "InvoiceMe",
    "qualityLevel": "Standard"
  }
};

var testPhoto = 'http://www.velior.ru/wp-content/uploads/2009/05/Test-Computer-Key-by-Stuart-Miles.jpg';

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
  var twimlThanks = new twilio.TwimlResponse(),
      pwintyOrder = null;

  twimlThanks.message(function() {
    this.body('Thanks!');
    // this.media('http://i.imgur.com/Act0Q.gif');
  });

  res.type('text/xml');
  res.send(twimlThanks.toString());


  // Pwinty.order(orderOpts)
  //   .then(Pwinty.addPhoto(order, req.body.MediaUrl0))
  //   .then(Pwinty.validateOrder(orderId))
  //   .then(Pwinty.submitOrder())
  //   .catch(console.log('PWINTY createOrder Error: ', err));
});

router.post('/testPwinty', function(req, res){
  var twimlSubmitted = new twilio.TwimlResponse();

  console.log('testing');
  console.log('before pwinty', orderOpts);
  Pwinty.order(orderOpts, function(err, order){
    if (err) {
      console.error('Pwinty create order error: ', err);
    } else {
      console.log('Pwinty order created!', order);
      pwintyOrder = order;
      Pwinty.addPhoto('409345', testPhoto, function(err, photoInfo) {
        if (err) {
          console.error('Pwinty add photo error: ', err);
        } else {
          console.log('Pwinty photo added!', photoInfo);
          Pwinty.validateOrder(pwintyOrder.id, function(err, orderInfo){
            if (err) {
              console.error('Pwinty get order status error', err);
            } else {
              console.log('Pwinty get order', orderInfo);
              if (!isValid) {
                console.error('Pwinty order status invalid', orderInfo.isValid);
              } else {
                console.log('Pwinty order is valid!', orderInfo.isValid);
                var params = {status: 'Submitted'};
                Pwinty.submitOrder(order.id, params, function(err, data){
                  if (err) {
                    console.error('Pwinty submit order failed', err);
                  } else {
                    console.log('Pwinty order submitted!', data);
                    twimlSubmitted.message(function(){
                      this.body('Order has been submitted!');

                      res.type('text/xml');
                      res.send(twimlSubmitted.toString());
                    });
                  }
                });
              }
            }
          });
        }
      });
    }
  });
});

router.post('/deleteMedia', function(req, res){
  console.log('>>',req.body);
  var client = new twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  client.messages(req.body.messageSid).media(req.body.mediaSid).delete(function(err, data) {
    if (err) {
        console.log(err.status);
        throw err.message;
    } else {
        console.log('Sid ' + req.body.mediaSid + ' deleted successfully.');
        req.flash('info', 'Sid ' + req.body.mediaSid + ' deleted successfully.');
        res.redirect('/');
    }
  });
});
