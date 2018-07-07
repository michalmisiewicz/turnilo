"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var immutable_class_1 = require("immutable-class");
var general_1 = require("../../utils/general/general");
var measure_group_1 = require("./measure-group");
var FlattenMeasuresWithGroupsVisitor = (function () {
    function FlattenMeasuresWithGroupsVisitor() {
        this.items = immutable_1.List().asMutable();
    }
    FlattenMeasuresWithGroupsVisitor.prototype.visitMeasure = function (measure) {
        this.items.push(measure);
    };
    FlattenMeasuresWithGroupsVisitor.prototype.visitMeasureGroup = function (measureGroup) {
        var _this = this;
        this.items.push(measureGroup);
        measureGroup.measures.forEach(function (measureOrGroup) { return measureOrGroup.accept(_this); });
    };
    FlattenMeasuresWithGroupsVisitor.prototype.getMeasuresAndGroups = function () {
        return this.items.toList();
    };
    return FlattenMeasuresWithGroupsVisitor;
}());
function findDuplicateNames(items) {
    return items
        .groupBy(function (measure) { return measure.name; })
        .filter(function (names) { return names.size > 1; })
        .map(function (names, name) { return name; })
        .toList();
}
function filterMeasures(items) {
    return immutable_1.List(items
        .filter(function (item) { return item.type === "measure"; })
        .toList());
}
var Measures = (function () {
    function Measures(measures) {
        this.measures = measures.slice();
        var duplicateNamesFindingVisitor = new FlattenMeasuresWithGroupsVisitor();
        this.measures.forEach(function (measureOrGroup) { return measureOrGroup.accept(duplicateNamesFindingVisitor); });
        var flattenedMeasuresWithGroups = duplicateNamesFindingVisitor.getMeasuresAndGroups();
        var duplicateNames = findDuplicateNames(flattenedMeasuresWithGroups);
        if (duplicateNames.size > 0) {
            throw new Error("found duplicate measure or group with names: " + general_1.quoteNames(duplicateNames));
        }
        this.flattenedMeasures = filterMeasures(flattenedMeasuresWithGroups);
    }
    Measures.empty = function () {
        return new Measures([]);
    };
    Measures.fromJS = function (parameters) {
        return new Measures(parameters.map(measure_group_1.measureOrGroupFromJS));
    };
    Measures.prototype.accept = function (visitor) {
        return this.measures.map(function (measureOrGroup) { return measureOrGroup.accept(visitor); });
    };
    Measures.prototype.size = function () {
        return this.flattenedMeasures.size;
    };
    Measures.prototype.first = function () {
        return this.flattenedMeasures.first();
    };
    Measures.prototype.equals = function (other) {
        return this === other || immutable_class_1.immutableArraysEqual(this.measures, other.measures);
    };
    Measures.prototype.mapMeasures = function (mapper) {
        return this.flattenedMeasures.map(mapper).toArray();
    };
    Measures.prototype.filterMeasures = function (predicate) {
        return this.flattenedMeasures.filter(predicate).toArray();
    };
    Measures.prototype.forEachMeasure = function (sideEffect) {
        this.flattenedMeasures.forEach(sideEffect);
    };
    Measures.prototype.getMeasureByName = function (measureName) {
        return this.flattenedMeasures.find(function (measure) { return measure.name === measureName; });
    };
    Measures.prototype.getMeasureByExpression = function (expression) {
        return this.flattenedMeasures.find(function (measure) { return measure.expression.equals(expression); });
    };
    Measures.prototype.getMeasureNames = function () {
        return this.flattenedMeasures.map(function (measure) { return measure.name; }).toList();
    };
    Measures.prototype.containsMeasureWithName = function (name) {
        return this.flattenedMeasures.some(function (measure) { return measure.name === name; });
    };
    Measures.prototype.getFirstNMeasureNames = function (n) {
        return immutable_1.OrderedSet(this.flattenedMeasures.slice(0, n).map(function (measure) { return measure.name; }));
    };
    Measures.prototype.append = function () {
        var measures = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            measures[_i] = arguments[_i];
        }
        return new Measures(this.measures.concat(measures));
    };
    Measures.prototype.prepend = function () {
        var measures = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            measures[_i] = arguments[_i];
        }
        return new Measures(measures.concat(this.measures));
    };
    Measures.prototype.toJS = function () {
        return this.measures.map(function (measure) { return measure.toJS(); });
    };
    return Measures;
}());
exports.Measures = Measures;
//# sourceMappingURL=measures.js.map