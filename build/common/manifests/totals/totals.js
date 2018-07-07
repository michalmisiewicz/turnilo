"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var manifest_1 = require("../../models/manifest/manifest");
var splits_1 = require("../../models/splits/splits");
var predicates_1 = require("../../utils/rules/predicates");
var visualization_dependent_evaluator_1 = require("../../utils/rules/visualization-dependent-evaluator");
var rulesEvaluator = visualization_dependent_evaluator_1.visualizationDependentEvaluatorBuilder
    .when(predicates_1.Predicates.noSplits())
    .then(function () { return manifest_1.Resolve.ready(10); })
    .otherwise(function () { return manifest_1.Resolve.automatic(3, { splits: splits_1.Splits.EMPTY }); })
    .build();
exports.TOTALS_MANIFEST = new manifest_1.Manifest("totals", "Totals", rulesEvaluator, "multi");
//# sourceMappingURL=totals.js.map