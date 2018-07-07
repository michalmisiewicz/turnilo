"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bar_chart_1 = require("../manifests/bar-chart/bar-chart");
var line_chart_1 = require("../manifests/line-chart/line-chart");
var table_1 = require("../manifests/table/table");
var totals_1 = require("../manifests/totals/totals");
var view_definition_converter_2_1 = require("./version-2/view-definition-converter-2");
var view_definition_hash_encoder2_1 = require("./version-2/view-definition-hash-encoder2");
var view_definition_converter_3_1 = require("./version-3/view-definition-converter-3");
var view_definition_hash_encoder3_1 = require("./version-3/view-definition-hash-encoder3");
exports.DEFAULT_VIEW_DEFINITION_VERSION = "3";
exports.LEGACY_VIEW_DEFINITION_VERSION = "2";
exports.definitionConverters = {
    2: new view_definition_converter_2_1.ViewDefinitionConverter2(),
    3: new view_definition_converter_3_1.ViewDefinitionConverter3()
};
exports.definitionUrlEncoders = {
    2: new view_definition_hash_encoder2_1.ViewDefinitionHashEncoder2(),
    3: new view_definition_hash_encoder3_1.ViewDefinitionHashEncoder3()
};
exports.defaultDefinitionConverter = exports.definitionConverters[exports.DEFAULT_VIEW_DEFINITION_VERSION];
exports.defaultDefinitionUrlEncoder = exports.definitionUrlEncoders[exports.DEFAULT_VIEW_DEFINITION_VERSION];
exports.version2Visualizations = [
    totals_1.TOTALS_MANIFEST.name,
    table_1.TABLE_MANIFEST.name,
    line_chart_1.LINE_CHART_MANIFEST.name,
    bar_chart_1.BAR_CHART_MANIFEST.name
];
//# sourceMappingURL=index.js.map