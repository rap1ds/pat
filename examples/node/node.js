/*jshint node:true */
var myMathLib = require("./examples");

console.log("pow1(2, 2) =>", myMathLib.pow1(2, 2));
console.log("pow2(3, 3) =>", myMathLib.pow1(3, 3));
console.log("pow3(2, 3) =>", myMathLib.pow1(2, 3));
console.log("pow4(4, 2) =>", myMathLib.pow1(4, 2));
console.log("sum1('9', '2', '11') =>", myMathLib.sum1(['9', '2', '11']));
console.log("sum2(9, 2, 11) =>", myMathLib.sum2([9, 2, 11]));