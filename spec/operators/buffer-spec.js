/* globals describe, it, expect, expectObservable, hot */
var Rx = require('../../dist/cjs/Rx');
var Observable = Rx.Observable;

describe('Observable.prototype.buffer', function () {
  it('should work with empty and empty selector', function () {
    var a = Observable.empty();
    var b = Observable.empty();
    var expected = '|';
    expectObservable(a.buffer(b)).toBe(expected);
  });
  it('should work with empty and non-empty selector', function () {
    var a = Observable.empty();
    var b = hot('-----a-----');
    var expected = '|';
    expectObservable(a.buffer(b)).toBe(expected);
  });
  it('should work with non-empty and empty selector', function () {
    var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
    var b = Observable.empty();
    var expected = '|';
    expectObservable(a.buffer(b)).toBe(expected);
  });
  it('should work with never and never selector', function () {
    var a = Observable.never();
    var b = Observable.never();
    var expected = '-';
    expectObservable(a.buffer(b)).toBe(expected);
  });
  it('should work with never and empty selector', function () {
    var a = Observable.never();
    var b = Observable.empty();
    var expected = '|';
    expectObservable(a.buffer(b)).toBe(expected);
  });
  it('should work with empty and never selector', function () {
    var a = Observable.empty();
    var b = Observable.never();
    var expected = '|';
    expectObservable(a.buffer(b)).toBe(expected);
  });
  it('should emit buffers that close and reopen', function () {
    var a =    hot('-a-b-c-d-e-f-g-h-i-|');
    var b =    hot('-----1-----2-----3-|');
    var expected = '-----x-----y-----z-|';
    expectObservable(a.buffer(b)).toBe(expected, {x: ['a','b','c'], y: ['d','e','f'], z: ['g','h','i']});
  });
  it('should work with non-empty and throw selector', function () {
    var a = hot('---^--a--');
    var b = Observable.throw(new Error('too bad'));
    var expected = '#';
    expectObservable(a.buffer(b)).toBe(expected, null, new Error('too bad'));
  });
  it('should work with throw and non-empty selector', function () {
    var a = Observable.throw(new Error('too bad'));
    var b = hot('---^--a--');
    var expected = '#';
    expectObservable(a.buffer(b)).toBe(expected, null, new Error('too bad'));
  });
  it('should work with error', function () {
    var a = hot('---^-------#', null, new Error('too bad'));
    var b = hot('---^--------');
    var expected = '--------#';
    expectObservable(a.buffer(b)).toBe(expected, null, new Error('too bad'));
  });
  it('should work with error and non-empty selector', function () {
    var a = hot('---^-------#', null, new Error('too bad'));
    var b = hot('---^---a----');
    var expected = '----a---#';
    expectObservable(a.buffer(b)).toBe(expected, { a: [] }, new Error('too bad'));
  });
  it('should work with selector', function () {
    // Buffer Boundaries Simple (RxJS 4)
    var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
    var b = hot('--------^--a-------b---cd---------e---f---|');
    var expected =      '---a-------b---cd---------e---f-|';
    expectObservable(a.buffer(b)).toBe(expected,
      { a: ['3'], b: ['4', '5'], c: ['6'], d: [], e: ['7', '8', '9'], f: ['0'] });
  });
  it('should work with selector completed', function () {
    // Buffer Boundaries onCompletedBoundaries (RxJS 4)
    var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
    var b = hot('--------^--a-------b---cd|');
    var expected =      '---a-------b---cd|';
    expectObservable(a.buffer(b)).toBe(expected,
      { a: ['3'], b: ['4', '5'], c: ['6'], d: [] });
  });
  it('should work with non-empty and selector error', function () {
    // Buffer Boundaries onErrorSource (RxJS 4)
    var a = hot('--1--2--^--3-----#', {'3': 3}, new Error('too bad'));
    var b = hot('--------^--a--b---');
    var expected =      '---a--b--#';
    expectObservable(a.buffer(b)).toBe(expected,
      { a: [3], b: [] }, new Error('too bad'));
  });
  it('should work with non-empty and empty selector error', function () {
    var obj = { a: true, b: true, c: true };
    var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
    var b = hot('--------^----------------#', null, new Error('too bad'));
    var expected =      '-----------------#';
    expectObservable(a.buffer(b)).toBe(expected, null, new Error('too bad'));
  });
  it('should work with non-empty and selector error', function () {
    // Buffer Boundaries onErrorBoundaries (RxJS 4)
    var obj = { a: true, b: true, c: true };
    var a = hot('--1--2--^--3--4--5---6----7--8--9---0---|');
    var b = hot('--------^--a-------b---c-#', obj, new Error('too bad'));
    var expected =      '---a-------b---c-#';
    expectObservable(a.buffer(b)).toBe(expected,
      { a: ['3'], b: ['4', '5'], c: ['6'] }, new Error('too bad'));
  });
});
