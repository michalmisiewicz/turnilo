"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var models_1 = require("../../models");
var Resolutions = (function () {
    function Resolutions() {
    }
    Resolutions.someDimensions = function (dataCube) {
        var numberOfSuggestedSplitDimensions = 2;
        var suggestedSplitDimensions = dataCube
            .getDimensionsByKind("string")
            .slice(0, numberOfSuggestedSplitDimensions);
        return suggestedSplitDimensions.map(function (dimension) {
            return {
                description: "Add a split on " + dimension.title,
                adjustment: {
                    splits: models_1.Splits.fromSplitCombine(models_1.SplitCombine.fromExpression(dimension.expression))
                }
            };
        });
    };
    Resolutions.defaultSelectedMeasures = function (dataCube) {
        var defaultSelectedMeasures = dataCube.defaultSelectedMeasures || immutable_1.OrderedSet();
        var measures = defaultSelectedMeasures.map(function (measureName) { return dataCube.getMeasure(measureName); }).toArray();
        if (measures.length === 0) {
            return [];
        }
        var measureNames = measures.map(function (measure) { return measure.title; }).join(", ");
        return [
            { description: "Select default measures: " + measureNames, adjustment: { selectedMeasures: measures } }
        ];
    };
    Resolutions.firstMeasure = function (dataCube) {
        var firstMeasure = dataCube.measures.first();
        return [{ description: "Select measure: " + firstMeasure.title, adjustment: { selectedMeasures: [firstMeasure] } }];
    };
    return Resolutions;
}());
exports.Resolutions = Resolutions;
//# sourceMappingURL=resolutions.js.map