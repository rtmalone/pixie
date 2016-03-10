// var pwinty = require('pwinty')(process.env.PWINTY_API_KEY, process.env.PWINTY_MERCHANT_ID, 'https://sandbox.pwinty.com/v2.2'),
var request = require('request');

exports.order = function(twilioImageData) {
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

  // pwinty.createOrder(orderParams, function(err, order){
  request(options, function(err, response, body){
    if (!err) {
      console.log('PWINTY res code: ', response.statusCode);
      console.log('PWINTY body: ', body);
    } else {
      console.log('PWINTY err: ', err);
    }

    // var photo = {
    //   type: '4x4',
    //   url: twilioImageData.MediaUrl0,
    //   copies: '1',
    //   sizing: 'crop',
    //   priceToUser: '100'
    // };
    //
    // if (err) {
    //   res.render('error', {error: err, message: createOrder});
    // } else {
    //   console.log('Pwinty order created: ', order);
    // }
    //
    // pwinty.addPhotoToOrder(order.id, photo, function (err, order) {
    //   if (err) {
    //     res.render('error', {error: err, message: 'addPhotoToOrder'});
    //   } else {
    //     console.log('photo added: ', order);
    //   }
    // });
  });
};
