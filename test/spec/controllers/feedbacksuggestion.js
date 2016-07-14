'use strict';

describe('Controller: FeedbacksuggestionCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var FeedbacksuggestionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FeedbacksuggestionCtrl = $controller('FeedbacksuggestionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
