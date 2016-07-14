'use strict';

describe('Directive: tableDolly', function () {

  // load the directive's module
  beforeEach(module('propertyAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<table-dolly></table-dolly>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the tableDolly directive');
  }));
});
