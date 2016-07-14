'use strict';

describe('Controller: ChecksuggestionCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var ChecksuggestionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChecksuggestionCtrl = $controller('ChecksuggestionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
