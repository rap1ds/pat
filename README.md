# Pattern matching in JavaScript

## Getting Started

```javascript
var pat = require('pat');

var pow = pat()
  .caseof(Number, 0, function() { return 1; })
  .caseof(Number, Number, function(x, y) { 
    return x * pow(x, y - 1 ); 
  });

```

## Why pattern matching?

What is pattern matching? In short, it is a mechanism to choose which variant of a function is the correct one to call. 

Think about a `pow(base, exponent)` function. In fact, `pow` has three variants: 

* If the `exponent` is 0, return 1. 
* If the `exponent` is greater than zero, return the 'normal' `base` to the `exponent` power.
* If the `exponent` is less than 0, return 1 divided by the `base` to the `exponent` power.

When `pow` is called, the function has to choose which variant to use. Traditionally, this is done by if-else comparison. Here's an example of `pow` implementation:

```javascript
function pow1(x, y) {
  if(y === 0) {
    return 1;
  }

  if(y < 0) {
    var isNegative = y < 0;
    y = isNegative ? y * (-1) : y;
  }
  
  var result = x * pow1(x, y - 1);
  return isNegative ? 1 / result : result;
}
```

However, pattern matching let's you get rid of the cubersome `if`s and replace those in more elegant `caseof` control structure.

```javascript
function lessThan(a) {
  return function(b) {
    return b < a;
  }
}

var pow2 = pat(function(x, y) {
    return x * pow2(x, y - 1); 
  })
  .caseof(Number, 0, function() {
    return 1;
  })
  .caseof(Number, lessThan(0), function(x, y) {
    return 1 / pow2(x, (y * (-1)));
  });
```

## Why pattern matching in JavaScript?

JavaScript is dynamically typed language, which means (among other things) that functions can take any number of arguments of any type. The fact that any type is allowed, means that no one warns you if you pass in wrong type. For example, if you pass in `String` when `int` was expected, you might not notice an error if you don't look carefully. Take a `sum` function as an example:

```javascript
function sum(a, b) {
  return a + b;
}
``` 

Obviously, the `sum` is intended to be used with `int`s, but if you pass in `String`, you see no error but a weird result.

```javascript
sum(1, 2) === 3
sum("1", "2") === "12"
```

And the above error is not only a hypothetical error which doesn't happen in a real-world. In fact, it does. Consider a web form with two input fields and a button with a label "Sum". When the "Sum" button is clicked, you take the values of the two inputs, pass them to `sum` function and show the result to the user. But hey! Did you remember that the values from the form are `String`s, not `int`s?

Dynamic typing has both advantages and disadvantages. The above example, lack of compiler warnings demonstrates one of the disadvantages. However, the fact that any argument can be passed to function can be also convenient. We JavaScript devs have learned how to use this to write APIs that can take "almost" any argument, and work properly. For example, it's not too hard to implement the `sum` function so that it in fact could work properly with a `string` or an array of ints or maybe even array of strings.

However, implementing the functions to work with multiple different types of arguments is not very interesting coding task. For example, in the `sum` function, the real beef of the functions is the `a + b`. However, if you'd implement sum to liberally take strings and arrays and whatnot, you'd end up writing 10 lines of if-elses to just get the arguments right.

## Examples

See [examples/](examples/)

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## License
Copyright (c) 2013 Mikko Koski  
Licensed under the MIT license.