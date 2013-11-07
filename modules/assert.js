//imports
var util = require("util");

//api
exports.ok = ok;
exports.equal = equal;
exports.notEqual = notEqual;
exports.strictEqual = strictEqual;
exports.notStrictEqual = notStrictEqual;
exports.throws = throws;
exports.doesNotThrown = doesNotThrown;

function raise(msg1, msg2) {
  throw new AssertionError(msg1 || msg2);
}

/**
 * An assertion error.
 */
function AssertionError(msg) {
  Error.call(this, msg);
}

util.inherits(AssertionError, Error);

/**
 * Value must be true.
 * 
 * @param value Received value.
 * @param msg   Error message.
 */
function ok(value, msg) {
  equal(value, true, msg);
}

/**
 * Coercive equality (==).
 * 
 * @param actual   Received value.
 * @param expected Expected value.
 * @param msg      Error message.
 */
function equal(actual, expected, msg) {
  if (actual != expected) {
    raise(msg, actual + " == " + expected);
  }
}

/**
 * Coercive not-equality (!=).
 * 
 * @param actual   Received value.
 * @param expected Expected value.
 * @param msg      Error message.
 */
function notEqual(actual, expected, msg) {
  if (actual == expected) {
    raise(msg, actual + " != " + expected);
  }
}

/**
 * Strict equality (===).
 * 
 * @param actual   Received value.
 * @param expected Expected value.
 * @param msg      Error message.
 */
function strictEqual(actual, expected, msg) {
  if (actual !== expectec) {
    raise(msg, actual + " === " + expected);
  }
}

/**
 * Strict not-equality (!==).
 * 
 * @param actual   Received value.
 * @param expected Expected value.
 * @param msg      Error message.
 */
function notStrictEqual(actual, expected, msg) {
  if (actual === expected) {
    raise(msg, actual + " !== " + expected);
  }
}

/**
 * Expects to catch an error.
 * 
 * @param fn    Function to execute: fn().
 * @param error Error to catch. If not specified, anyone.
 * @param msg   Error message.
 */
function throws(fn, error, msg) {
  try {
    fn();
    raise(msg, "Missing expected exception (" + error + ").");
  } catch(e) {
    if (error) {
      if (! (e instanceof error)) {
        raise(msg, "Missing expected exception (" + error + ").");
      }
    }
  }  
}

/**
 * Not expected to catch an error.
 * 
 * @param fn  Function to execute: fn().
 * @param msg Error message.
 */
function doesNotThrown(fn, msg) {
  try {
    fn();
  } catch(e) {
    raise(msg, "No error/exception expected.");
  }
}