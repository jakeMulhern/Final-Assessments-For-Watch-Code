/*

Assignment Description:
Write a function, isPrototypeOf, that works just like Object.prototype.isPrototypeOf. 
Since your solution will be called as a function rather than a method, the way you 
use it will be slightly different, but the outcome should be the same.

Obviously, don't use Object.prototype.isPrototypeOf in your solution, but feel free 
to use other methods on Object.prototype.

*/

/*

Function Requirements:

1. If currentObj is not a prototype of protoObj, it should return Boolean false.
2. If currentObj is a prototype of protoObj, it should return Boolean true.
3. If currentObj is not defined, it should throw a ReferenceError;
4. If protoObj is not defined, it should throw a ReferenceError;
5. It should work with any number of prototype links.

*/


function isPrototypeOf(currentObj, protoObj) {
  if (currentObj === undefined) {
    throw new ReferenceError('Reduce of empty array with no initial value');
  } else if (protoObj === undefined) { 
      throw new ReferenceError('Reduce of empty array with no initial value');
  }

  var resultSoFar = Object.getPrototypeOf(currentObj);
  for (i = 0; i < Infinity; i++) {
    if (resultSoFar === protoObj) {
      return true;
    } else if (resultSoFar === null) {
      return false;
    } else {
      resultSoFar = Object.getPrototypeOf(resultSoFar);
    }
  }
};

tests({

  'If currentObj is not a prototype of protoObj, it should return Boolean false.': function() {
    var Zero = {
      name: 'zero'
    };
    var One = {
      name: 'one'
    };
    var two = Object.create(One);
    var result = isPrototypeOf(two, Zero);
    eq(result, false);
  },
  'If currentObj is a prototype of protoObj, it should return Boolean true.': function() {
    var Test = {
      name: 'test 1'
    };
    var subject = Object.create(Test);
    var result = isPrototypeOf(subject, Test);
    eq(result, true);
  },
  'If currentObj is not defined, it should throw a ReferenceError.': function() {
    var Test = {};
    var isTypeError = false;
    try {
      isPrototypeOf(subject, Test);
    } catch(e) {
      isTypeError = (e instanceof ReferenceError);
    }
    eq(isTypeError, true);
  },
  'If protoObj is not defined, it should throw a ReferenceError.': function() {
    var isTypeError = false;
    try {
      isPrototypeOf(subject, Test);
    } catch(e) {
      isTypeError = (e instanceof ReferenceError);
    }
    eq(isTypeError, true);
  },
  'It should work with any number of prototype links.': function() {
    var Zero = {
      name: 'zero'
        }

    var one = Object.create(Zero);
    one.name = 'one'

    var two = Object.create(one);

    var result = isPrototypeOf(two, Zero);
    eq(result, true);
    }

});