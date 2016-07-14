'use strict';

describe('Controller: EditorafficheCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditorafficheCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorafficheCtrl = $controller('EditorafficheCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
