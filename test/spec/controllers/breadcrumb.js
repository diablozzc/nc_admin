'use strict';

describe('Controller: BreadcrumbCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var BreadcrumbCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BreadcrumbCtrl = $controller('BreadcrumbCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
