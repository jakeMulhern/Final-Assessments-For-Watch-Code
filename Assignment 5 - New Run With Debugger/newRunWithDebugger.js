/*

Assignment Description:
Create your own function that automatically runs a given 
function in the devTools debugger.

*/

function newRunWithDebugger(ourFunction, optionals) {
  debugger;

  var result = ourFunction.apply(null, optionals);
  return result;
};

// Function provided in assignement for easy reference
function sayFullName(first, last) {
  console.log(first + ' '  + last);
};