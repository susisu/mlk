/*
 * mlk / parser.js
 * copyright (c) 2015 Susisu
 */

"use strict";

function end () {
    module.exports = Object.freeze({
        "parse": parse
    });
}

var lq = require("loquat");

var core = require("./core.js");

var Value    = core.Value;
var DataType = core.DataType;

var _void  = core._void;
var _true  = core._true;
var _false = core._false;

var Literal      = core.Literal;
var ArrayLiteral = core.ArrayLiteral;
var Variable     = core.Variable;
var Lambda       = core.Lambda;
var Application  = core.Application;
var Procedure    = core.Procedure;
var Declaration  = core.Declaration;
var IfElse       = core.IfElse;
var While        = core.While;


var parser = initParser();

function parse(name, source) {
    var result = lq.parse(parser, name, source);
    if (result.succeeded) {
        return result.value;
    }
    else {
        throw result.error;
    }
}

function initParser() {
    var langDef = new lq.LanguageDef(
        "{-",
        "-}",
        "--",
        true,
        lq.letter,
        lq.alphaNum.or(lq.oneOf("_'")),
        lq.oneOf("!#$%&*+./<=>?@\\^|-~"),
        lq.oneOf("!#$%&*+./<=>?@\\^|-~"),
        ["NaN", "Infinity", "True", "False", "Void", "if", "then", "else", "while", "do", "let", "in", "lambda"],
        ["=", "\\", "->"],
        true
    );
    var tokenParser = lq.makeTokenParser(langDef);

    var operandExpr = new lq.LazyParser(function () {
        return declaration
            .or(lambda)
            .or(letIn)
            .or(ifElse)
            .or(whileLoop)
            .or(procedureBlock)
            .or(application);
    }).label("expression");

    var valueExpr = new lq.LazyParser(function () {
        return literal
            .or(variable)
            .or(tokenParser.parens(expression));
    });
    var funcExpr = valueExpr.label("value or function");
    var argExpr = valueExpr.label("argument");
    var argsExpr = argExpr.many().label("arguments");
    var application = lq.getPosition.bind(function (pos) {
        return funcExpr.bind(function (func) {
            return argsExpr.bind(function (args) {
                if (args.length === 0) {
                    return lq.pure(func);
                }
                else {
                    return lq.pure(new Application(pos, func, args));
                }
            });
        });
    }).label("value or function application");

    function prefixOp(op) {
        return lq.getPosition.bind(function (pos) {
            return tokenParser.reservedOp(op)
                .then(lq.pure(function (x) {
                    return new Application(pos, new Variable(pos, op + "_"), [x])
                }));
        });
    }
    function infixOp(op) {
        return lq.getPosition.bind(function (pos) {
            return tokenParser.reservedOp(op)
                .then(lq.pure(function (x, y) {
                    return new Application(pos, new Variable(pos, "_" + op + "_"), [x, y])
                }));
        });
    }
    var expression = lq.buildExpressionParser(
        [
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("!!"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("."),
                    lq.OperatorAssoc.ASSOC_RIGHT
                )
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("**"),
                    lq.OperatorAssoc.ASSOC_RIGHT
                )
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("*"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("/"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("%"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
            ],
            [
                new lq.Operator(
                    lq.OperatorType.PREFIX,
                    prefixOp("+")
                ),
                new lq.Operator(
                    lq.OperatorType.PREFIX,
                    prefixOp("-")
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("+"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("-"),
                    lq.OperatorAssoc.ASSOC_LEFT
                ),
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("++"),
                    lq.OperatorAssoc.ASSOC_RIGHT
                )
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("=="),
                    lq.OperatorAssoc.ASSOC_NONE
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("!="),
                    lq.OperatorAssoc.ASSOC_NONE
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("<"),
                    lq.OperatorAssoc.ASSOC_NONE
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp(">"),
                    lq.OperatorAssoc.ASSOC_NONE
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("<="),
                    lq.OperatorAssoc.ASSOC_NONE
                ),
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp(">="),
                    lq.OperatorAssoc.ASSOC_NONE
                )
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("&&"),
                    lq.OperatorAssoc.ASSOC_RIGHT
                )
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("||"),
                    lq.OperatorAssoc.ASSOC_RIGHT
                )
            ],
            [
                new lq.Operator(
                    lq.OperatorType.INFIX,
                    infixOp("$"),
                    lq.OperatorAssoc.ASSOC_RIGHT
                )
            ]
        ],
        operandExpr
    ).label("expression");

    var reverseProc = lq.getPosition.bind(function (pos) {
        return expression.sepBy1(tokenParser.colon)
            .bind(function (exprs) {
                if (exprs.length === 1) {
                    return lq.pure(exprs[0]);
                }
                else {
                    return lq.pure(new Procedure(pos, exprs.slice().reverse()));
                }
            });
    });
    var proc = lq.getPosition.bind(function (pos) {
        return reverseProc.sepEndBy(tokenParser.semi.or(tokenParser.whiteSpace))
            .bind(function (exprs) {
                return lq.pure(new Procedure(pos, exprs));
            });
    });

    var program = tokenParser.whiteSpace.right(proc).left(lq.eof);

    var numValue =
        tokenParser.naturalOrFloat.bind(function (natOrFloat) {
            return lq.pure(natOrFloat[natOrFloat.length === 1 ? 0 : 1]);
        })
        .or(tokenParser.reserved("NaN").then(lq.pure(NaN)))
        .or(tokenParser.reserved("Infinity").then(lq.pure(Infinity)))
        .bind(function (num) {
            return lq.pure(new Value(DataType.NUMBER, num));
        }).label("number");
    var strValue = tokenParser.stringLiteral.bind(function (str) {
        return lq.pure(new Value(DataType.STRING, str));
    }).label("string");
    var trueValue = tokenParser.reserved("True").then(lq.pure(_true)).label("true");
    var falseValue = tokenParser.reserved("False").then(lq.pure(_false)).label("false");
    var boolValue = trueValue.or(falseValue).label("boolean");
    var voidValue = tokenParser.reserved("Void")
        .or(tokenParser.symbol("()").try())
        .then(lq.pure(_void)).label("void");
    var literalValue = numValue.or(strValue).or(boolValue).or(voidValue);
    var primLiteral = lq.getPosition.bind(function (pos) {
        return literalValue.bind(function (value) {
            return lq.pure(new Literal(pos, value));
        });
    }).label("primitive");
    var arrayLiteral = lq.getPosition.bind(function (pos) {
        return tokenParser.brackets(tokenParser.commaSep(expression)).bind(function (elems) {
            return lq.pure(new ArrayLiteral(pos, elems));
        });
    }).label("array");
    var literal = primLiteral.or(arrayLiteral).label("literal");

    var identifier = lq.getPosition.bind(function (pos) {
        return tokenParser.identifier.bind(function (name) {
            return lq.pure(new Variable(pos, name));
        });
    }).label("identifier");
    var operator = lq.getPosition.bind(function (pos) {
        return tokenParser.parens(tokenParser.operator).try().bind(function (name) {
            return lq.pure(new Variable(pos, "_" + name + "_"));
        });
    }).label("operator");
    var variable = identifier.or(operator).label("variable");

    var lambda = lq.getPosition.bind(function (pos) {
        return tokenParser.reservedOp("\\")
            .or(tokenParser.reserved("lambda"))
            .then(tokenParser.identifier.many())
            .bind(function (args) {
                return tokenParser.reservedOp("->")
                    .then(expression)
                    .bind(function (body) {
                        return lq.pure(new Lambda(pos, args, body));
                    });
            });
    }).label("lambda");

    var ifElse = lq.getPosition.bind(function (pos) {
        return tokenParser.reserved("if")
            .then(expression)
            .bind(function (test) {
                return tokenParser.reserved("then")
                    .then(expression)
                    .bind(function (consequent) {
                        return tokenParser.reserved("else")
                            .then(expression)
                            .bind(function (alternative) {
                                return lq.pure(new IfElse(pos, test, consequent, alternative));
                            })
                            .or(lq.pure(new IfElse(pos, test, consequent)));
                    });
            });
    }).label("if else");

    var whileLoop = lq.getPosition.bind(function (pos) {
        return tokenParser.reserved("while")
            .then(expression)
            .bind(function (test) {
                return tokenParser.reserved("do")
                    .then(expression)
                    .bind(function (statement) {
                        return lq.pure(new While(pos, test, statement));
                    });
            });
    }).label("while");

    var declaration = lq.getPosition.bind(function (pos) {
        return tokenParser.identifier
            .left(tokenParser.reservedOp("="))
            .try()
            .bind(function (name) {
                return expression.bind(function (expr) {
                    return lq.pure(new Declaration(pos, name, expr));
                });
            });
    }).label("declaration");

    var letIn = lq.getPosition.bind(function (pos) {
        return tokenParser.reserved("let")
            .then(tokenParser.identifier)
            .bind(function (name) {
                return tokenParser.reservedOp("=")
                    .then(expression)
                    .bind(function (bindExpr) {
                        return tokenParser.reserved("in")
                            .then(expression)
                            .bind(function (expr) {
                                return lq.pure(new Application(pos, new Lambda(pos, [name], expr), [bindExpr]));
                            });
                    });
            });
    }).label("let in");

    var procedureBlock = tokenParser.braces(proc).label("procedure block");

    return program;
}


end();
