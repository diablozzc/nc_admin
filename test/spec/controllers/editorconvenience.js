'use strict';

describe('Controller: EditorconvenienceCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditorconvenienceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorconvenienceCtrl = $controller('EditorconvenienceCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
