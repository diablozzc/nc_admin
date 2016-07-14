'use strict';

describe('Controller: EditorroomCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditorroomCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorroomCtrl = $controller('EditorroomCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
