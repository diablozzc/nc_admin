'use strict';

describe('Controller: BillsCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var BillsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BillsCtrl = $controller('BillsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
