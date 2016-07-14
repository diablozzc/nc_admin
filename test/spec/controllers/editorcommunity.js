'use strict';

describe('Controller: EditorcommunityCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditorcommunityCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorcommunityCtrl = $controller('EditorcommunityCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
