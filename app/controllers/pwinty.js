// var pwinty = require('pwinty')(process.env.PWINTY_API_KEY, process.env.PWINTY_MERCHANT_ID, 'https://sandbox.pwinty.com/v2.2'),
var request = require('request'),
    Q = require('q');


exports.order = function(photoOpts) {
  var deferred = Q.defer();

  request(photoOpts, function(err, res, body){
    if (!err) {
      console.log('PWINTY res code: ', res.statusCode);
      console.log('PWINTY body: ', body);
      deferred.resolve(body);
    } else {
      // console.log('PWINTY err: ', err);
      deferred.reject(err);
    }
  });
  return deferred.promise;
};

exports.addPhoto = function(order, photoUrl) {
  var deferred = Q.defer();
  var options = {
    'headers': {
      'X-Pwinty-MerchantId': process.env.PWINTY_MERCHANT_ID,
      'X-Pwinty-REST-API-Key': process.env.PWINTY_API_KEY
    },
    'json': true,
    'url': 'https://sandbox.pwinty.com/v2.2/Orders' + order.id + '/Photos',
    'method': 'POST',
    'body': photoOpts = {
      'type': '4x4',
      'url': photoUrl,
      'copies': '1',
      'sizing': 'crop',
      'priceToUser': '100'
    }
  };

  request(options, function(err, response, body){
    if (!err) {
      console.log('PWINTY addPhoto res code: ', response.statusCode);
      console.log('PWINTY addPhoto body: ', body);
      deferred.resolve(order.id, body);
    } else {
      console.log('PWINTY addPhoto err: ', err);
      deferred.reject(err);
    }

  });
  return deferred.promise;
};

exports.validateOrder = function(orderId) {
  var deferred = Q.defer();
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
    if (!err) {
      console.log('PWINTY validateOrder res code: ', response.statusCode);
      console.log('PWINTY validateOrder body: ', body);
      deferred.resolve(body);
    } else {
      console.log('PWINTY validateOrder err: ', err);
      deferred.reject(err);
    }
  });
  return deferred.promise;
};

exports.submitOrder = function(order) {
  var deferred = Q.defer();
  var options = {
    'headers': {
      'X-Pwinty-MerchantId': process.env.PWINTY_MERCHANT_ID,
      'X-Pwinty-REST-API-Key': process.env.PWINTY_API_KEY
    },
    'json': true,
    'url': 'https://sandbox.pwinty.com/v2.2/Orders' + orderId + '/Status',
    'method': 'POST',
    'body': {'status': 'Submitted'}
  };

  request(options, function(err, response, body){
    if (!err) {
      console.log('PWINTY validateOrder res code: ', response.statusCode);
      console.log('PWINTY validateOrder body: ', body);
      deferred.resolve(order, body);
    } else {
      console.log('PWINTY validateOrder err: ', err);
      deferred.reject(err);
    }
  });
  return deferred.promise;
};
