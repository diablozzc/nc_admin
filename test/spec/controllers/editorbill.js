'use strict';

describe('Controller: EditorbillCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditorbillCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorbillCtrl = $controller('EditorbillCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
