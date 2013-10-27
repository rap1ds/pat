/*
 * pat
 * https://github.com/mikko/pat
 *
 * Copyright (c) 2013 Mikko Koski
 * Licensed under the MIT license.
 */

(function() {
  "use strict";

  function createPat(_) {

    /* pack rest arguments to an array */
    function packRestArguments(pattern, args) {
      if(pattern.all) {
        return [args];
      } else if(pattern.rest) {
        var firstArgs = _.head(args, pattern.args.length);
        var restArgs = _.tail(args, pattern.args.length);
        firstArgs.push(restArgs);
        return firstArgs;
      } else {
        return args;
      }
    }

    function isConstructor(f) {
      return f === String ||
        f === Number ||
        f === Boolean ||
        f === Array ||
        f === Object;
    }

    function isPlainFunction(f) {
      return _.isFunction(f) && !isConstructor(f);
    }

    // Micro Option implementation
    function some(val) {
      return {
        isSome: function() { return true; },
        val: function() { return val; }
      };
    }

    function none() {
      return {
        isSome: function() { return false; }
      };
    }

    function allSome(xs) {
      return _.every(xs, function(x) {
        return x.isSome();
      });
    }

    function flatSome(xs) {
      var shallow = true;
      return some(_.flatten(_.map(xs, function(x) {
        return x.val();
      }), shallow));
    }

    function wrapToOption(result, arg) {
      if(result === true) {
        return some([arg]);
      } else if (result === false) {
        return none();
      } else {
        return result;
      }
    }

    function matchArgument(patt, arg) {
      var matchResult;
      if(_.isFunction(patt)) {
        if(patt === String) { patt = _.isString; }
        if(patt === Number) { patt = _.isNumber; }
        if(patt === Boolean) { patt = _.isBoolean; }
        if(patt === Array) { patt = _.isArray; }
        if(patt === Object) { patt = _.isObject; }
        matchResult = patt(arg);
      } else if(patt.__pat_pattern) {
        matchResult = matchPattern(patt, arg);
      } else {
        matchResult = _.isEqual(patt, arg);
      }

      return wrapToOption(matchResult, arg);
    }

    function matchFirstArguments(pattern, args) {
      var lengthMustMatch = !pattern.rest; // arg length must match if no rest
      var lengthOk = lengthMustMatch ? pattern.args.length === args.length : true;

      var patternArgs = _.first(args, pattern.args.length);

      if(!lengthOk) {
        return none();
      } else {
        var matchResults = _.map(_.zip(pattern.args, patternArgs), function(zipped) {
          var patt = zipped[0], arg = zipped[1];
          return matchArgument(patt, arg);
        });

        if(allSome(matchResults)) {
          return flatSome(matchResults);
        } else {
          return none();
        }
      }
    }

    function matchRestArguments(pattern, args) {
      var rest = pattern.rest;
      if(!rest) {
        return some();
      }
      var restArgs = _.tail(args, pattern.args.length);
      var matchResults = restArgs.map(function(arg) {
        return matchArgument(rest, arg);
      });

      if(allSome(matchResults)) {
        return flatSome(matchResults);
      } else {
        return none();
      }
    }

    function matchAll(pattern, args) {
      var all = pattern.all;
      if(!all) {
        return some();
      }
      return wrapToOption(all(args), args);
    }

    function matchPattern(pattern, args) {
      // all
      if(pattern.all) {
        var matchAllResult = matchAll(pattern, args);
        if(matchAllResult.isSome()) {
          return some(matchAllResult.val());
        } else {
          return none();
        }
      } else {
        var firstArgsResult = matchFirstArguments(pattern, args);
        var restArgsResult = matchRestArguments(pattern, args);
        
        if(firstArgsResult.isSome() && restArgsResult.isSome()) {
          var rest = restArgsResult.val();

          if(rest) {
            return some(firstArgsResult.val().concat([rest]));
          } else {
            return some(firstArgsResult.val());
          }
        } else {
          return none();
        }
      }
    }

    function match(patterns, args) {
      var matches = patterns.map(function(pattern) {
        var matchedArgs = matchPattern(pattern, args);

        if(matchedArgs.isSome()) {
          return some({pattern: pattern, args: matchedArgs.val()});
        } else {
          return none();
        }

      }).filter(function(patternOption) {
        return patternOption.isSome();
      });
      return matches.length ? matches[0] : none();
    }

    function createPattern(args) {
      var allCandidate = _.first(args) || {},
        all,
        restCandidate = _.last(args) || {},
        rest;
        
      if(restCandidate.__pat_rest) {
        rest = restCandidate();
        args = _.initial(args);
      }

      if(allCandidate.__pat_all) {
        all = allCandidate();
      }

      args = args.map(function(arg) {
        if(isNested(arg)) {
          return createPattern(arg);
        } else {
          return arg;
        }
      });

      return {args: args, rest: rest, all: all, __pat_pattern: true};
    }

    function isNested(arr) {
      return _.isArray(arr) && !_.isEmpty(arr) && _.some(arr, function(x) {
        return _.isFunction(x) || isNested(x);
      });
    }

    function createFunctionWrapper(f) {
      var patterns = [];
      var otherwise;

      if(f) {
        otherwise = f;
      }

      var wrapper = function() {
        var args = _.toArray(arguments),
          matchResult = match(patterns, args);

        if(matchResult.isSome()) {
          var matchedPattern = matchResult.val().pattern;
          var matchedArgs = matchResult.val().args;
          return matchedPattern.clbk.apply(this, matchedArgs.concat(wrapper));
        } else {
          if(otherwise) {
            return otherwise.apply(this, args.concat(wrapper));
          } else {
            throw new Error("Illegal arguments");
          }
        }
      };

      wrapper.caseof = function() {
        var clbk = _.last(arguments),
          args = _.initial(arguments),
          pattern = createPattern(args);

        patterns.push(Object.freeze(_.extend(pattern, {clbk: clbk})));
        return wrapper;
      };

      wrapper.otherwise = function(otherwiseFn) {
        otherwise = otherwiseFn;
        return wrapper;
      };
      
      return wrapper;
    }

    function pat(f) {
      if(_.isUndefined(f) || isPlainFunction(f)) {
        return createFunctionWrapper(f);
      } else {
        return pat.pat.apply(null, arguments);
      }
    }

    // Match any
    pat._ = function() { return true; };

    // Match rest
    /* If called with some arguments, return function which returns the arguments 
       when called.
    */
    pat.rest = function() {
      var args = _.toArray(arguments);
      var matcher = args.length ? args[0] : function() { return true; };
      var fn = function() {
        return matcher;
      };
      fn.__pat_rest = true;
      return fn;
    };

    pat.all = function() {
      var args = _.toArray(arguments);
      if(!args.length) {
        return;
      } else {
        var fn = function() {
          return args[0]; // Ignore all but first
        };
        fn.__pat_all = true;
        return fn;
      }
    };

    pat.pat = function() {
      return createPattern(_.toArray(arguments));
    };

    pat.val = function() {
      return some(_.toArray(arguments));
    };

    pat.rest.__pat_rest = true;

    return pat;
  }
 
  // Export
  (function() {
    /*global module: false */
    /*global require: false */
    /*global define: false */
    if (typeof module !== "undefined" && module !== null) {
      // CommonJS
      var _ = require("lodash");
      module.exports = createPat(_);
    } else {
      if (typeof define === 'function') {
        // AMD RequireJS
        define('pat', ['lodash'], function(_) {
          return createPat(_);
        });
      }

      // window.pat
      if (typeof this._ !== "undefined" && this._ !== null) {
        this.pat = createPat(this._);
      }
    }
  })();

})(this);