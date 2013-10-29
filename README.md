# Pattern matching in JavaScript

## Installation

```bash
npm install --save patjs
```

## Getting Started

```javascript
var pat = require('patjs');

var pow = pat()
  .caseof(Number, 0, function() { return 1; })
  .caseof(Number, Number, function(x, y) { 
    return x * pow(x, y - 1 ); 
  });
```

## Create pattern matched function

### Syntax 1: Give function as a parameter to `pat`

```javascript
var one = function(n) { return n + " is one"; };
var notOne = function(n) { return n + " is not one"; };

var isOne = pat(notOne)
  .caseof(1, one);

isOne(0) # => "1 is not one"
isOne(1) # => "1 is one"
```

### Syntax 2: Otherwise

```javascript
var one = function(n) { return n + " is one"; };
var notOne = function(n) { return n + " is not one"; };

var isOne = pat()
  .caseof(1, one)
  .otherwise(notOne)

isOne(0) // => "0 is not one"
isOne(1) // => "1 is one"
```

### Primitives

```javascript
var one = function(n) { return n + " is one"; };
var notOne = function(n) { return n + " is not one"; };

var isOne = pat()
  .caseof(1, one)
  .otherwise(notOne)

isOne(0) // => "0 is not one"
isOne(1) // => "1 is one"
```

```javascript
var two = function(str) { return n + " is 2"; };
var notTwo = function(str) { return n + " is not 2"; };

var isTwo = pat()
  .caseof("two", two)
  .otherwise(notTwo)

isTwo("one") // => "one is not 2"
isOne("two") // => "two is 2"
```

```javascript
var theTrue = function(bool) { return bool + " is the truth"; };
var theFalse = function(bool) { return bool + " is not the truth"; };

var isTheTruth = pat()
  .caseof(true, two)
  .otherwise(theFalse)

isTheTruth(true)  // => "one is not 2"
isTheTruth(false) // => "two is 2"
```

### Arrays and objects

```javascript
var arrayOneTwoThree = function(arr) { return "got array 1, 2, 3"; };
var somethingElse = function(x) { return "I don't regocnize " + x; };

var isOneTwoThreeArray = pat()
  .caseof([1, 2, 3], arrayOneTwoThree)
  .otherwise(somethingElse);

isOneTwoThreeArray([1, 1, 1]) // => "I don't regocnize [1, 1, 1]"
isOneTwoThreeArray([1, 2, 3]) // => "got array 1, 2, 3"
```

```javascript
var arrayOfTwo2DPoints = function(arr) { return "got points (1, 2), (3, 4)"; };
var somethingElse = function(x) { return "I don't regocnize " + x; };

var isArrayOfTwo2DPoints = pat()
  .caseof([[1, 2], [3, 4]], arrayOfTwo2DPoints)
  .otherwise(somethingElse);

isArrayOfTwo2DPoints([[1, 1], [2, 2]]) // => "I don't regocnize [[1, 1], [2, 2]]"
isArrayOfTwo2DPoints([[1, 2], [3, 4]]) // => "got points (1, 2), (3, 4)"
```

```javascript
var fullName = function(person) { return [person.firstName, person.lastName].join(" "); };
var somethingElse = function(x) { return ["I don't regocnize person", person.firstName, person.lastName].join(" "); };

var printMikko = pat()
  .caseof({firstName: "Mikko", lastName: "Koski"}, fullName)
  .otherwise(somethingElse);

printMikko({firstName: "John", lastName: "Doe"}) // => "I don't regocnize John Doe"
printMikko({firstName: "Mikko", lastName: "Koski"}) // => "Mikko koski"
```

### Function

```javascript
var fullName = function(person) { return [person.firstName, person.lastName].join(" "); };
var somethingElse = function(x) { return "Invalid person object" };

function isPerson(obj) {
  var person = obj || {};
  return person.firstName && person.lastName;
}

var printAnyName = pat()
  .caseof(isPerson, fullName)
  .otherwise(somethingElse);

printMikko({firstName: "Mikko"})                 // => "Invalid person object"
printMikko({firstName: "John", lastName: "Doe"}) // => "John Doe"
```

### Types

```javascript
var number = function(x) { return x + " is a number!" };
var somethingElse = function(x) { return x + " is not a number" };

var isNumber = pat()
  .caseof(Number)
  .otherwise(somethingElse);

isNumber("hello") // => "hello is not a number"
isNumber(5)       // => "5 is a number!"
```

### Multiple arguments

```javascript
var sum = function(a, b, c) { return a + b + c };
var somethingElse = function() { return "Invalid arguments" };

var sum3 = pat()
  .caseof(Number, Number, Number, sum)
  .otherwise(somethingElse);

sum3(1, 2)    // => "Invalid arguments"
sum3(1, 2, 3) // => 6
```

### Multiple cases

```javascript
var sumNumbers = function(a, b) { return a + b; };
var sumStrings = function(a, b) { return Number(a) + Number(b); };
var somethingElse = function() { return "Invalid arguments" };

var sum = pat()
  .caseof(Number, Number, sumNumbers)
  .caseof(String, String, sumStrings)
  .otherwise(somethingElse);

sum3(1, 2)     // => 3
sum3("2", "3") // => 5
```

### Throws, if no match

```javascript
var sum2 = function(a, b) { return a + b; };

var sum = pat()
  .caseof(Number, Number, sum2)

sum3(3, 4) // => 7
sum3(1)    // => throws
```

### Any (_)

```javascript
var print = function(a, _) { return "got number " + a + " and " + typeof _; };

var fn = pat()
  .caseof(Number, pat._, print)

fn(3, 4)    // => "got number 3 and number"
fn(1, true) // => "got number 3 and boolean"
fn(2) // => "throws"
```

### No arguments

```javascript
var noArguments = function() { return "Great! No arguments!"; };

var fn = pat()
  .caseof(noArguments)

fn()  // => "Great! No arguments!"
fn(1) // => "throws"
```

### Rest (pat.rest)

```javascript
var print = function(a, b, rest) { return "Got " + a + ", " + b + " and [" + rest.join("") + "]"; };

var fn = pat()
  .caseof(Number, Number pat.rest())

fn(1, 2, 3, 4, "five")  // => "Got 1, 2 and [3, 4, five]"
fn(1) // => "throws"
```

```javascript
var print = function(a, b, rest) { return "Got " + a + ", " + b + " and [" + rest.join("") + "]"; };

var fn = pat()
  .caseof(Number, Number pat.rest(Number))

fn(1, 2, 3, 4, "five")  // => throws
fn(1, 2, 3, 4, 5)  // => Got 1, 2 and [3, 4, 5]
```

### All at once (pat.all)

```javascript
var print = function(nums) { return "Sum " + nums.join(" + ") + " is even" };

function sumEven(args) {
  console.log("sum even");
  var sum = args.reduce(function(a, b) { return a + b; });
  return sum % 2 === 0;
}

var fn = pat().caseof(pat.all(sumEven), print)

fn(1, 2, 3, 4)     // => Got 1, 2 and [3, 4, 5]
fn(1, 2, 3, 4, 5)  // => throws
```

### Matcher function to alter the argument

```javascript
var firstOfArray = function(arr) {
  if(Array.isArray(arr)) {
    return pat.val(arr[0]);
  } else {
    return false;
  }
};

var print = function(x) { return "First of array is " + x};

var printFirst = pat().caseof(firstOfArray, print);

printFirst([1, 2, 3, 4]);  // => "First of array is 1"
```

### Nested patters

```javascript
var max = pat().caseof([], function() { return null; }).caseof([Number, pat.rest()], function(x, xs) { 
    var maxXs = max(xs);
    return x > maxXs ? x : maxXs;
  });
```

## Examples

See [examples/](examples/)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Inspiration

* [Coursera - Programming Languages by Dan Grossman](https://www.coursera.org/course/proglang)
* [Standard ML](http://www.smlnj.org/)
* [wu.js](http://fitzgen.github.com/wu.js/)
* [match-js](https://github.com/jfd/match-js)

## License
Copyright (c) 2013 Mikko Koski  
Licensed under the MIT license.
