"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plywood_1 = require("plywood");
var models_1 = require("../../models");
var manifest_1 = require("../../models/manifest/manifest");
var actions_1 = require("../../utils/rules/actions");
var predicates_1 = require("../../utils/rules/predicates");
var visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
var rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(predicates_1.Predicates.noSplits())
    .then(actions_1.Actions.manualDimensionSelection("The Bar Chart requires at least one split"))
    .when(predicates_1.Predicates.areExactSplitKinds("*"))
    .or(predicates_1.Predicates.areExactSplitKinds("*", "*"))
    .then(function (_a) {
    var splits = _a.splits, dataCube = _a.dataCube, colors = _a.colors, isSelectedVisualization = _a.isSelectedVisualization;
    var continuousBoost = 0;
    var autoChanged = false;
    splits = splits.map(function (split) {
        var splitDimension = dataCube.getDimensionByExpression(split.expression);
        var sortStrategy = splitDimension.sortStrategy;
        if (!split.sortAction) {
            if (sortStrategy) {
                if (sortStrategy === "self") {
                    split = split.changeSortExpression(new plywood_1.SortExpression({
                        expression: plywood_1.$(splitDimension.name),
                        direction: plywood_1.SortExpression.DESCENDING
                    }));
                }
                else {
                    split = split.changeSortExpression(new plywood_1.SortExpression({
                        expression: plywood_1.$(sortStrategy),
                        direction: plywood_1.SortExpression.DESCENDING
                    }));
                }
            }
            else if (splitDimension.kind === "boolean") {
                split = split.changeSortExpression(new plywood_1.SortExpression({
                    expression: plywood_1.$(splitDimension.name),
                    direction: plywood_1.SortExpression.DESCENDING
                }));
            }
            else {
                if (splitDimension.isContinuous()) {
                    split = split.changeSortExpression(new plywood_1.SortExpression({
                        expression: plywood_1.$(splitDimension.name),
                        direction: plywood_1.SortExpression.ASCENDING
                    }));
                }
                else {
                    split = split.changeSortExpression(dataCube.getDefaultSortExpression());
                }
            }
            autoChanged = true;
        }
        else if (splitDimension.canBucketByDefault() && split.sortAction.refName() !== splitDimension.name) {
            split = split.changeSortExpression(new plywood_1.SortExpression({
                expression: plywood_1.$(splitDimension.name),
                direction: split.sortAction.direction
            }));
            autoChanged = true;
        }
        if (splitDimension.kind === "number") {
            continuousBoost = 4;
        }
        if (!split.limitAction && (autoChanged || splitDimension.kind !== "time")) {
            split = split.changeLimit(25);
            autoChanged = true;
        }
        if (colors) {
            colors = null;
            autoChanged = true;
        }
        return split;
    });
    if (autoChanged) {
        return manifest_1.Resolve.automatic(5 + continuousBoost, { splits: splits });
    }
    return manifest_1.Resolve.ready(isSelectedVisualization ? 10 : (7 + continuousBoost));
})
    .otherwise(function (_a) {
    var splits = _a.splits, dataCube = _a.dataCube;
    var categoricalDimensions = dataCube.dimensions.filterDimensions(function (dimension) { return dimension.kind !== "time"; });
    return manifest_1.Resolve.manual(3, "The Bar Chart needs one or two splits", categoricalDimensions.slice(0, 2).map(function (dimension) {
        return {
            description: "Split on " + dimension.title + " instead",
            adjustment: {
                splits: models_1.Splits.fromSplitCombine(models_1.SplitCombine.fromExpression(dimension.expression))
            }
        };
    }));
})
    .build();
exports.BAR_CHART_MANIFEST = new manifest_1.Manifest("bar-chart", "Bar Chart", rulesEvaluator);
//# sourceMappingURL=bar-chart.js.map