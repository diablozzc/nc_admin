'use strict';

describe('Filter: Filters', function () {

  // load the filter's module
  beforeEach(module('propertyAdminApp'));

  // initialize a new instance of the filter before each test
  var Filters;
  beforeEach(inject(function ($filter) {
    Filters = $filter('Filters');
  }));

  it('should return the input prefixed with "Filters filter:"', function () {
    var text = 'angularjs';
    expect(Filters(text)).toBe('Filters filter: ' + text);
  });

});
