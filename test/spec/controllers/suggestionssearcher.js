'use strict';

describe('Controller: SuggestionssearcherCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var SuggestionssearcherCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SuggestionssearcherCtrl = $controller('SuggestionssearcherCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
