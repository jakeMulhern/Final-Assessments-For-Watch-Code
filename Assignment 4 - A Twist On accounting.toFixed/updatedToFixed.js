/*

Assignment Description:
Your job is to rewrite accounting.toFixed so that it does NOT use multiplication
or exponential notation. Instead, you will actually move the decimal point using 
string manipulation.

*/

/*

Requirements:

1. It should return a string.
2. It should fill in zeros when the precision is longer than the original value passed in.
  // Example: If (1.2, 2) is passed in it should retun 1.20
3. If (''.615', 2) is passed in it should return .62.
4. If ('10.235', 2) is passed in it should return 10.24.
5. If ('1.005', 2) is passed in it should return 1.01.

*/

function myToFixed(value, precision) {
  var decimal = value.indexOf('.');
  var precisionPoint = decimal + precision;
  if (precision > 0) {
    var splitValue = value.split('');
    splitValue.splice(decimal, 1);
    splitValue.splice(precisionPoint, 0, '.');
    var numberToRound = Number(splitValue.join(''))
    var roundedNumber = Math.round(numberToRound);
    var readyForFinalDecimal = roundedNumber.toString().split('');
    readyForFinalDecimal.splice(decimal, 0, '.');
    var result = readyForFinalDecimal;
    result.length = decimal + precision + 1;
    for (j = decimal; j < result.length; j++) {
      if (result[j] === undefined) {
        result[j] = 0;
      }
    }
    var result = result.join('').toString();
    return result;
  } else {
      var result = Math.round(Number(value));
      var result = result.toString();
      return result;
  }

}


tests({

  'It should return a string.': function() {
    var result = myToFixed('1', 0);
    eq(typeof result, 'string');
  },
  'It should fill in zeros when the precision is longer than the original value passed in.': function() {
    var result = myToFixed('1.2', 2);
    eq(result, '1.20');
  },
  "If ('.615', 2) is passed in it should return .62.": function() {
    var result = myToFixed('.615', 2);
    eq(result, '.62');
  },
  "If ('10.235', 2) is passed in it should return 10.24.": function() {
    var result = myToFixed('10.235', 2);
    eq(result, '10.24');
  },
  "If ('1.005', 2) is passed in it should return 1.01.": function() {
    var result = myToFixed('1.005', 2);
    eq(result, '1.01');
  }
  

});