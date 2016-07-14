'use strict';

describe('Controller: EditorappenditemCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var EditorappenditemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditorappenditemCtrl = $controller('EditorappenditemCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EditorappenditemCtrl.awesomeThings.length).toBe(3);
  });
});
