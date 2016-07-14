'use strict';

describe('Directive: uploadCropper', function () {

  // load the directive's module
  beforeEach(module('superAdminApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<upload-cropper></upload-cropper>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the uploadCropper directive');
  }));
});
