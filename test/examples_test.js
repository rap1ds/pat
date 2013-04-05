"use strict";

var examples = require("../examples/examples");
var expect = require("expect.js");

describe("examples", function(){
  it("pow", function() {
    function test(fn) {
      expect(fn(2, -2)).to.be(0.25);
      expect(fn(2, -1)).to.be(0.5);
      expect(fn(2, 0)).to.be(1);
      expect(fn(2, 1)).to.be(2);
      expect(fn(2, 2)).to.be(4);
      expect(fn(2, 3)).to.be(8);
      expect(fn(2, 4)).to.be(16);
      expect(fn(2, 5)).to.be(32);
      expect(fn(2, 6)).to.be(64);
      expect(fn(2, 7)).to.be(128);
      expect(fn(2, 8)).to.be(256);
      expect(fn(2, 9)).to.be(512);
      expect(fn(2, 10)).to.be(1024);
      expect(function() { fn("foo", "bar") }).to.throwError();
    }

    test(examples.pow1);
    test(examples.pow2);
    test(examples.pow3);
    test(examples.pow4);
  })
});

describe("sum", function(){
  it("sum", function() {
    function test(fn) {
      expect(fn(0, 1, 2, 3, 4, 5)).to.be(15);
      expect(fn("0", "1", "2", "3", "4", "5")).to.be(15);
      expect(fn([0, 1, 2, 3, 4, 5])).to.be(15);
      expect(fn(["0", "1", "2", "3", "4", "5"])).to.be(15);
      expect(fn()).to.be(0);
      expect(fn([])).to.be(0);
    }

    test(examples.sum1);
    test(examples.sum2);
  })
});