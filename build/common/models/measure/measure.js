"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_class_1 = require("immutable-class");
var numeral = require("numeral");
var plywood_1 = require("plywood");
var general_1 = require("../../utils/general/general");
function formatFnFactory(format) {
    return function (n) {
        if (isNaN(n) || !isFinite(n))
            return "-";
        return numeral(n).format(format);
    };
}
var Measure = (function (_super) {
    __extends(Measure, _super);
    function Measure(parameters) {
        var _this = _super.call(this, parameters) || this;
        _this.type = "measure";
        _this.title = _this.title || general_1.makeTitle(_this.name);
        _this.expression = plywood_1.Expression.parse(_this.formula);
        _this.formatFn = formatFnFactory(_this.getFormat());
        return _this;
    }
    Measure.isMeasure = function (candidate) {
        return candidate instanceof Measure;
    };
    Measure.getMeasure = function (measures, measureName) {
        if (!measureName)
            return null;
        measureName = measureName.toLowerCase();
        return measures.find(function (measure) { return measure.name.toLowerCase() === measureName; });
    };
    Measure.getAggregateReferences = function (ex) {
        var references = [];
        ex.forEach(function (ex) {
            if (ex instanceof plywood_1.ChainableExpression) {
                var actions = ex.getArgumentExpressions();
                for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                    var action = actions_1[_i];
                    if (action.isAggregate()) {
                        references = references.concat(action.getFreeReferences());
                    }
                }
            }
        });
        return plywood_1.deduplicateSort(references);
    };
    Measure.getReferences = function (ex) {
        var references = [];
        ex.forEach(function (sub) {
            if (sub instanceof plywood_1.RefExpression && sub.name !== "main") {
                references = references.concat(sub.name);
            }
        });
        return plywood_1.deduplicateSort(references);
    };
    Measure.getCountDistinctReferences = function (ex) {
        var _this = this;
        var references = [];
        ex.forEach(function (ex) {
            if (ex instanceof plywood_1.CountDistinctExpression) {
                references = references.concat(_this.getReferences(ex));
            }
        });
        return plywood_1.deduplicateSort(references);
    };
    Measure.measuresFromAttributeInfo = function (attribute) {
        var name = attribute.name, nativeType = attribute.nativeType;
        var $main = plywood_1.$("main");
        var ref = plywood_1.$(name);
        if (nativeType) {
            if (nativeType === "hyperUnique" || nativeType === "thetaSketch") {
                return [
                    new Measure({
                        name: general_1.makeUrlSafeName(name),
                        formula: $main.countDistinct(ref).toString()
                    })
                ];
            }
            else if (nativeType === "approximateHistogram") {
                return [
                    new Measure({
                        name: general_1.makeUrlSafeName(name + "_p98"),
                        formula: $main.quantile(ref, 0.98).toString()
                    })
                ];
            }
        }
        var expression = $main.sum(ref);
        var makerAction = attribute.maker;
        if (makerAction) {
            switch (makerAction.op) {
                case "min":
                    expression = $main.min(ref);
                    break;
                case "max":
                    expression = $main.max(ref);
                    break;
            }
        }
        return [new Measure({
                name: general_1.makeUrlSafeName(name),
                formula: expression.toString()
            })];
    };
    Measure.fromJS = function (parameters) {
        if (!parameters.formula) {
            var parameterExpression = parameters.expression;
            parameters.formula = (typeof parameterExpression === "string" ? parameterExpression : plywood_1.$("main").sum(plywood_1.$(parameters.name)).toString());
        }
        return new Measure(immutable_class_1.BaseImmutable.jsToValue(Measure.PROPERTIES, parameters));
    };
    Measure.prototype.accept = function (visitor) {
        return visitor.visitMeasure(this);
    };
    Measure.prototype.equals = function (other) {
        return this === other || Measure.isMeasure(other) && _super.prototype.equals.call(this, other);
    };
    Measure.prototype.toApplyExpression = function (nestingLevel) {
        if (nestingLevel === void 0) { nestingLevel = 0; }
        switch (this.transformation) {
            case "percent-of-parent": {
                var referencedLevelDelta = Math.min(nestingLevel, 1);
                return this.percentOfParentExpression(referencedLevelDelta);
            }
            case "percent-of-total": {
                return this.percentOfParentExpression(nestingLevel);
            }
            default: {
                var _a = this, name_1 = _a.name, expression = _a.expression;
                return new plywood_1.ApplyExpression({ name: name_1, expression: expression });
            }
        }
    };
    Measure.prototype.percentOfParentExpression = function (nestingLevel) {
        var _a = this, name = _a.name, expression = _a.expression;
        var formulaName = "__formula_" + name;
        var formulaExpression = new plywood_1.ApplyExpression({ name: formulaName, expression: expression });
        if (nestingLevel > 0) {
            return new plywood_1.ApplyExpression({
                name: name,
                operand: formulaExpression,
                expression: plywood_1.$(formulaName).divide(plywood_1.$(formulaName, nestingLevel)).multiply(100)
            });
        }
        else if (nestingLevel === 0) {
            return formulaExpression;
        }
        else {
            throw new Error("wrong nesting level: " + nestingLevel);
        }
    };
    Measure.prototype.formatDatum = function (datum) {
        return this.formatFn(datum[this.name]);
    };
    Measure.prototype.getTitleWithUnits = function () {
        if (this.units) {
            return this.title + " (" + this.units + ")";
        }
        else {
            return this.title;
        }
    };
    Measure.DEFAULT_FORMAT = "0,0.0 a";
    Measure.INTEGER_FORMAT = "0,0 a";
    Measure.DEFAULT_TRANSFORMATION = "none";
    Measure.TRANSFORMATIONS = ["none", "percent-of-parent", "percent-of-total"];
    Measure.PROPERTIES = [
        { name: "name", validate: general_1.verifyUrlSafeName },
        { name: "title", defaultValue: null },
        { name: "units", defaultValue: null },
        { name: "formula" },
        { name: "format", defaultValue: Measure.DEFAULT_FORMAT },
        { name: "transformation", defaultValue: Measure.DEFAULT_TRANSFORMATION, possibleValues: Measure.TRANSFORMATIONS }
    ];
    return Measure;
}(immutable_class_1.BaseImmutable));
exports.Measure = Measure;
immutable_class_1.BaseImmutable.finalize(Measure);
//# sourceMappingURL=measure.js.map