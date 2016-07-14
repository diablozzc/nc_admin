'use strict';

describe('Controller: AssignmenusCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var AssignmenusCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AssignmenusCtrl = $controller('AssignmenusCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
