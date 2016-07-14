'use strict';

describe('Controller: RepairssearcherCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var RepairssearcherCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RepairssearcherCtrl = $controller('RepairssearcherCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
