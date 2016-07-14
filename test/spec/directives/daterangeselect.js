'use strict';

describe('Directive: daterangeSelect', function () {

  // load the directive's module
  beforeEach(module('propertyAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<daterange-select></daterange-select>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the daterangeSelect directive');
  }));
});
