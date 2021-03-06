import parseRelativeTime from './../src/';


describe('parseRelativeTime', function () {

  it('should exist', function () {
    expect(parseRelativeTime).toBeDefined();
  });

  it('should convert basic units', function () {
    expect(parseRelativeTime('1 second')).toEqual(1000);
    expect(parseRelativeTime('1 minute')).toEqual(1000 * 60);
    expect(parseRelativeTime('1 hour')).toEqual(1000 * 60 * 60);
    expect(parseRelativeTime('1 day')).toEqual(1000 * 60 * 60 * 24);
    expect(parseRelativeTime('1 week')).toEqual(1000 * 60 * 60 * 24 * 7);
    expect(parseRelativeTime('1 month')).toEqual(1000 * 60 * 60 * 24 * 30);
    expect(parseRelativeTime('1 year')).toEqual(1000 * 60 * 60 * 24 * 365);
  });

  it('should calculate multiples', function () {
    expect(parseRelativeTime('2 second')).toEqual(1000 * 2);
    expect(parseRelativeTime('10 second')).toEqual(1000 * 10);
    expect(parseRelativeTime('123 second')).toEqual(1000 * 123);
    expect(parseRelativeTime('3 week')).toEqual(1000 * 60 * 60 * 24 * 7 * 3);
  });

  it('should support singular and plural', function () {
    expect(parseRelativeTime('1 day')).toEqual(parseRelativeTime('1 days'));
    expect(parseRelativeTime('10 day')).toEqual(parseRelativeTime('10 days'));
  });

  it('should support operator', function () {
    expect(parseRelativeTime('+1 second')).toEqual(1000);
    expect(parseRelativeTime('-1 second')).toEqual(-1000);
    expect(parseRelativeTime('+ 1 second')).toEqual(1000);
    expect(parseRelativeTime('- 1 second')).toEqual(-1000);
  });

  it('should ignore whitespace', function () {
    expect(parseRelativeTime('   1 second')).toEqual(1000);
    expect(parseRelativeTime('1 second   ')).toEqual(1000);
    expect(parseRelativeTime('1   second')).toEqual(1000);
    expect(parseRelativeTime('   1 second   ')).toEqual(1000);
    expect(parseRelativeTime('   1   second   ')).toEqual(1000);
  });

  it('should return `null` on invalid input', function () {
    expect(parseRelativeTime('xxx')).toEqual(null);
    expect(parseRelativeTime('1 xxx')).toEqual(null);
    expect(parseRelativeTime('xxx second')).toEqual(null);
    expect(parseRelativeTime('*1 xxx')).toEqual(null);
    expect(parseRelativeTime('1 1 xxx')).toEqual(null);
    expect(parseRelativeTime('1 second day')).toEqual(null);
  });

  it('should treat "in" as positive operator', function () {
    expect(parseRelativeTime('in 1 second'))
      .toEqual(parseRelativeTime('+1 second'));
  });

  it('should treat "ago" as negative operator', function () {
    expect(parseRelativeTime('1 second ago'))
      .toEqual(parseRelativeTime('-1 second'));
  });

  it('should not allow to mix keywords and operators', function () {
    expect(parseRelativeTime('in +1 second')).toEqual(null);
    expect(parseRelativeTime('-1 seconds ago')).toEqual(null);
    expect(parseRelativeTime('in 1 seconds ago')).toEqual(null);
  });

});
