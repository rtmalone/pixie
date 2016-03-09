var pwinty = require('pwinty')(process.env.PWINTY_API_KEY, process.env.PWINTY_MERCHANT_ID, 'https://sandbox.pwinty.com/v2.2');

exports.order = function(twilioImageData) {
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
