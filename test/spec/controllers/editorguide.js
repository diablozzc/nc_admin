'use strict';

describe('Controller: EditorguideCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditorguideCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorguideCtrl = $controller('EditorguideCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
