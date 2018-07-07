"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chronoshift_1 = require("chronoshift");
var models_1 = require("../../models");
var filter_definition_1 = require("./filter-definition");
var highlight_definition_1 = require("./highlight-definition");
var legend_definition_1 = require("./legend-definition");
var measures_definition_1 = require("./measures-definition");
var split_definition_1 = require("./split-definition");
var ViewDefinitionConverter3 = (function () {
    function ViewDefinitionConverter3() {
        this.version = 3;
    }
    ViewDefinitionConverter3.prototype.fromViewDefinition = function (definition, dataCube, visualizations) {
        return models_1.Essence.fromJS({
            visualization: definition.visualization,
            timezone: chronoshift_1.Timezone.fromJS(definition.timezone).toJS(),
            filter: models_1.Filter.fromClauses(definition.filters.map(function (fc) { return filter_definition_1.filterDefinitionConverter.toFilterClause(fc, dataCube); })).toJS(),
            splits: definition.splits.map(split_definition_1.splitConverter.toSplitCombine).map(function (sc) { return sc.toJS(); }),
            multiMeasureMode: measures_definition_1.measuresDefinitionConverter.toMultiMeasureMode(definition.measures),
            singleMeasure: measures_definition_1.measuresDefinitionConverter.toSingleMeasure(definition.measures),
            selectedMeasures: measures_definition_1.measuresDefinitionConverter.toSelectedMeasures(definition.measures).toArray(),
            pinnedDimensions: definition.pinnedDimensions,
            pinnedSort: definition.pinnedSort,
            colors: definition.legend && legend_definition_1.legendConverter.toColors(definition.legend),
            highlight: definition.highlight && highlight_definition_1.highlightConverter(dataCube).toHighlight(definition.highlight).toJS()
        }, { dataCube: dataCube, visualizations: visualizations });
    };
    ViewDefinitionConverter3.prototype.toViewDefinition = function (essence) {
        var dataCube = essence.dataCube;
        return {
            visualization: essence.visualization.name,
            timezone: essence.timezone.toJS(),
            filters: essence.filter.clauses.map(function (fc) { return filter_definition_1.filterDefinitionConverter.fromFilterClause(fc, dataCube); }).toArray(),
            splits: essence.splits.splitCombines.map(split_definition_1.splitConverter.fromSplitCombine).toArray(),
            measures: measures_definition_1.measuresDefinitionConverter.fromSimpleValues(essence.multiMeasureMode, essence.singleMeasure, essence.selectedMeasures),
            pinnedDimensions: essence.pinnedDimensions.toArray(),
            pinnedSort: essence.pinnedSort,
            legend: essence.colors && legend_definition_1.legendConverter.fromColors(essence.colors),
            highlight: essence.highlight && highlight_definition_1.highlightConverter(dataCube).fromHighlight(essence.highlight)
        };
    };
    return ViewDefinitionConverter3;
}());
exports.ViewDefinitionConverter3 = ViewDefinitionConverter3;
//# sourceMappingURL=view-definition-converter-3.js.map