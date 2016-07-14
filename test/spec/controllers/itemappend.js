'use strict';

describe('Controller: ItemappendCtrl', function () {

  // load the controller's module
  beforeEach(module('propertyAdminApp'));

  var ItemappendCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ItemappendCtrl = $controller('ItemappendCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ItemappendCtrl.awesomeThings.length).toBe(3);
  });
});
