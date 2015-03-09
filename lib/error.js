/*
 * mlk / error.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end () {
    module.exports = Object.freeze({
        "RuntimeError": RuntimeError,

        "unboundError"               : unboundError,
        "invalidApplicationError"    : invalidApplicationError,
        "typeError"                  : typeError,
        "notImplementedError"        : notImplementedError,
        "wrongNumberOfArgumentsError": wrongNumberOfArgumentsError,
        "outOfRangeError"            : outOfRangeError,
        "emptyArrayError"            : emptyArrayError
    });
}


function RuntimeError(pos, message) {
    this.pos     = pos;
    this.message = message;
}

RuntimeError.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : RuntimeError
    },
    "toString": {
        "value": function () {
            if (this.pos !== undefined) {
                return this.pos.toString() + ":\n" + this.message;
            }
            else {
                return this.message;
            }
        }
    }
});


function unboundError(pos, name) {
    return new RuntimeError(
        pos,
        "unbound variable: " + name
    );
}

function multipleDeclarationError(pos, name) {
    return new RuntimeError(
        pos,
        "multiple declaration: " + name
    );
}

function invalidApplicationError(pos) {
    return new RuntimeError(
        pos,
        "invalid application"
    );
}

function typeError(pos, expected, actual) {
    return new RuntimeError(
        pos,
        "type mismatch: expect '" + expected + "', actual '" + actual + "'"
    );
}

function notImplementedError(pos, type) {
    return new RuntimeError(
        pos,
        "function not implemented for '" + type + "'"
    );
}

function wrongNumberOfArgumentsError(pos, expected, actual) {
    if (expected >= 0) {
        return new RuntimeError(
            pos,
            "wrong number of arguments: expected " + expected.toString() + ", actual " + actual.toString()
        );
    }
    else {
        return new RuntimeError(
            pos,
            "wrong number of arguments"
        );
    }
}

function outOfRangeError(pos, index) {
    return new RuntimeError(
        pos,
        "index out of range: " + index.toString()
    );
}

function emptyArrayError(pos) {
    return new RuntimeError(
        pos,
        "empty array"
    );
}


end();
