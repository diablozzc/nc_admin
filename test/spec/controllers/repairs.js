'use strict';

describe('Controller: RepairsCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var RepairsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepairsCtrl = $controller('RepairsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
