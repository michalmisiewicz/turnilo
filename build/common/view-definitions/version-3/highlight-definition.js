"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../../models");
var filter_definition_1 = require("./filter-definition");
function highlightConverter(dataCube) {
    return {
        toHighlight: function (highlightDefinition) {
            var owner = highlightDefinition.owner, filters = highlightDefinition.filters, measure = highlightDefinition.measure;
            var filter = models_1.Filter.fromClauses(filters.map(function (fc) { return filter_definition_1.filterDefinitionConverter.toFilterClause(fc, dataCube); }));
            return new models_1.Highlight({ owner: owner, delta: filter, measure: measure });
        },
        fromHighlight: function (highlight) {
            var owner = highlight.owner, delta = highlight.delta, measure = highlight.measure;
            var filters = delta.clauses.map(function (fc) { return filter_definition_1.filterDefinitionConverter.fromFilterClause(fc, dataCube); }).toArray();
            return { owner: owner, filters: filters, measure: measure };
        }
    };
}
exports.highlightConverter = highlightConverter;
//# sourceMappingURL=highlight-definition.js.map