'use strict';

describe('Controller: EditorspecialitemCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditorspecialitemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorspecialitemCtrl = $controller('EditorspecialitemCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditorspecialitemCtrl.awesomeThings.length).toBe(3);
  });
});
