'use strict';

describe('Controller: EditormeterCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditormeterCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditormeterCtrl = $controller('EditormeterCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
