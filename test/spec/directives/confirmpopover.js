'use strict';

describe('Directive: confirmPopover', function () {

  // load the directive's module
  beforeEach(module('propertyAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<confirm-popover></confirm-popover>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the confirmPopover directive');
  }));
});
