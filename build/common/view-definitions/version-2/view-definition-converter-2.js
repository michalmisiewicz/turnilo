"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var plywood_1 = require("plywood");
var models_1 = require("../../models");
var ViewDefinitionConverter2 = (function () {
    function ViewDefinitionConverter2() {
        this.version = 2;
    }
    ViewDefinitionConverter2.prototype.fromViewDefinition = function (definition, dataCube, visualizations) {
        var preProcessedDefinition = __assign({}, definition, { filter: filterJSConverter(definition.filter) });
        return models_1.Essence.fromJS(preProcessedDefinition, { dataCube: dataCube, visualizations: visualizations });
    };
    ViewDefinitionConverter2.prototype.toViewDefinition = function (essence) {
        return essence.toJS();
    };
    return ViewDefinitionConverter2;
}());
exports.ViewDefinitionConverter2 = ViewDefinitionConverter2;
function filterJSConverter(filter) {
    if (typeof filter === "string") {
        return filter;
    }
    var filterExpression = plywood_1.Expression.fromJSLoose(filter);
    if (filterExpression instanceof plywood_1.AndExpression) {
        var processedExpressions = filterExpression.getExpressionList().map(convertFilterExpression);
        return plywood_1.Expression.and(processedExpressions).toJS();
    }
    else {
        return convertFilterExpression(filterExpression).toJS();
    }
}
function convertFilterExpression(expression) {
    if (expression instanceof plywood_1.OverlapExpression && expression.expression instanceof plywood_1.TimeBucketExpression) {
        var overlapOperand = expression.operand;
        var _a = expression.expression, timeBucketOperand = _a.operand, duration = _a.duration;
        return overlapOperand.overlap(timeBucketOperand.timeFloor(duration).timeRange(duration));
    }
    else {
        return expression;
    }
}
//# sourceMappingURL=view-definition-converter-2.js.map