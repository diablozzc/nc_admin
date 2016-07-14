'use strict';

describe('Controller: SuggestionsCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var SuggestionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SuggestionsCtrl = $controller('SuggestionsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
