var pat = require("../lib/pat");
var expect = require("expect.js");

/**
  # Pattern matching in JavaScript

  ## Installation

  ```bash
  npm install --save patjs
  ```
*/

/**
  ## Getting Started

  ```js
  var pat = require("pat");
  ```
*/
describe("getting started", function(){
  it("first example", function() {
    /**
      ```js
    */
    var pow = pat()
      .caseof(Number, 0, function() { return 1; })
      .caseof(Number, Number, function(x, y) { 
        return x * pow(x, y - 1 ); 
      });

    expect(pow(3, 2)).to.eql(9);
    /**
      ```
    */
  });
});

/**
  ## Create pattern matched function
*/
describe("create patter matched function", function() {

  it("syntax1", function() {
    /**
      ### Syntax 1: Give function as a parameter to `pat`

      ```js
    */
    var one = function(n) { return n + " is one"; };
    var notOne = function(n) { return n + " is not one"; };

    var isOne = pat(notOne)
      .caseof(1, one);

    expect(isOne(0)).to.eql("0 is not one");
    expect(isOne(1)).to.eql("1 is one");
    /**
      ```
    */
  });

  it("syntax2", function() {
    /**
      ### Syntax 2: Otherwise

      ```js
    */
    var one = function(n) { return n + " is one"; };
    var notOne = function(n) { return n + " is not one"; };

    var isOne = pat()
      .caseof(1, one)
      .otherwise(notOne)

    expect(isOne(0)).to.eql("0 is not one");
    expect(isOne(1)).to.eql("1 is one");
    /**
      ```
    */
  });
});

/**
  ### Primitives
*/
describe("primitives", function() {
  it("numbers", function() {
    /**
    ```js
    */
    var one = function(n) { return n + " is one"; };
    var notOne = function(n) { return n + " is not one"; };

    var isOne = pat()
      .caseof(1, one)
      .otherwise(notOne)

    expect(isOne(0)).to.eql("0 is not one");
    expect(isOne(1)).to.eql("1 is one");
    /**
    ```
    */
  });

  it("strings", function() {
    /**
      ```js
    */
    var two = function(str) { return str + " is 2"; };
    var notTwo = function(str) { return str + " is not 2"; };

    var isTwo = pat()
      .caseof("two", two)
      .otherwise(notTwo)

    expect(isTwo("one")).to.eql("one is not 2");
    expect(isTwo("two")).to.eql("two is 2");
    /**
    ```
    */
  });

  it("boolean", function() {
    /**
      ```js
    */
    var theTrue = function(bool) { return bool + " is the truth"; };
    var theFalse = function(bool) { return bool + " is not the truth"; };

    var isTheTruth = pat()
      .caseof(true, theTrue)
      .otherwise(theFalse)

    expect(isTheTruth(true)).to.eql("true is the truth");
    expect(isTheTruth(false)).to.eql("false is not the truth");
    /**
    ```
    */
  });
});

/**
  ### Arrays and objects
*/
describe("arrays and objects", function() {
  it("arrays", function() {
    /**
      ```js
    */
    var arrayOneTwoThree = function(arr) { return "got array 1, 2, 3"; };
    var somethingElse = function(x) { return "I don't regocnize " + x.join(", "); };

    var isOneTwoThreeArray = pat()
      .caseof([1, 2, 3], arrayOneTwoThree)
      .otherwise(somethingElse);

    expect(isOneTwoThreeArray([1, 1, 1])).to.eql("I don't regocnize 1, 1, 1");
    expect(isOneTwoThreeArray([1, 2, 3])).to.eql("got array 1, 2, 3");
    /**
      ```
    */
  });

  it("nested arrays", function() {
    /**
      ```js
    */
    var arrayOfTwo2DPoints = function(arr) { return "got points (1, 2), (3, 4)"; };
    var somethingElse = function(x) { return "I don't regocnize " + x.join(", "); };

    var isArrayOfTwo2DPoints = pat()
      .caseof([[1, 2], [3, 4]], arrayOfTwo2DPoints)
      .otherwise(somethingElse);

    expect(isArrayOfTwo2DPoints([[1, 1], [2, 2]])).to.eql("I don't regocnize 1,1, 2,2");
    expect(isArrayOfTwo2DPoints([[1, 2], [3, 4]])).to.eql("got points (1, 2), (3, 4)");
    /**
      ```
    */
  });

  it("objects", function() {
    /**
      ```js
    */
    var fullName = function(person) { return [person.firstName, person.lastName].join(" "); };
    var somethingElse = function(person) { return ["I don't regocnize", person.firstName, person.lastName].join(" "); };

    var printMikko = pat()
      .caseof({firstName: "Mikko", lastName: "Koski"}, fullName)
      .otherwise(somethingElse);

    expect(printMikko({firstName: "John", lastName: "Doe"})).to.eql("I don't regocnize John Doe");
    expect(printMikko({firstName: "Mikko", lastName: "Koski"})).to.eql("Mikko Koski");
    /**
      ```
    */
  });
});

/**
  ### Function
*/
describe("function", function() {
  it("takes function", function() {
    /**
      ```js
    */
    var fullName = function(person) { return [person.firstName, person.lastName].join(" "); };
    var somethingElse = function() { return "Invalid person object" };

    function isPerson(obj) {
      var person = obj || {};
      return person.firstName && person.lastName;
    }

    var printAnyName = pat()
      .caseof(isPerson, fullName)
      .otherwise(somethingElse);

    printAnyName({firstName: "Mikko"});                 // => "Invalid person object"
    printAnyName({firstName: "John", lastName: "Doe"}); // => "John Doe"
    /**
      ```
    */
  });
});

/**
  ### Types
*/
describe("types", function() {
  it("can match a type", function() {
    /**
      ```js
    */
    var number = function(x) { return x + " is a number!" };
    var somethingElse = function(x) { return x + " is not a number" };

    var isNumber = pat()
      .caseof(Number, number)
      .otherwise(somethingElse);

    expect(isNumber("hello")).to.eql("hello is not a number");
    expect(isNumber(5)).to.eql("5 is a number!");
    /**
      ```
    */
  });
});

/**
  ### Multiple arguments
*/
describe("multiple arguments", function() {
  it("allows multiple arguments", function() {
    /**
      ```js
    */
    var sum = function(a, b, c) { return a + b + c };
    var somethingElse = function() { return "Invalid arguments" };

    var sum3 = pat()
      .caseof(Number, Number, Number, sum)
      .otherwise(somethingElse);

    expect(sum3(1, 2)).to.eql("Invalid arguments");
    expect(sum3(1, 2, 3)).to.eql(6);
    /**
      ```
    */
  });
});

/**
  ### Multiple cases
*/
describe("multiple cases", function() {
  it("allows multiple cases", function() {
    /**
      ```js
    */
    var sumNumbers = function(a, b) { return a + b; };
    var sumStrings = function(a, b) { return Number(a) + Number(b); };
    var somethingElse = function() { return "Invalid arguments" };

    var sum = pat()
      .caseof(Number, Number, sumNumbers)
      .caseof(String, String, sumStrings)
      .otherwise(somethingElse);

    expect(sum(1, 2)).to.eql(3);
    expect(sum("2", "3")).to.eql(5);
    /**
      ```
    */
  });
});

/**
  ### Throws, if no match
*/

describe("throws, if not match", function() {
  it("throws", function() {
    /**
      ```js
    */
    var sum2 = function(a, b) { return a + b; };

    var sum = pat()
      .caseof(Number, Number, sum2);

    expect(sum(3, 4)).to.eql(7);
    expect(function() { sum(1); }).to.throwException();
    /**
      ```
    */
  });
});

/**
  ### Any (_)
*/

describe("any", function() {
  it("allows any parameter", function() {
    /**
      ```javascript
    */
    var print = function(a, _) { return "got number " + a + " and " + typeof _; };

    var fn = pat()
      .caseof(Number, pat._, print)

    expect(fn(3, 4)).to.eql("got number 3 and number");
    expect(fn(1, true)).to.eql("got number 1 and boolean");
    expect(function() { fn(2); }).to.throwException("throws");
    /**
      ```
    */
  });
});

/**
  ### No arguments
*/

describe("no arguments", function() {
  it("matches if no arguments", function() {
    /**
      ```js
    */
    var noArguments = function() { return "Great! No arguments!"; };

    var fn = pat()
      .caseof(noArguments)

    expect(fn()).to.eql("Great! No arguments!");
    expect(function() { fn(1); }).to.throwException("throws");
    /**
      ```
    */
  })
});

/**
  ### Rest
*/

describe("rest", function() {
  it("matches the rest of the arguments", function() {
    /**
      ```js
    */
    var print = function(a, b, rest) { return "Got " + a + ", " + b + " and [" + rest.join(", ") + "]"; };

    var fn = pat()
      .caseof(Number, Number, pat.rest(), print)

    expect(fn(1, 2, 3, 4, "five")).to.eql("Got 1, 2 and [3, 4, five]");
    expect(function() { fn(1); }).to.throwException("throws");
    /**
      ```
    */
  });
});

/**
  ### Rest with type
*/

describe("rest with type", function() {
  it("matches the rest of the arguments if they match the given type", function() {
    /**
      ```js
    */
    var print = function(a, b, rest) { return "Got " + a + ", " + b + " and [" + rest.join(", ") + "]"; };

    var fn = pat()
      .caseof(Number, Number, pat.rest(Number), print)

    expect(fn(1, 2, 3, 4, 5)).to.eql("Got 1, 2 and [3, 4, 5]");
    expect(function() { fn(1, 2, 3, 4, "five"); }).to.throwException();
    /**
      ```
    */
  });
});

/**
  ### All at once (pat.all)
*/

describe("all", function() {
  it("matches all at once", function() {
    /**
      ```javascript
    */
    var print = function(nums) { return "Sum " + nums.join(" + ") + " is even" };

    function sumEven(args) {
      var sum = args.reduce(function(a, b) { return a + b; });
      return sum % 2 === 0;
    }

    var fn = pat().caseof(pat.all(sumEven), print)

    expect(fn(1, 2, 3, 4)).to.eql("Sum 1 + 2 + 3 + 4 is even");
    expect(function() { fn(1, 2, 3, 4, 5); }).to.throwException("throws");
    /**
      ```
    */
  })
});

/**
  ### Matcher function to alter the argument
*/

describe("argument modifying", function() {
  it("returns modified argument", function() {
    /**
      ```js
    */
    var firstOfArray = function(arr) {
      if(Array.isArray(arr)) {
        return pat.val(arr[0]);
      } else {
        return false;
      }
    };

    var print = function(x) { return "First of array is " + x};

    var printFirst = pat().caseof(firstOfArray, print);

    expect(printFirst([1, 2, 3, 4])).to.eql("First of array is 1");
    /**
      ```
    */
  });
});

/**
  ### Nested patters
*/

describe("nested patterns", function() {
  it("allows nested patterns", function() {
    /**
      ```js
    */
    var max = pat()
      .caseof([], function() { throw "maximum of an empty array" })
      .caseof([Number], function(x) { return x; })
      .caseof([Number, pat.rest()], function(x, xs) { 
        var maxXs = max(xs);
        return x > maxXs ? x : maxXs;
      });

    expect(max([1, 6, 4, 5, 7, 91, 53, 73])).to.eql(91)
    /**
      ```
    */
  });
});

/**
  ## Contributing
  
  1. Fork
  1. Add a unit test
  1. Add an example to README
  1. Lint
  1. Open a pull request

  ## Inspiration

  * [Coursera - Programming Languages by Dan Grossman](https://www.coursera.org/course/proglang)
  * [Standard ML](http://www.smlnj.org/)
  * [wu.js](http://fitzgen.github.com/wu.js/)
  * [match-js](https://github.com/jfd/match-js)

  ## License
  Copyright (c) 2013 Mikko Koski  
  Licensed under the MIT license.
*/