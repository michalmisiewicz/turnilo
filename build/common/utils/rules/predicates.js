"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Predicates = (function () {
    function Predicates() {
    }
    Predicates.noSplits = function () {
        return function (_a) {
            var splits = _a.splits;
            return splits.length() === 0;
        };
    };
    Predicates.areExactSplitKinds = function () {
        var selectors = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            selectors[_i] = arguments[_i];
        }
        return function (_a) {
            var splits = _a.splits, dataCube = _a.dataCube;
            var kinds = splits.toArray().map(function (split) { return split.getDimension(dataCube.dimensions).kind; });
            return Predicates.strictCompare(selectors, kinds);
        };
    };
    Predicates.strictCompare = function (selectors, kinds) {
        if (selectors.length !== kinds.length)
            return false;
        return selectors.every(function (selector, i) { return Predicates.testKind(kinds[i], selector); });
    };
    Predicates.testKind = function (kind, selector) {
        if (selector === "*") {
            return true;
        }
        var bareSelector = selector.replace(/^!/, "");
        var result = kind === bareSelector;
        if (selector.charAt(0) === "!") {
            return !result;
        }
        return result;
    };
    Predicates.haveAtLeastSplitKinds = function () {
        var kinds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            kinds[_i] = arguments[_i];
        }
        return function (_a) {
            var splits = _a.splits, dataCube = _a.dataCube;
            var getKind = function (split) { return split.getDimension(dataCube.dimensions).kind; };
            var actualKinds = splits.toArray().map(getKind);
            return kinds.every(function (kind) { return actualKinds.indexOf(kind) > -1; });
        };
    };
    Predicates.noSelectedMeasures = function () {
        return function (_a) {
            var multiMeasureMode = _a.multiMeasureMode, selectedMeasures = _a.selectedMeasures;
            return multiMeasureMode && selectedMeasures.isEmpty();
        };
    };
    return Predicates;
}());
exports.Predicates = Predicates;
//# sourceMappingURL=predicates.js.map