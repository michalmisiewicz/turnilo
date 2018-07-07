"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plywood_1 = require("plywood");
var manifest_1 = require("../../models/manifest/manifest");
var actions_1 = require("../../utils/rules/actions");
var predicates_1 = require("../../utils/rules/predicates");
var visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
var rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(predicates_1.Predicates.noSplits())
    .then(actions_1.Actions.manualDimensionSelection("The Table requires at least one split"))
    .otherwise(function (_a) {
    var splits = _a.splits, dataCube = _a.dataCube, colors = _a.colors, isSelectedVisualization = _a.isSelectedVisualization;
    var autoChanged = false;
    splits = splits.map(function (split, i) {
        var splitDimension = splits.get(0).getDimension(dataCube.dimensions);
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
            else {
                split = split.changeSortExpression(dataCube.getDefaultSortExpression());
                autoChanged = true;
            }
        }
        if (!split.limitAction && (autoChanged || splitDimension.kind !== "time")) {
            split = split.changeLimit(i ? 5 : 50);
            autoChanged = true;
        }
        return split;
    });
    if (colors) {
        colors = null;
        autoChanged = true;
    }
    return autoChanged ? manifest_1.Resolve.automatic(6, { splits: splits }) : manifest_1.Resolve.ready(isSelectedVisualization ? 10 : 8);
})
    .build();
exports.TABLE_MANIFEST = new manifest_1.Manifest("table", "Table", rulesEvaluator);
//# sourceMappingURL=table.js.map