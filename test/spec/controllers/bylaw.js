'use strict';

describe('Controller: BylawCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var BylawCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BylawCtrl = $controller('BylawCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
