'use strict';

describe('Directive: sidebarMenu', function () {

  // load the directive's module
  beforeEach(module('propertyAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<sidebar-menu></sidebar-menu>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the sidebarMenu directive');
  }));
});
