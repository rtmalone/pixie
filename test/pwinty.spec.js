var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    app = require('../app'),
    pwinty = require('../app/controllers/pwinty.js');

chai.use(require('sinon-chai'));

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

describe('Pwinty tests', function(){
  var stub;
  afterEach(function(){
    stub.restore();
  });

  it('should create an order', function(done){
    // var orderObj = sinon.spy();
    stub = sinon.stub(pwinty, 'order');

    stub.returns({
      "id": 1065,
      "recipientName": "Tom Smith",
      "address1": "14 Acacia Avenue",
      "address2": "",
      "addressTownOrCity": "Cardiff",
      "stateOrCounty": "Glamorgan",
      "postalOrZipCode": "CF11 1AB",
      "countryCode": "GB",
      "destinationCountryCode": "GB",
      "price": 1292,
      "shippingInfo" :
          {
              "price" : 12,
              "shipments" :
              [
                  {
                      "shipmentId" : 321,
                      "trackingNumber" : "123456",
                      "trackingUrl" : "http://www.ups.com/track?123456",
                      "isTracked" : true,
                      "earliestEstimatedArrivalDate" : "2015-02-19T12:50:59.175116Z",
                      "latestEstimatedArrivalDate" : "2015-02-24T12:50:59.175116Z"
                  }
              ]
          },
      "status" : "NotYetSubmitted",
      "payment" : "InvoiceRecipient",
      "paymentUrl" : "https://checkout.pwinty.com/Pay?paymentRef=12345",
      "qualityLevel" : "Pro",
      "photos": [{ }]
    });

    var foo = pwinty.order(orderOpts);

    expect(pwinty.order).to.be.calledOnce;
    expect(pwinty.order).to.be.calledWith(orderOpts);

    expect(foo).to.be.an('object');
    expect(foo).to.have.property('id');
    expect(foo.id).to.equal(1065);

    done();

  });

  it('should add an photo to the order', function(done){
    stub = sinon.stub(pwinty, 'addPhoto');

    stub.returns({
      "id": 3456,
      "type": "4x6",
      "url": "http://www.flickr.com/mytestphoto.jpg",
      "status": "NotYetDownloaded",
      "copies": "4",
      "sizing": "Crop",
      "priceToUser" : 214,
      "price" : 199,
      "md5Hash" : "79054025255fb1a26e4bc422aef54eb4",
      "previewUrl" : "http://s3.amazonaws.com/anexampleurl",
      "thumbnailUrl" : "http://s3.amazonaws.com/anexamplethumbnailurl",
      "attributes": {
                      "frame_colour" : "silver"
                   }
    });

    var foo = pwinty.addPhoto(1065, "http://s3.amazonaws.com/anexampleurl");

    expect(pwinty.addPhoto).to.be.calledOnce;
    expect(pwinty.addPhoto).to.be.calledWith(1065, "http://s3.amazonaws.com/anexampleurl");

    expect(foo).to.have.property('id');
    expect(foo).to.be.an('object');

    done();
  });
});
