'use strict';

describe('Directive: numberSwitcher', function () {

  // load the directive's module
  beforeEach(module('adAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<number-switcher></number-switcher>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the numberSwitcher directive');
  }));
});
