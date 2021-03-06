'use strict';

describe('Controller: ConveniencesCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var ConveniencesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConveniencesCtrl = $controller('ConveniencesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
