'use strict';

describe('Controller: EditoremployeeCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditoremployeeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditoremployeeCtrl = $controller('EditoremployeeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
