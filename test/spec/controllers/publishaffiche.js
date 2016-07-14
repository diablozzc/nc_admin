'use strict';

describe('Controller: PublishafficheCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var PublishafficheCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PublishafficheCtrl = $controller('PublishafficheCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
