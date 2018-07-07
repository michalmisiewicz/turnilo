"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_class_1 = require("immutable-class");
var general_1 = require("../../utils/general/general");
var dimension_1 = require("./dimension");
function dimensionOrGroupFromJS(dimensionOrGroup) {
    if (isDimensionGroupJS(dimensionOrGroup)) {
        return DimensionGroup.fromJS(dimensionOrGroup);
    }
    else {
        return dimension_1.Dimension.fromJS(dimensionOrGroup);
    }
}
exports.dimensionOrGroupFromJS = dimensionOrGroupFromJS;
function isDimensionGroupJS(dimensionOrGroup) {
    return dimensionOrGroup.dimensions !== undefined;
}
var DimensionGroup = (function () {
    function DimensionGroup(parameters) {
        this.type = "group";
        this.name = parameters.name;
        this.title = parameters.title || general_1.makeTitle(parameters.name);
        this.dimensions = parameters.dimensions;
    }
    DimensionGroup.fromJS = function (dimensionGroup) {
        var name = dimensionGroup.name, title = dimensionGroup.title, dimensions = dimensionGroup.dimensions;
        if (name == null) {
            throw new Error("dimension group requires a name");
        }
        if (dimensions == null || dimensions.length === 0) {
            throw new Error("dimension group '" + name + "' has no dimensions");
        }
        return new DimensionGroup({
            name: name,
            title: title,
            dimensions: dimensions.map(dimensionOrGroupFromJS)
        });
    };
    DimensionGroup.isDimensionGroup = function (candidate) {
        return candidate instanceof DimensionGroup;
    };
    DimensionGroup.prototype.accept = function (visitor) {
        return visitor.visitDimensionGroup(this);
    };
    DimensionGroup.prototype.equals = function (other) {
        return this === other
            || DimensionGroup.isDimensionGroup(other) && immutable_class_1.immutableArraysEqual(this.dimensions, other.dimensions);
    };
    DimensionGroup.prototype.toJS = function () {
        return {
            name: this.name,
            title: this.title,
            dimensions: this.dimensions.map(function (dimension) { return dimension.toJS(); })
        };
    };
    DimensionGroup.prototype.toJSON = function () {
        return this.toJS();
    };
    DimensionGroup.prototype.valueOf = function () {
        return {
            name: this.name,
            title: this.title,
            dimensions: this.dimensions
        };
    };
    return DimensionGroup;
}());
exports.DimensionGroup = DimensionGroup;
//# sourceMappingURL=dimension-group.js.map