'use strict';

describe('Controller: CreatorbillsCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var CreatorbillsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreatorbillsCtrl = $controller('CreatorbillsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
