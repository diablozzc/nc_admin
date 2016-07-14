'use strict';

describe('Controller: UsercenterCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var UsercenterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsercenterCtrl = $controller('UsercenterCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
