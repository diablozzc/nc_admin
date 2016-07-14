'use strict';

describe('Directive: holderFix', function () {

  // load the directive's module
  beforeEach(module('superAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<holder-fix></holder-fix>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the holderFix directive');
  }));
});
