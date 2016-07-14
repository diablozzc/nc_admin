'use strict';

describe('Controller: EditorbuildingCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditorbuildingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorbuildingCtrl = $controller('EditorbuildingCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
