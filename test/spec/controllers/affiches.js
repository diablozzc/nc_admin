'use strict';

describe('Controller: AffichesCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var AffichesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AffichesCtrl = $controller('AffichesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
