/*
 * mlk / prelude.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end () {
    module.exports = Object.freeze(prelude);
}

var core  = require("./core.js");
var error = require("./error.js");

var Value    = core.Value;
var DataType = core.DataType;

var _void  = core._void;
var _true  = core._true;
var _false = core._false;

var typeError                   = error.typeError;
var notImplementedError         = error.notImplementedError;
var wrongNumberOfArgumentsError = error.wrongNumberOfArgumentsError;
var outOfRangeError             = error.outOfRangeError;
var emptyArrayError             = error.emptyArrayError;


var prelude = Object.create(null);


// a -> Void
prelude["print"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    console.log(_args[0].show());
    return _void;
});
// a -> a
prelude["id"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    return _args[0];
});
// String -> Number
// String -> Number -> Number
prelude["parseInt"] = new Value(DataType.FUNCTION, function (_args) {
    switch (_args.length) {
        case 1:
            if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
            return new Value(DataType.NUMBER, parseInt(_args[0].data));
        case 2:
            if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
            if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
            return new Value(DataType.NUMBER, parseInt(_args[0].data, Math.floor(_args[1].data)));
        default:
            throw wrongNumberOfArgumentsError(undefined, -1, _args.length);
    }
});
// String -> Number
prelude["parseFloat"] = prelude["negate"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
    return new Value(DataType.NUMBER, parseFloat(_args[0].data));
});
// a -> String
prelude["toString"] = prelude["negate"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    return new Value(DataType.STRING, _args[0].toString());
});
// Number -> Number
prelude["negate"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, -_args[0].data);
});
// Number -> Boolean
prelude["isFinite"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.BOOLEAN, Number.isFinite(_args[0].data));
});
// Number -> Boolean
prelude["isNaN"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.BOOLEAN, Number.isNaN(_args[0].data));
});
// Number -> Boolean
prelude["isInteger"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.BOOLEAN, Number.isInteger(_args[0].data));
});
// Number
prelude["pi"] = new Value(DataType.NUMBER, Math.PI);
// Number -> Number
prelude["abs"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.abs(_args[0].data));
});
// Number -> Number
prelude["ceil"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.ceil(_args[0].data));
});
// Number -> Number
prelude["floor"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.floor(_args[0].data));
});
// Number -> Number
prelude["round"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.round(_args[0].data));
});
// Number -> Number -> Number
prelude["max"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.NUMBER, Math.max(_args[0].data, _args[1].data));
});
// Number -> Number -> Number
prelude["min"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.NUMBER, Math.min(_args[0].data, _args[1].data));
});
// Number -> Number
prelude["sin"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.sin(_args[0].data));
});
// Number -> Number
prelude["cos"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.cos(_args[0].data));
});
// Number -> Number
prelude["tan"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.tan(_args[0].data));
});
// Number -> Number
prelude["asin"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.asin(_args[0].data));
});
// Number -> Number
prelude["acos"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.acos(_args[0].data));
});
// Number -> Number
prelude["atan"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.atan(_args[0].data));
});
// Number -> Number -> Number
prelude["atan2"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.NUMBER, Math.atan2(_args[0].data, _args[1].data));
});
// Number -> Number
prelude["sqrt"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.sqrt(_args[0].data));
});
// Number -> Number
prelude["exp"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.exp(_args[0].data));
});
// Number -> Number
prelude["log"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, Math.log(_args[0].data));
});
// Boolean -> Boolean
prelude["not"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.BOOLEAN) { throw typeError(undefined, DataType.BOOLEAN, _args[0].type); }
    return new Value(DataType.BOOLEAN, !_args[0].data);
});
// String -> Number
// Array -> Number
prelude["length"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    switch (_args[0].type) {
        case DataType.STRING:
            return new Value(DataType.NUMBER, _args[0].data.length);
        case DataType.ARRAY:
            return new Value(DataType.NUMBER, _args[0].data.length);
        default:
            throw notImplementedError(undefined, _args[0].type);
    }
});
// String -> Number -> String
// String -> Number -> Number -> String
// Array -> Number -> Array
// Array -> Number -> Number -> Array
prelude["slice"] = new Value(DataType.FUNCTION, function (_args) {
    switch (_args.length) {
        case 2: switch (_args[0].type) {
            case DataType.STRING:
                if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
                return new Value(
                    DataType.STRING,
                    _args[0].data.slice(Math.floor(_args[1].data))
                );
            case DataType.ARRAY:
                if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
                return new Value(
                    DataType.ARRAY,
                    _args[0].data.slice(Math.floor(_args[1].data))
                );
            default:
                throw notImplementedError(undefined, _args[0].type);
        }
        case 3: switch (_args[0].type) {
            case DataType.STRING:
                if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
                if (_args[2].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[2].type); }
                return new Value(
                    DataType.STRING,
                    _args[0].data.slice(Math.floor(_args[1].data), Math.floor(_args[2].data))
                );
            case DataType.ARRAY:
                if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
                if (_args[2].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[2].type); }
                return new Value(
                    DataType.ARRAY,
                    _args[0].data.slice(Math.floor(_args[1].data), Math.floor(_args[2].data))
                );
            default:
                throw notImplementedError(undefined, _args[0].type);
        }
        default:
            throw wrongNumberOfArgumentsError(undefined, -1, _args.length);
    }
});
// String -> String
// Array -> Array
prelude["reverse"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    switch (_args[0].type) {
        case DataType.STRING:
            return new Value(DataType.STRING, _args[0].data.split("").reverse().join(""));
        case DataType.ARRAY:
            return new Value(DataType.ARRAY, _args[0].data.slice().reverse());
        default:
            throw notImplementedError(undefined, _args[0].type);
    }
});
// Number -> String
prelude["fromCharCode"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.String, String.fromCharCode(Math.floor(_args[0].data)));
});
// String -> Number -> String
prelude["charAt"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.String, _args[0].data.charAt(Math.floor(_args[1].data)));
});
// String -> Number -> Number
prelude["charCodeAt"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.String, _args[0].data.charCodeAt(Math.floor(_args[1].data)));
});
// String -> String -> Number
// String -> String -> Number -> Number
prelude["indexOf"] = new Value(DataType.FUNCTION, function (_args) {
    switch(_args.length) {
        case 2:
            if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
            if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
            return new Value(DataType.NUMBER, _args[0].data.indexOf(_args[1].data));
        case 3:
            if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
            if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
            if (_args[2].type !== DataType.NUMBER) { throw typeError(undefined, DataType.STRING, _args[2].type); }
            return new Value(DataType.NUMBER, _args[0].data.indexOf(_args[1].data, Math.floor(_args[2].data)));
        default:
            throw wrongNumberOfArgumentsError(undefined, -1, _args.length);
    }
});
// String -> String -> Number
// String -> String -> Number -> Number
prelude["lastIndexOf"] = new Value(DataType.FUNCTION, function (_args) {
    switch(_args.length) {
        case 2:
            if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
            if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
            return new Value(DataType.NUMBER, _args[0].data.lastIndexOf(_args[1].data));
        case 3:
            if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
            if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
            if (_args[2].type !== DataType.NUMBER) { throw typeError(undefined, DataType.STRING, _args[2].type); }
            return new Value(DataType.NUMBER, _args[0].data.lastIndexOf(_args[1].data, Math.floor(_args[2].data)));
        default:
            throw wrongNumberOfArgumentsError(undefined, -1, _args.length);
    }
});
// String -> String
prelude["toUpper"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
    return new Value(DataType.STRING, _args[0].data.toUpperCase());
});
// String -> String
prelude["toLower"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
    return new Value(DataType.STRING, _args[0].data.toLowerCase());
});
// String -> String -> String -> String
prelude["replace"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 3) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
    if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
    if (_args[2].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[2].type); }
    return new Value(DataType.STRING, _args[0].data.replace(_args[1].data, _args[2].data));
});
// String -> Number -> String
// String -> Number -> Number -> String
prelude["substr"] = new Value(DataType.FUNCTION, function (_args) {
    switch(_args.length) {
        case 2:
            if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
            if (_args[2].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
            return new Value(
                DataType.STRING,
                _args[0].data.substr(Math.floor(_args[1].data))
            );
        case 3:
            if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
            if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
            if (_args[2].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[2].type); }
            return new Value(
                DataType.STRING,
                _args[0].data.substr(Math.floor(_args[1].data), Math.floor(_args[2].data))
            );
        default:
            throw wrongNumberOfArgumentsError(undefined, -1, _args.length);
    }
});
// String -> String -> Array
prelude["split"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
    if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
    return new Value(
        DataType.ARRAY,
        _args[0].data.split(_args[1].data).map(function (str) { return new Value(DataType.STRING, str); })
    );
});
// Number -> Array
prelude["newArray"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    var length = Math.max(Math.floor(_args[0].data), 0);
    var array = new Array(length);
    for (var i = 0; i < length; i++) {
        array[i] = _void;
    }
    return new Value(DataType.ARRAY, array);
});
// Array -> Array
prelude["copyArray"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    return new Value(DataType.ARRAY, _args[0].data.slice());
});
// Array -> Array -> Array
prelude["concat"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    if (_args[1].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[1].type); }
    return new Value(DataType.ARRAY, _args[0].data.concat(_args[1].data));
});
// Array -> String -> String
prelude["join"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
    return new Value(
        DataType.STRING,
        _args[0].data.map(function (val) { return prelude["toString"].data([val]); }).join(_args[1].data)
    );
});
// Array -> Number -> a -> Void
prelude["writeArray"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 3) { throw wrongNumberOfArgumentsError(undefined, 3, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    var index = Math.floor(_args[1].data);
    var length = _args[0].data.length;
    if (index < 0 || length <= index) { throw outOfRangeError(undefined, index); }
    _args[0].data[index] = _args[2];
    return _void;
});
// Array -> Number -> a
prelude["readArray"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    var index = Math.floor(_args[1].data);
    var length = _args[0].data.length;
    if (index < 0 || length <= index) { throw outOfRangeError(undefined, index); }
    return _args[0].data[index];
});
// Array -> a -> Void
prelude["push"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    _args[0].data.push(_args[1]);
    return _void;
});
// Array -> a
prelude["pop"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    if (_args[0].length === 0) { throw emptyArrayError(undefined); }
    return _args[0].data.pop();
});
// Array -> a -> Void
prelude["unshift"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    _args[0].data.unshift(_args[1]);
    return _void;
});
// Array -> a
prelude["shift"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    if (_args[0].length === 0) { throw emptyArrayError(undefined); }
    return _args[0].data.shift();
});
// Function -> Array -> Boolean
prelude["some"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
    if (_args[1].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[1].type); }
    return new Value(
        DataType.BOOLEAN,
        _args[1].data.some(function (elem) {
            var _test = _args[0].data([elem]);
            if (_test.type !== DataType.BOOLEAN) { throw typeError(undefined, DataType.BOOLEAN, _test.type); }
            return _test.data;
        })
    );
});
// Function -> Array -> Boolean
prelude["every"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
    if (_args[1].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[1].type); }
    return new Value(
        DataType.BOOLEAN,
        _args[1].data.every(function (elem) {
            var _test = _args[0].data([elem]);
            if (_test.type !== DataType.BOOLEAN) { throw typeError(undefined, DataType.BOOLEAN, _test.type); }
            return _test.data;
        })
    );
});
// Function -> Array -> Array
prelude["map"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
    if (_args[1].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[1].type); }
    return new Value(
        DataType.ARRAY,
        _args[1].data.map(function (elem) {
            return _args[0].data([elem]);
        })
    );
});
// Function -> Array -> Void
prelude["forEach"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[0].type); }
    if (_args[1].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[1].type); }
    _args[0].data.forEach(function (elem) {
        return _args[1].data([elem]);
    });
    return _void;
});
// Function -> Array -> Array
prelude["filter"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
    if (_args[1].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[1].type); }
    return new Value(
        DataType.ARRAY,
        _args[1].data.filter(function (elem) {
            var _test = _args[0].data([elem]);
            if (_test.type !== DataType.BOOLEAN) { throw typeError(undefined, DataType.BOOLEAN, _test.type); }
            return _test.data;
        })
    );
});
// Function -> Array -> a
// Function -> a -> Array -> b
prelude["foldl"] = new Value(DataType.FUNCTION, function (_args) {
    switch (_args.length) {
        case 2:
            if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
            if (_args[1].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[1].type); }
            if (_args[1].data.length === 0) { throw emptyArrayError(undefined); }
            return _args[1].data.reduce(
                function (accum, elem) { return _args[0].data([accum, elem]); }
            );
        case 3:
            if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
            if (_args[2].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[2].type); }
            return _args[2].data.reduce(
                function (accum, elem) { return _args[0].data([accum, elem]); },
                _args[1]
            );
        default:
            throw wrongNumberOfArgumentsError(undefined, -1, _args.length);
    }
});
// Function -> Array -> a
// Function -> a -> Array -> b
prelude["foldr"] = new Value(DataType.FUNCTION, function (_args) {
    switch (_args.length) {
        case 2:
            if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
            if (_args[1].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[1].type); }
            if (_args[1].data.length === 0) { throw emptyArrayError(undefined); }
            return _args[1].data.reduceRight(
                function (accum, elem) { return _args[0].data([elem, accum]); }
            );
        case 3:
            if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
            if (_args[2].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[2].type); }
            return _args[2].data.reduceRight(
                function (accum, elem) { return _args[0].data([elem, accum]); },
                _args[1]
            );
        default:
            throw wrongNumberOfArgumentsError(undefined, -1, _args.length);
    }
});
// Function -> Function
prelude["flip"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
    return new Value(DataType.FUNCTION, function (__args) {
        return _args[0].data(__args.slice().reverse());
    });
});
// Function -> Array -> a
prelude["apply"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
    if (_args[1].type !== DataType.ARRAY) { throw typeError(undefined, DataType.ARRAY, _args[1].type); }
    return _args[0].data(_args[1].data);
});
// Array -> Number -> a
prelude["_!!_"] = prelude["readArray"];
// Function -> Function -> Function
prelude["_._"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
    if (_args[1].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[1].type); }
    return new Value(DataType.FUNCTION, function (__args) {
        return _args[0].data([_args[1].data(__args)]);
    });
});
// Number -> Number -> Number
prelude["_**_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.NUMBER, Math.pow(_args[0].data, _args[1].data));
});
// Number -> Number -> Number
prelude["_*_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.NUMBER, _args[0].data * _args[1].data);
});
// Number -> Number -> Number
prelude["_/_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.NUMBER, _args[0].data / _args[1].data);
});
// Number -> Number -> Number
prelude["_%_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.NUMBER, _args[0].data % _args[1].data);
});
// Number -> Number
prelude["+_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 1) { throw wrongNumberOfArgumentsError(undefined, 1, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    return new Value(DataType.NUMBER, _args[0].data);
});
// Number -> Number
prelude["-_"] = prelude["negate"];
// Number -> Number -> Number
prelude["_+_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.NUMBER, _args[0].data + _args[1].data);
});
// Number -> Number -> Number
prelude["_-_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[0].type); }
    if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
    return new Value(DataType.NUMBER, _args[0].data - _args[1].data);
});
// String -> String -> String
prelude["_++_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[0].type); }
    if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
    return new Value(DataType.STRING, _args[0].data + _args[1].data);
});
// a -> a -> Boolean
prelude["_==_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== _args[1].type) { throw typeError(undefined, _args[0].type, _args[1].type); }
    return new Value(DataType.BOOLEAN, _args[0].data === _args[1].data);
});
// a -> a -> Boolean
prelude["_!=_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== _args[1].type) { throw typeError(undefined, _args[0].type, _args[1].type); }
    return new Value(DataType.BOOLEAN, _args[0].data !== _args[1].data);
});
// Number -> Number -> Boolean
// String -> String -> Boolean
prelude["_<_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    switch (_args[0].type) {
        case DataType.NUMBER:
            if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
            return new Value(DataType.BOOLEAN, _args[0].data < _args[1].data);
        case DataType.STRING:
            if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
            return new Value(DataType.BOOLEAN, _args[0].data < _args[1].data);
        default:
            throw notImplementedError(undefined, _args[0].type);
    }
});
// Number -> Number -> Boolean
// String -> String -> Boolean
prelude["_>_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    switch (_args[0].type) {
        case DataType.NUMBER:
            if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
            return new Value(DataType.BOOLEAN, _args[0].data > _args[1].data);
        case DataType.STRING:
            if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
            return new Value(DataType.BOOLEAN, _args[0].data > _args[1].data);
        default:
            throw notImplementedError(undefined, _args[0].type);
    }
});
// Number -> Number -> Boolean
// String -> String -> Boolean
prelude["_<=_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    switch (_args[0].type) {
        case DataType.NUMBER:
            if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
            return new Value(DataType.BOOLEAN, _args[0].data <= _args[1].data);
        case DataType.STRING:
            if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
            return new Value(DataType.BOOLEAN, _args[0].data <= _args[1].data);
        default:
            throw notImplementedError(undefined, _args[0].type);
    }
});
// Number -> Number -> Boolean
// String -> String -> Boolean
prelude["_>=_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    switch (_args[0].type) {
        case DataType.NUMBER:
            if (_args[1].type !== DataType.NUMBER) { throw typeError(undefined, DataType.NUMBER, _args[1].type); }
            return new Value(DataType.BOOLEAN, _args[0].data >= _args[1].data);
        case DataType.STRING:
            if (_args[1].type !== DataType.STRING) { throw typeError(undefined, DataType.STRING, _args[1].type); }
            return new Value(DataType.BOOLEAN, _args[0].data >= _args[1].data);
        default:
            throw notImplementedError(undefined, _args[0].type);
    }
});
// Boolean -> Boolean -> Boolean
prelude["_&&_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.BOOLEAN) { throw typeError(undefined, DataType.BOOLEAN, _args[0].type); }
    if (_args[1].type !== DataType.BOOLEAN) { throw typeError(undefined, DataType.BOOLEAN, _args[1].type); }
    return new Value(DataType.BOOLEAN, _args[0].data && _args[1].data);
});
// Boolean -> Boolean -> Boolean
prelude["_||_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.BOOLEAN) { throw typeError(undefined, DataType.BOOLEAN, _args[0].type); }
    if (_args[1].type !== DataType.BOOLEAN) { throw typeError(undefined, DataType.BOOLEAN, _args[1].type); }
    return new Value(DataType.BOOLEAN, _args[0].data || _args[1].data);
});
// Function -> a -> b
prelude["_$_"] = new Value(DataType.FUNCTION, function (_args) {
    if (_args.length !== 2) { throw wrongNumberOfArgumentsError(undefined, 2, _args.length); }
    if (_args[0].type !== DataType.FUNCTION) { throw typeError(undefined, DataType.FUNCTION, _args[0].type); }
    return _args[0].data([_args[1]]);
});


end();
