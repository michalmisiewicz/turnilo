"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_class_1 = require("immutable-class");
var plywood_1 = require("plywood");
var general_1 = require("../../utils/general/general");
var granularity_1 = require("../granularity/granularity");
var geoName = /continent|country|city|region/i;
function isGeo(name) {
    return geoName.test(name);
}
function typeToKind(type) {
    if (!type)
        return type;
    return type.toLowerCase().replace(/_/g, "-").replace(/-range$/, "");
}
var BucketingStrategy;
(function (BucketingStrategy) {
    BucketingStrategy["defaultBucket"] = "defaultBucket";
    BucketingStrategy["defaultNoBucket"] = "defaultNoBucket";
})(BucketingStrategy = exports.BucketingStrategy || (exports.BucketingStrategy = {}));
var bucketingStrategies = {
    defaultBucket: BucketingStrategy.defaultBucket,
    defaultNoBucket: BucketingStrategy.defaultNoBucket
};
var check;
var Dimension = (function () {
    function Dimension(parameters) {
        this.type = "dimension";
        var name = parameters.name;
        general_1.verifyUrlSafeName(name);
        this.name = name;
        this.title = parameters.title || general_1.makeTitle(name);
        var formula = parameters.formula || plywood_1.$(name).toString();
        this.formula = formula;
        this.expression = plywood_1.Expression.parse(formula);
        var kind = parameters.kind || typeToKind(this.expression.type) || "string";
        this.kind = kind;
        if (kind === "string" && isGeo(name)) {
            this.className = "string-geo";
        }
        else {
            this.className = kind;
        }
        if (parameters.url) {
            if (typeof parameters.url !== "string") {
                throw new Error("unsupported url: " + parameters.url + ": only strings are supported");
            }
            this.url = parameters.url;
        }
        var granularities = parameters.granularities;
        if (granularities) {
            if (!Array.isArray(granularities) || granularities.length !== 5) {
                throw new Error("must have list of 5 granularities in dimension '" + parameters.name + "'");
            }
            var runningActionType = null;
            this.granularities = granularities.map(function (g) {
                if (runningActionType === null)
                    runningActionType = g.op;
                if (g.op !== runningActionType)
                    throw new Error("granularities must have the same type of actions");
                return g;
            });
        }
        if (parameters.bucketedBy)
            this.bucketedBy = parameters.bucketedBy;
        if (parameters.bucketingStrategy)
            this.bucketingStrategy = parameters.bucketingStrategy;
        if (parameters.sortStrategy)
            this.sortStrategy = parameters.sortStrategy;
    }
    Dimension.isDimension = function (candidate) {
        return candidate instanceof Dimension;
    };
    Dimension.fromJS = function (parameters) {
        var parameterExpression = parameters.expression;
        var value = {
            name: parameters.name,
            title: parameters.title,
            formula: parameters.formula || (typeof parameterExpression === "string" ? parameterExpression : null),
            kind: parameters.kind || typeToKind(parameters.type),
            url: parameters.url
        };
        if (parameters.granularities) {
            value.granularities = parameters.granularities.map(granularity_1.granularityFromJS);
        }
        if (parameters.bucketedBy) {
            value.bucketedBy = granularity_1.granularityFromJS(parameters.bucketedBy);
        }
        if (parameters.bucketingStrategy) {
            value.bucketingStrategy = bucketingStrategies[parameters.bucketingStrategy];
        }
        if (parameters.sortStrategy) {
            value.sortStrategy = parameters.sortStrategy;
        }
        return new Dimension(value);
    };
    Dimension.prototype.accept = function (visitor) {
        return visitor.visitDimension(this);
    };
    Dimension.prototype.valueOf = function () {
        return {
            name: this.name,
            title: this.title,
            formula: this.formula,
            kind: this.kind,
            url: this.url,
            granularities: this.granularities,
            bucketedBy: this.bucketedBy,
            bucketingStrategy: this.bucketingStrategy,
            sortStrategy: this.sortStrategy
        };
    };
    Dimension.prototype.toJS = function () {
        var js = {
            name: this.name,
            title: this.title,
            formula: this.formula,
            kind: this.kind
        };
        if (this.url)
            js.url = this.url;
        if (this.granularities)
            js.granularities = this.granularities.map(function (g) { return granularity_1.granularityToJS(g); });
        if (this.bucketedBy)
            js.bucketedBy = granularity_1.granularityToJS(this.bucketedBy);
        if (this.bucketingStrategy)
            js.bucketingStrategy = this.bucketingStrategy;
        if (this.sortStrategy)
            js.sortStrategy = this.sortStrategy;
        return js;
    };
    Dimension.prototype.toJSON = function () {
        return this.toJS();
    };
    Dimension.prototype.toString = function () {
        return "[Dimension: " + this.name + "]";
    };
    Dimension.prototype.equals = function (other) {
        return Dimension.isDimension(other) &&
            this.name === other.name &&
            this.title === other.title &&
            this.formula === other.formula &&
            this.kind === other.kind &&
            this.url === other.url &&
            immutable_class_1.immutableArraysEqual(this.granularities, other.granularities) &&
            granularity_1.granularityEquals(this.bucketedBy, other.bucketedBy) &&
            this.bucketingStrategy === other.bucketingStrategy &&
            this.sortStrategy === other.sortStrategy;
    };
    Dimension.prototype.canBucketByDefault = function () {
        return this.isContinuous() && this.bucketingStrategy !== BucketingStrategy.defaultNoBucket;
    };
    Dimension.prototype.isContinuous = function () {
        var kind = this.kind;
        return kind === "time" || kind === "number";
    };
    Dimension.prototype.change = function (propertyName, newValue) {
        var v = this.valueOf();
        if (!v.hasOwnProperty(propertyName)) {
            throw new Error("Unknown property : " + propertyName);
        }
        v[propertyName] = newValue;
        return new Dimension(v);
    };
    Dimension.prototype.changeKind = function (newKind) {
        return this.change("kind", newKind);
    };
    Dimension.prototype.changeName = function (newName) {
        return this.change("name", newName);
    };
    Dimension.prototype.changeTitle = function (newTitle) {
        return this.change("title", newTitle);
    };
    Dimension.prototype.changeFormula = function (newFormula) {
        return this.change("formula", newFormula);
    };
    return Dimension;
}());
exports.Dimension = Dimension;
check = Dimension;
//# sourceMappingURL=dimension.js.map