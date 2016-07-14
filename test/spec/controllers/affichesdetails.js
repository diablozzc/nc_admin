'use strict';

describe('Controller: AffichesdetailsCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var AffichesdetailsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AffichesdetailsCtrl = $controller('AffichesdetailsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
