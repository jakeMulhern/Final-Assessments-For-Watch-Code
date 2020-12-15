/*

Assignment Description:
Your task is to rewrite librarySystem so that the following code works. 
The only difference is that we're loading the libraries out of order 
(i.e. 'workBlurb' is created before its dependencies, 'name'and 'company').

Code:

librarySystem('workBlurb', ['name', 'company'], function(name, company) {
  return name + ' works at ' + company;
});

librarySystem('name', [], function() {
  return 'Gordon';
});

librarySystem('company', [], function() {
  return 'Watch and Code';
});

librarySystem('workBlurb'); // 'Gordon works at Watch and Code'

*/

/*

Requirements:

1. If more than one argument is passed in, it should create a new library.
2. DONE If only one argument is passed in, it should return the result of running that library.
3. DONE It should pass in dependency variables from other libraries.
4. DONE It should be able to pass in multiple dependencies.
5. DONE It should allow for libraries to be created even when the library needed for a dependency has not been created. (out of order)
6. DONE It should only run callback for each library once.

*/

(function() {
  function Library(name, dependency, callback) {
    this.name = name;
    this.dependency = dependency;
    this.callback = callback;
  }

  libraryStorage = {};
  valueStorage = {};

  function librarySystem(libraryName, dependency, callback) {
    var newName = libraryName;
    var newDep = dependency;
    var newCall = callback;
    if (arguments.length > 1) {
       var newName = new Library(newName, newDep, newCall);
       libraryStorage[libraryName] = newName;
    } else {
      var passedInValues = [];
      for (i = 0; i < libraryStorage[newName].dependency.length; i++) {
        if (valueStorage[libraryStorage[newName].dependency[i]] === undefined) {
          valueStorage[libraryStorage[newName].dependency[i]] = libraryStorage[libraryStorage[newName].dependency[i]].callback();
          passedInValues.push(valueStorage[libraryStorage[newName].dependency[i]]);
        } else {
          passedInValues.push(valueStorage[libraryStorage[newName].dependency[i]]);
        }
        
      }
      if (valueStorage[newName] === undefined) {
        valueStorage[newName] = libraryStorage[newName].callback.apply(null, passedInValues);
      } else {

      }
      return valueStorage[newName];
    }
  }

  window.librarySystem = librarySystem;
})();


tests({

  'If more than one argument is passed in, it should create a new library.': function() {
    eq(typeof libraryStorage['test'], 'undefined')
    librarySystem('test', [], function() {
      return 'test result';
    });
    eq(typeof libraryStorage['test'], 'object')
  },
  'If only one argument is passed in, it should return the result of running that library.': function() {
    librarySystem('test', [], function() {
      return 'test result';
    });

    var result = librarySystem('test');
    eq(result, 'test result');
  },
  'It should pass in dependency variables from other libraries.': function() {
    librarySystem('test', [], function() {
      return 'test result';
    });
    librarySystem('dependency', ['test'], function(test) {
      return 'the dependency works: ' + test;
    });
    var result = librarySystem('dependency');
    eq(result, 'the dependency works: test result');
  },
  'It should be able to pass in multiple dependencies.': function() {
    librarySystem('test1', [], function() {
      return 'test 1';
    });
    librarySystem('test2', [], function() {
      return 'test 2 ';
    });
    librarySystem('finalTest', ['test1', 'test2'], function(test1, test2) {
      return 'passing: ' + test1 + ' passing: ' + test2;
    });
    var result = librarySystem('finalTest');
    eq(result, 'passing: test 1 passing: test 2 ');
  },
  'It should allow for libraries to be created even when the library needed for a dependency has not been created. (out of order)': function() {
    librarySystem('finalTest', ['test1', 'test2'], function(test1, test2) {
      return 'passing: ' + test1 + ' passing: ' + test2;
    });
    librarySystem('test2', [], function() {
      return 'test 2 ';
    });
    librarySystem('test1', [], function() {
      return 'test 1';
    });
    var result = librarySystem('finalTest');
    eq(result, 'passing: test 1 passing: test 2 ');
  },
  'It should only run callback for each library once.': function() {

    var numberOfTimesCallbackHasRun = 0;
    librarySystem('testNumber', [], function() {
      numberOfTimesCallbackHasRun++
      return 'successful';
    });
    librarySystem('testNumber');
    librarySystem('testNumber');
    eq(numberOfTimesCallbackHasRun, 1);
  }
});