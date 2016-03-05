var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  twilio = require('twilio'),
  pwinty = require('pwinty')(process.env.PWINTY_API_KEY, process.env.PWINTY_MERCHANT_ID, 'https://sandbox.pwinty.com/v2.2')
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

router.post('/send', function(req, res, next) {
  var client = new twilio.RestClient(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  client.sendMessage({
    to: req.body.phone,
    // from: '+15005550006', // Twilio Test number
    from: '+12192274448', // live Twilio number
    body: req.body.message,
    mediaUrl: req.body.url
  }, function(err, response){

    if (!err) {
      console.log('yay!', response);
    } else {
      console.log('something is wrong');
      console.log(err);
    }
  });
});

router.post('/message', function(req, res, next) {
  var twiml = new twilio.TwimlResponse();

  twiml.message(function() {
    this.body('Pixie');
    this.media('http://i.imgur.com/Act0Q.gif');
  });

  res.type('text/xml');
  res.send(twiml.toString());
});
