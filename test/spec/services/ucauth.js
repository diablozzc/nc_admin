'use strict';

describe('Service: ucauth', function () {

  // load the service's module
  beforeEach(module('propertyAdminApp'));

  // instantiate service
  var ucauth;
  beforeEach(inject(function (_ucauth_) {
    ucauth = _ucauth_;
  }));

  it('should do something', function () {
    expect(!!ucauth).toBe(true);
  });

});
