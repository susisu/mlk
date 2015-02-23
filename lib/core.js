/*
 * mlk / core.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end () {
    module.exports = Object.freeze({
        "Value"   : Value,
        "DataType": DataType,

        "_void" : _void,
        "_true" : _true,
        "_false": _false,

        "Literal"     : Literal,
        "ArrayLiteral": ArrayLiteral,
        "Variable"    : Variable,
        "Lambda"      : Lambda,
        "Application" : Application,
        "Procedure"   : Procedure,
        "Declaration" : Declaration,
        "IfElse"      : IfElse,
        "While"       : While,

        "run": run
    });
}

var error = require("./error.js");

var RuntimeError            = error.RuntimeError;
var unboundError            = error.unboundError;
var invalidApplicationError = error.invalidApplicationError;
var typeError               = error.typeError;


var DataType = Object.freeze({
    "NUMBER"  : "number",
    "STRING"  : "string",
    "BOOLEAN" : "boolean",
    "VOID"    : "void",
    "FUNCTION": "function",
    "ARRAY"   : "array"
});

function Value(type, data) {
    this.type = type;
    this.data = data;
}

Value.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : Value
    },
    "toString": {
        "value": function () {
            switch (this.type) {
                case DataType.NUMBER:
                    return this.data.toString();
                case DataType.STRING:
                    return this.data;
                case DataType.BOOLEAN:
                    return this.data ? "True" : "False";
                case DataType.VOID:
                    return "Void";
                case DataType.FUNCTION:
                    return "<function>";
                case DataType.ARRAY:
                    return this.data.map(function (value) { return value.toString(); }).join(",");
                default:
                    return "<?>";
            }
        }
    },
    "show": {
        "value": function () {
            switch (this.type) {
                case DataType.NUMBER:
                    return this.data.toString();
                case DataType.STRING:
                    return lq.show(this.data);
                case DataType.BOOLEAN:
                    return this.data ? "True" : "False";
                case DataType.VOID:
                    return "Void";
                case DataType.FUNCTION:
                    return "<function>";
                case DataType.ARRAY:
                    return "[" + this.data.map(function (value) { return value.show(); }).join(", ") + "]";
                default:
                    return "<?>";
            }
        }
    }
});

var _void  = new Value(DataType.VOID, undefined);
var _true  = new Value(DataType.BOOLEAN, true);
var _false = new Value(DataType.BOOLEAN, false);


function Literal(pos, value) {
    this.pos   = pos;
    this.value = value;
}

Literal.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : Literal
    },
    "evaluate": {
        "value": function (env) {
            return this.value;
        }
    }
});

function ArrayLiteral(pos, elements) {
    this.pos      = pos;
    this.elements = elements;
}
ArrayLiteral.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : ArrayLiteral
    },
    "evaluate": {
        "value": function (env) {
            return new Value(
                DataType.ARRAY,
                this.elements.map(function (element) { return element.evaluate(env); })
            );
        }
    }
});

function Variable(pos, name) {
    this.pos  = pos;
    this.name = name;
}

Variable.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : Variable
    },
    "evaluate": {
        "value": function (env) {
            if (env[this.name] !== undefined) {
                return env[this.name];
            }
            else {
                throw unboundError(this.pos, this.name);
            }
        }
    }
});

function Lambda(pos, argNames, body) {
    this.pos      = pos;
    this.argNames = argNames;
    this.body     = body;
}

Lambda.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : Lambda
    },
    "evaluate": {
        "value": function (env) {
            // var pos      = this.pos;
            var argNames = this.argNames;
            var body     = this.body;
            return new Value(DataType.FUNCTION, function (_args) {
                var local = Object.create(env);
                local["arguments"] = new Value(DataType.ARRAY, _args);
                var numArgs = _args.length;
                for (var i = 0; i < argNames.length; i++) {
                    if (i < numArgs) {
                        local[argNames[i]] = _args[i];
                    }
                    else {
                        local[argNames[i]] = _void;
                    }
                }

                // try {
                    return body.evaluate(local);
                // }
                // catch (error) {
                //     throw new RuntimeError(pos, error.toString());
                // }
            });
        }
    }
});

function Application(pos, func, args) {
    this.pos  = pos;
    this.func = func;
    this.args = args;
}

Application.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : Application
    },
    "evaluate": {
        "value": function (env) {
            var _func;
            var _args;
            // try {
                _func = this.func.evaluate(env);
                _args = this.args.map(function (arg) { return arg.evaluate(env); });
            // }
            // catch (error) {
            //     throw new RuntimeError(this.pos, error.toString());
            // }

            if (_func.type === DataType.FUNCTION) {
                try {
                    return _func.data(_args);
                }
                catch (error) {
                    throw new RuntimeError(this.pos, error.toString());
                }
            }
            else {
                throw invalidApplicationError(this.pos);
            }
        }
    }
});

function Procedure(pos, exprs) {
    this.pos   = pos;
    this.exprs = exprs;
}

Procedure.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : Procedure
    },
    "evaluate": {
        "value": function (env) {
            var _result = _void;
            // try {
                for (var i = 0; i < this.exprs.length; i++) {
                    _result = this.exprs[i].evaluate(env);
                }
            // }
            // catch (error) {
            //     throw new RuntimeError(this.pos, error.toString());
            // }
            return _result;
        }
    }
});

function Declaration(pos, name, expr) {
    this.pos  = pos;
    this.name = name;
    this.expr = expr;
}

Declaration.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : Declaration
    },
    "evaluate": {
        "value": function (env) {
            var _value;
            // try {
                _value = this.expr.evaluate(env);
            // }
            // catch (error) {
            //     throw new RuntimeError(this.pos, error.toString());
            // }

            // if (env[this.name] === undefined) {
                env[this.name] = _value;
            // }
            // else {
            //     throw new RuntimeError(this.pos, "multiple definition: " + this.name);
            // }

            return _value;
        }
    }
});

function IfElse(pos, test, consequent, alternative) {
    this.pos         = pos;
    this.test        = test;
    this.consequent  = consequent;
    this.alternative = alternative;
}

IfElse.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : IfElse
    },
    "evaluate": {
        "value": function (env) {
            var _test;
            // try {
                _test = this.test.evaluate(env);
            // }
            // catch (error) {
            //     throw new RuntimeError(this.pos, error.toString());
            // }

            if (_test.type === DataType.BOOLEAN) {
                // try {
                    if (_test.data === false) {
                        if (this.alternative !== undefined) {
                            return this.alternative.evaluate(env);
                        }
                        else {
                            return _void;
                        }
                    }
                    else {
                        return this.consequent.evaluate(env);
                    }
                // }
                // catch (error) {
                //     throw new RuntimeError(this.pos, error.toString());
                // }
            }
            else {
                throw typeError(this.pos, DataType.BOOLEAN, _test.type);
            }
        }
    }
});

function While(pos, test, statement) {
    this.pos       = pos;
    this.test      = test;
    this.statement = statement;
}

While.prototype = Object.create(Object.prototype, {
    "constructor": {
        "writable"    : true,
        "configurable": true,
        "value"       : While
    },
    "evaluate": {
        "value": function (env) {
            var _result = _void;
            while (true) {
                var _test;
                // try {
                    _test = this.test.evaluate(env);
                // }
                // catch (error) {
                //     throw new RuntimeError(this.pos, error.toString());
                // }

                if (_test.type === DataType.BOOLEAN) {
                    // try {
                        if (_test.data === false) {
                            return _result;
                        }
                        else {
                            _result = this.statement.evaluate(env);
                        }
                    // }
                    // catch (error) {
                    //     throw new RuntimeError(this.pos, error.toString());
                    // }
                }
                else {
                    throw typeError(this.pos, DataType.BOOLEAN, _test.type);
                }
            }
        }
    }
});


function run(prelude, program) {
    var global = Object.create(prelude);
    return program.evaluate(global);
}


end();
