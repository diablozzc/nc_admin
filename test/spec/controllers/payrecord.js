'use strict';

describe('Controller: PayrecordCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var PayrecordCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PayrecordCtrl = $controller('PayrecordCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
