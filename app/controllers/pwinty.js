// var pwinty = require('pwinty')(process.env.PWINTY_API_KEY, process.env.PWINTY_MERCHANT_ID, 'https://sandbox.pwinty.com/v2.2'),
var request = require('request'),
    Q = require('q');

exports.order = function() {
  var deferred = Q.defer();
  var options = {
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

  request(options, function(err, res, body){
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
    } else {
      console.log('PWINTY addPhoto err: ', err);
    }

});
    //
    // pwinty.addPhotoToOrder(order.id, photo, function (err, order) {
    //   if (err) {
    //     res.render('error', {error: err, message: 'addPhotoToOrder'});
    //   } else {
    //     console.log('photo added: ', order);
    //   }
    // });
};
