'use strict';

describe('Controller: EditoractivityCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditoractivityCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditoractivityCtrl = $controller('EditoractivityCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
