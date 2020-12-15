/*

Your task is to rewrite librarySystem so it accepts dependencies as described below.


librarySystem('name', [], function() {
  return 'Gordon';
});

librarySystem('company', [], function() {
  return 'Watch and Code';
});

librarySystem('workBlurb', ['name', 'company'], function(name, company) {
  return name + ' works at ' + company;
});

librarySystem('workBlurb'); // 'Gordon works at Watch and Code'


*/

(function() {

  var libraryStorage = {};

  function librarySystem(libraryName, dependency, callback) {
    var optionals = [];
      if (arguments.length > 1) {
        if (dependency.length === 0) {
        libraryStorage[libraryName] = callback();
        } else {
          for (i = 0; i < dependency.length; i++) {
            optionals.push(libraryStorage[dependency[i]]);
          }
          libraryStorage[libraryName] = callback.apply(librarySystem, optionals);
        }
      } else {
        return libraryStorage[libraryName];
      }
    }

    window.librarySystem = librarySystem;

  })(); 

// Function(s) provided in assignement for easy reference
librarySystem('name', [], function() {
  return 'Gordon';
});

librarySystem('company', [], function() {
  return 'Watch and Code';
});

librarySystem('workBlurb', ['name', 'company'], function(name, company) {
  return name + ' works at ' + company;
});

librarySystem('workBlurb'); // 'Gordon works at Watch and Code'