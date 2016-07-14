'use strict';

describe('Controller: FeedbackrepairCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var FeedbackrepairCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FeedbackrepairCtrl = $controller('FeedbackrepairCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
