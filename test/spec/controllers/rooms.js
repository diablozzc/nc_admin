'use strict';

describe('Controller: RoomsCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var RoomsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RoomsCtrl = $controller('RoomsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
