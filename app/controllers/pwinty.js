// var pwinty = require('pwinty')(process.env.PWINTY_API_KEY, process.env.PWINTY_MERCHANT_ID, 'https://sandbox.pwinty.com/v2.2'),
var request = require('request'),
    Q = require('q');


exports.order = function(order, callback) {
  // var deferred = Q.defer();

  request(order, function(err, res, body){
      callback(err, body);
  });
};

exports.addPhoto = function(order, photoUrl, callback) {
  console.log('order', order);
  console.log('photo', photoUrl);
  // var deferred = Q.defer();
  var options = {
    'headers': {
      'X-Pwinty-MerchantId': process.env.PWINTY_MERCHANT_ID,
      'X-Pwinty-REST-API-Key': process.env.PWINTY_API_KEY
    },
    'json': true,
    'url': 'https://sandbox.pwinty.com/v2.2/Orders' + order.id + '/Photos',
    'method': 'POST',
    'body': {
      'type': '4x4',
      'url': photoUrl,
      'copies': '1',
      'sizing': 'crop',
      'priceToUser': '100'
    }
  };

  request(options, function(err, response, body){
    console.log('err', err);
    console.log('response', response.statusCode);
    // console.log('body', body);
    callback(err, body);
  });
};

exports.validateOrder = function(orderId, callback) {
  // var deferred = Q.defer();
  var options = {
    'headers': {
      'X-Pwinty-MerchantId': process.env.PWINTY_MERCHANT_ID,
      'X-Pwinty-REST-API-Key': process.env.PWINTY_API_KEY
    },
    'json': true,
    'url': 'https://sandbox.pwinty.com/v2.2/Orders' + orderId + '/SubmissionStatus',
    'method': 'GET',
  };

  request(options, function(err, response, body){
    callback(err, body);
  });
};

exports.submitOrder = function(orderId, params, callback) {
  // var deferred = Q.defer();
  var options = {
    'headers': {
      'X-Pwinty-MerchantId': process.env.PWINTY_MERCHANT_ID,
      'X-Pwinty-REST-API-Key': process.env.PWINTY_API_KEY
    },
    'json': true,
    'url': 'https://sandbox.pwinty.com/v2.2/Orders' + orderId + '/Status',
    'method': 'POST',
    'body': params
  };

  request(options, function(err, response, body){
    callback(err, body);
  });
};
