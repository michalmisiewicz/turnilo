"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var plywood_1 = require("plywood");
var models_1 = require("../../models");
var manifest_1 = require("../../models/manifest/manifest");
var predicates_1 = require("../../utils/rules/predicates");
var visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
var rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(function (_a) {
    var dataCube = _a.dataCube;
    return !(dataCube.getDimensionsByKind("time").length || dataCube.getDimensionsByKind("number").length);
})
    .then(function () { return manifest_1.Resolve.NEVER; })
    .when(predicates_1.Predicates.noSplits())
    .then(function (_a) {
    var splits = _a.splits, dataCube = _a.dataCube;
    var continuousDimensions = dataCube.getDimensionsByKind("time").concat(dataCube.getDimensionsByKind("number"));
    return manifest_1.Resolve.manual(3, "This visualization requires a continuous dimension split", continuousDimensions.map(function (continuousDimension) {
        return {
            description: "Add a split on " + continuousDimension.title,
            adjustment: {
                splits: models_1.Splits.fromSplitCombine(models_1.SplitCombine.fromExpression(continuousDimension.expression))
            }
        };
    }));
})
    .when(predicates_1.Predicates.areExactSplitKinds("time"))
    .or(predicates_1.Predicates.areExactSplitKinds("number"))
    .then(function (_a) {
    var splits = _a.splits, dataCube = _a.dataCube, colors = _a.colors, isSelectedVisualization = _a.isSelectedVisualization;
    var score = 4;
    var continuousSplit = splits.get(0);
    var continuousDimension = dataCube.getDimensionByExpression(continuousSplit.expression);
    var sortStrategy = continuousDimension.sortStrategy;
    var sortAction = null;
    if (sortStrategy && sortStrategy !== "self") {
        sortAction = new plywood_1.SortExpression({
            expression: plywood_1.$(sortStrategy),
            direction: plywood_1.SortExpression.ASCENDING
        });
    }
    else {
        sortAction = new plywood_1.SortExpression({
            expression: plywood_1.$(continuousDimension.name),
            direction: plywood_1.SortExpression.ASCENDING
        });
    }
    var autoChanged = false;
    if (!sortAction.equals(continuousSplit.sortAction)) {
        continuousSplit = continuousSplit.changeSortExpression(sortAction);
        autoChanged = true;
    }
    if (continuousSplit.limitAction && continuousDimension.kind === "time") {
        continuousSplit = continuousSplit.changeLimitExpression(null);
        autoChanged = true;
    }
    if (colors) {
        autoChanged = true;
    }
    if (continuousDimension.kind === "time")
        score += 3;
    if (!autoChanged)
        return manifest_1.Resolve.ready(isSelectedVisualization ? 10 : score);
    return manifest_1.Resolve.automatic(score, { splits: new models_1.Splits(immutable_1.List([continuousSplit])) });
})
    .when(predicates_1.Predicates.areExactSplitKinds("time", "*"))
    .then(function (_a) {
    var splits = _a.splits, dataCube = _a.dataCube, colors = _a.colors;
    var timeSplit = splits.get(0);
    var timeDimension = timeSplit.getDimension(dataCube.dimensions);
    var sortAction = new plywood_1.SortExpression({
        expression: plywood_1.$(timeDimension.name),
        direction: plywood_1.SortExpression.ASCENDING
    });
    if (!sortAction.equals(timeSplit.sortAction)) {
        timeSplit = timeSplit.changeSortExpression(sortAction);
    }
    if (timeSplit.limitAction) {
        timeSplit = timeSplit.changeLimitExpression(null);
    }
    var colorSplit = splits.get(1);
    if (!colorSplit.sortAction) {
        colorSplit = colorSplit.changeSortExpression(dataCube.getDefaultSortExpression());
    }
    var colorSplitDimension = dataCube.getDimensionByExpression(colorSplit.expression);
    if (!colors || colors.dimension !== colorSplitDimension.name) {
        colors = models_1.Colors.fromLimit(colorSplitDimension.name, 5);
    }
    return manifest_1.Resolve.automatic(8, {
        splits: new models_1.Splits(immutable_1.List([colorSplit, timeSplit])),
        colors: colors
    });
})
    .when(predicates_1.Predicates.areExactSplitKinds("*", "time"))
    .or(predicates_1.Predicates.areExactSplitKinds("*", "number"))
    .then(function (_a) {
    var splits = _a.splits, dataCube = _a.dataCube, colors = _a.colors;
    var timeSplit = splits.get(1);
    var timeDimension = timeSplit.getDimension(dataCube.dimensions);
    var autoChanged = false;
    var sortAction = new plywood_1.SortExpression({
        expression: plywood_1.$(timeDimension.name),
        direction: plywood_1.SortExpression.ASCENDING
    });
    if (!sortAction.equals(timeSplit.sortAction)) {
        timeSplit = timeSplit.changeSortExpression(sortAction);
        autoChanged = true;
    }
    if (timeSplit.limitAction) {
        timeSplit = timeSplit.changeLimitExpression(null);
        autoChanged = true;
    }
    var colorSplit = splits.get(0);
    if (!colorSplit.sortAction) {
        colorSplit = colorSplit.changeSortExpression(dataCube.getDefaultSortExpression());
        autoChanged = true;
    }
    var colorSplitDimension = dataCube.getDimensionByExpression(colorSplit.expression);
    if (!colors || colors.dimension !== colorSplitDimension.name) {
        colors = models_1.Colors.fromLimit(colorSplitDimension.name, 5);
        autoChanged = true;
    }
    if (!autoChanged)
        return manifest_1.Resolve.ready(10);
    return manifest_1.Resolve.automatic(8, {
        splits: new models_1.Splits(immutable_1.List([colorSplit, timeSplit])),
        colors: colors
    });
})
    .when(predicates_1.Predicates.haveAtLeastSplitKinds("time"))
    .then(function (_a) {
    var splits = _a.splits, dataCube = _a.dataCube;
    var timeSplit = splits.toArray().filter(function (split) { return split.getDimension(dataCube.dimensions).kind === "time"; })[0];
    return manifest_1.Resolve.manual(3, "Too many splits on the line chart", [
        {
            description: "Remove all but the time split",
            adjustment: {
                splits: models_1.Splits.fromSplitCombine(timeSplit)
            }
        }
    ]);
})
    .otherwise(function (_a) {
    var splits = _a.splits, dataCube = _a.dataCube;
    var continuousDimensions = dataCube.getDimensionsByKind("time").concat(dataCube.getDimensionsByKind("number"));
    return manifest_1.Resolve.manual(3, "The Line Chart needs one continuous dimension split", continuousDimensions.map(function (continuousDimension) {
        return {
            description: "Split on " + continuousDimension.title + " instead",
            adjustment: {
                splits: models_1.Splits.fromSplitCombine(models_1.SplitCombine.fromExpression(continuousDimension.expression))
            }
        };
    }));
})
    .build();
exports.LINE_CHART_MANIFEST = new manifest_1.Manifest("line-chart", "Line Chart", rulesEvaluator);
//# sourceMappingURL=line-chart.js.map