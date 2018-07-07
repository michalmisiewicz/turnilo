"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plywood_1 = require("plywood");
var check;
var SplitCombine = (function () {
    function SplitCombine(parameters) {
        this.expression = parameters.expression;
        if (!this.expression)
            throw new Error("must have expression");
        this.bucketAction = parameters.bucketAction;
        this.sortAction = parameters.sortAction;
        this.limitAction = parameters.limitAction;
    }
    SplitCombine.isSplitCombine = function (candidate) {
        return candidate instanceof SplitCombine;
    };
    SplitCombine.fromExpression = function (expression) {
        return new SplitCombine({
            expression: expression,
            bucketAction: null,
            sortAction: null,
            limitAction: null
        });
    };
    SplitCombine.fromJS = function (parameters, context) {
        if (typeof parameters === "string") {
            if (!context)
                throw new Error("must have context for string split");
            var dimension = context.dimensions.getDimensionByName(parameters);
            if (!dimension)
                throw new Error("can not find dimension " + parameters);
            return new SplitCombine({
                expression: dimension.expression,
                bucketAction: null,
                sortAction: null,
                limitAction: null
            });
        }
        else {
            var value = {
                expression: plywood_1.Expression.fromJSLoose(parameters.expression),
                bucketAction: null,
                sortAction: null,
                limitAction: null
            };
            if (parameters.bucketAction)
                value.bucketAction = plywood_1.Expression.fromJS(parameters.bucketAction);
            if (parameters.sortAction)
                value.sortAction = plywood_1.SortExpression.fromJS(parameters.sortAction);
            if (parameters.limitAction)
                value.limitAction = plywood_1.LimitExpression.fromJS(parameters.limitAction);
            return new SplitCombine(value);
        }
    };
    SplitCombine.prototype.valueOf = function () {
        return {
            expression: this.expression,
            bucketAction: this.bucketAction,
            sortAction: this.sortAction,
            limitAction: this.limitAction
        };
    };
    SplitCombine.prototype.toJS = function () {
        var js = {
            expression: this.expression.toJS()
        };
        if (this.bucketAction)
            js.bucketAction = this.bucketAction.toJS();
        if (this.sortAction)
            js.sortAction = this.sortAction.toJS();
        if (this.limitAction)
            js.limitAction = this.limitAction.toJS();
        return js;
    };
    SplitCombine.prototype.toJSON = function () {
        return this.toJS();
    };
    SplitCombine.prototype.toString = function () {
        return "[SplitCombine: " + this.expression + "]";
    };
    SplitCombine.prototype.equals = function (other) {
        var _a = this, expression = _a.expression, bucketAction = _a.bucketAction, sortAction = _a.sortAction, limitAction = _a.limitAction;
        return SplitCombine.isSplitCombine(other) &&
            expression.equals(other.expression) &&
            Boolean(bucketAction) === Boolean(other.bucketAction) &&
            (!bucketAction || bucketAction.equals(other.bucketAction)) &&
            Boolean(sortAction) === Boolean(other.sortAction) &&
            (!sortAction || sortAction.equals(other.sortAction)) &&
            Boolean(limitAction) === Boolean(other.limitAction) &&
            (!limitAction || limitAction.equals(other.limitAction));
    };
    SplitCombine.prototype.equalsByExpression = function (other) {
        var expression = this.expression;
        return SplitCombine.isSplitCombine(other) && expression.equals(other.expression);
    };
    SplitCombine.prototype.toSplitExpression = function () {
        var _a = this, expression = _a.expression, bucketAction = _a.bucketAction;
        if (!bucketAction)
            return expression;
        return expression.performAction(bucketAction);
    };
    SplitCombine.prototype.toKey = function () {
        return this.toSplitExpression().toString();
    };
    SplitCombine.prototype.getNormalizedSortExpression = function (dimensions) {
        var sortAction = this.sortAction;
        var dimension = this.getDimension(dimensions);
        if (!sortAction)
            return null;
        if (sortAction.refName() === dimension.name) {
            return sortAction.changeExpression(plywood_1.$(SplitCombine.SORT_ON_DIMENSION_PLACEHOLDER));
        }
        return sortAction;
    };
    SplitCombine.prototype.changeBucketAction = function (bucketAction) {
        var value = this.valueOf();
        value.bucketAction = bucketAction;
        return new SplitCombine(value);
    };
    SplitCombine.prototype.changeSortExpression = function (sortAction) {
        var value = this.valueOf();
        value.sortAction = sortAction;
        return new SplitCombine(value);
    };
    SplitCombine.prototype.changeSortExpressionFromNormalized = function (sortAction, dimensions) {
        if (sortAction.refName() === SplitCombine.SORT_ON_DIMENSION_PLACEHOLDER) {
            var dimension = dimensions.getDimensionByExpression(this.expression);
            if (!dimension)
                throw new Error("can not find dimension for split");
            sortAction = sortAction.changeExpression(plywood_1.$(dimension.name));
        }
        return this.changeSortExpression(sortAction);
    };
    SplitCombine.prototype.changeLimitExpression = function (limitAction) {
        var value = this.valueOf();
        value.limitAction = limitAction;
        return new SplitCombine(value);
    };
    SplitCombine.prototype.changeLimit = function (limit) {
        var limitAction = limit === null ? null : new plywood_1.LimitExpression({ value: limit });
        return this.changeLimitExpression(limitAction);
    };
    SplitCombine.prototype.timezoneDependant = function () {
        var bucketAction = this.bucketAction;
        if (!bucketAction)
            return false;
        return bucketAction.needsEnvironment();
    };
    SplitCombine.prototype.getDimension = function (dimensions) {
        return dimensions.getDimensionByExpression(this.expression);
    };
    SplitCombine.prototype.getTitle = function (dimensions) {
        var dimension = this.getDimension(dimensions);
        return (dimension ? dimension.title : "?") + this.getBucketTitle();
    };
    SplitCombine.prototype.getBucketTitle = function () {
        var bucketAction = this.bucketAction;
        if (bucketAction instanceof plywood_1.TimeBucketExpression) {
            return " (" + bucketAction.duration.getDescription(true) + ")";
        }
        else if (bucketAction instanceof plywood_1.NumberBucketExpression) {
            return " (by " + bucketAction.size + ")";
        }
        return "";
    };
    SplitCombine.SORT_ON_DIMENSION_PLACEHOLDER = "__SWIV_SORT_ON_DIMENSIONS__";
    return SplitCombine;
}());
exports.SplitCombine = SplitCombine;
//# sourceMappingURL=split-combine.js.map