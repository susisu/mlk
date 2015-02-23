/*
 * mlk / mlk.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end () {
    module.exports = Object.freeze({
        "core"   : core,
        "error"  : error,
        "parser" : parser,
        "prelude": prelude,

        "parse": parser.parse,
        "run"  : core.run
    });
}

var core    = require("./core.js");
var error   = require("./error.js");
var parser  = require("./parser.js");
var prelude = require("./prelude.js");


end();
