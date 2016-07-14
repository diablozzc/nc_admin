'use strict';

describe('Controller: RoomgeneratorCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var RoomgeneratorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RoomgeneratorCtrl = $controller('RoomgeneratorCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
