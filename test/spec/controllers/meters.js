'use strict';

describe('Controller: MetersCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var MetersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MetersCtrl = $controller('MetersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
