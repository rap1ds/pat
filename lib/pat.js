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

    function wrapToOption(result, arg) {
      if(result) {
        return some(arg);
      } else {
        return none();
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
      } else {
        matchResult = _.isEqual(patt, arg);
      }

      return wrapToOption(matchResult, arg);
    }

    function matchFirstArguments(pattern, args) {
      var lengthMustMatch = !pattern.rest; // arg length must match if no rest
      var lengthOk = lengthMustMatch ? pattern.args.length === args.length : true;

      var patternArgs = _.first(args, pattern.args.length);

      return lengthOk && _.every(_.zip(pattern.args, patternArgs), function(zipped) {
        var patt = zipped[0], arg = zipped[1];
        return matchArgument(patt, arg).isSome();
      });
    }

    function matchRestArguments(pattern, args) {
      var rest = pattern.rest;
      if(!rest) {
        return true;
      }
      var restArgs = _.tail(args, pattern.args.length);
      return restArgs.every(function(arg) {
        return matchArgument(rest, arg).isSome();
      });
    }

    function matchAll(pattern, args) {
      var all = pattern.all;
      if(!all) {
        return true;
      }
      return all(args);
    }

    function match(patterns, args) {
      var matches = patterns.filter(function(pattern) {
        // all
        if(pattern.all) {
          return matchAll(pattern, args);
        } else {
          return matchFirstArguments(pattern, args) && matchRestArguments(pattern, args);
        }
      });
      return matches[0];
    }

    function pat(f) {
      var patterns = [];
      var otherwise;

      if(f) {
        otherwise = f;
      }

      var wrapper = function() {
        var args = _.toArray(arguments),
          matchedPattern = match(patterns, args);

        if(matchedPattern) {
          return matchedPattern.clbk.apply(this, packRestArguments(matchedPattern, args).concat(wrapper));
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
          allCandidate = _.first(args) || {},
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

        patterns.push(Object.freeze({args: args, rest: rest, clbk: clbk, all: all}));
        return wrapper;
      };

      wrapper.otherwise = function(otherwiseFn) {
        otherwise = otherwiseFn;
        return wrapper;
      };
      
      return wrapper;
    }

    // Match any
    pat._ = function() { return true; };

    // Match rest
    /* If called with some arguments, return function which returns the arguments 
       when called.
    */
    pat.rest = function() {
      var args = _.toArray(arguments);
      if(!args.length) {
        return;
      } else {
        var fn = function() {
          return args[0]; // Ignore all but first
        };
        fn.__pat_rest = true;
        return fn;
      }
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