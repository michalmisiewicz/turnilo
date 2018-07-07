"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var plywood_1 = require("plywood");
var filter_clause_1 = require("../../models/filter-clause/filter-clause");
var FilterType;
(function (FilterType) {
    FilterType["boolean"] = "boolean";
    FilterType["number"] = "number";
    FilterType["string"] = "string";
    FilterType["time"] = "time";
})(FilterType = exports.FilterType || (exports.FilterType = {}));
var StringFilterAction;
(function (StringFilterAction) {
    StringFilterAction["in"] = "in";
    StringFilterAction["match"] = "match";
    StringFilterAction["contains"] = "contains";
})(StringFilterAction = exports.StringFilterAction || (exports.StringFilterAction = {}));
var stringActionMap = {
    in: filter_clause_1.SupportedAction.overlap,
    match: filter_clause_1.SupportedAction.match,
    contains: filter_clause_1.SupportedAction.contains
};
var booleanFilterClauseConverter = {
    toFilterClause: function (clauseDefinition, dimension) {
        var not = clauseDefinition.not, values = clauseDefinition.values;
        var expression = dimension.expression;
        var selection = plywood_1.r(values);
        return new filter_clause_1.FilterClause({ action: filter_clause_1.SupportedAction.overlap, exclude: not, expression: expression, selection: selection });
    },
    fromFilterClause: function (filterClause, dimension) {
        var exclude = filterClause.exclude, selection = filterClause.selection;
        var referenceName = dimension.name;
        return {
            type: FilterType.boolean,
            ref: referenceName,
            values: selection.value.elements,
            not: exclude
        };
    }
};
var stringFilterClauseConverter = {
    toFilterClause: function (clauseDefinition, dimension) {
        var action = clauseDefinition.action, not = clauseDefinition.not, values = clauseDefinition.values;
        if (action === null) {
            throw Error("String filter action cannot be empty. Dimension: " + dimension);
        }
        if (StringFilterAction[action] === undefined) {
            throw Error("Unknown string filter action. Dimension: " + dimension);
        }
        if (action in [StringFilterAction.contains, StringFilterAction.match] && values.length !== 1) {
            throw Error("Wrong string filter values: " + values + " for action: " + action + ". Dimension: " + dimension);
        }
        var expression = dimension.expression;
        var selection;
        if (action === StringFilterAction.in) {
            selection = plywood_1.r(values);
        }
        else if (action === StringFilterAction.contains) {
            selection = plywood_1.r(values[0]);
        }
        else if (action === StringFilterAction.match) {
            selection = values[0];
        }
        return new filter_clause_1.FilterClause({ action: stringActionMap[action], exclude: not, expression: expression, selection: selection });
    },
    fromFilterClause: function (filterClause, dimension) {
        var action = filterClause.action, exclude = filterClause.exclude, selection = filterClause.selection;
        var referenceName = dimension.name;
        switch (action) {
            case filter_clause_1.SupportedAction.overlap:
            case undefined:
                return {
                    type: FilterType.string,
                    ref: referenceName,
                    action: StringFilterAction.in,
                    values: selection.value.elements,
                    not: exclude
                };
            case filter_clause_1.SupportedAction.contains:
                return {
                    type: FilterType.string,
                    ref: referenceName,
                    action: StringFilterAction.contains,
                    values: [selection.value],
                    not: exclude
                };
            case filter_clause_1.SupportedAction.match:
                return {
                    type: FilterType.string,
                    ref: referenceName,
                    action: StringFilterAction.match,
                    values: [selection],
                    not: exclude
                };
        }
    }
};
var numberFilterClauseConverter = {
    toFilterClause: function (filterModel, dimension) {
        var not = filterModel.not, ranges = filterModel.ranges;
        var expression = dimension.expression;
        var selection = plywood_1.r(ranges);
        return new filter_clause_1.FilterClause({ action: filter_clause_1.SupportedAction.overlap, exclude: not, expression: expression, selection: selection });
    },
    fromFilterClause: function (filterClause, dimension) {
        var exclude = filterClause.exclude, selection = filterClause.selection;
        var referenceName = dimension.name;
        if (isNumberFilterSelection(selection) && selection.value instanceof plywood_1.Set) {
            return {
                type: FilterType.number,
                ref: referenceName,
                not: exclude,
                ranges: selection.value.elements.map(function (range) { return ({ start: range.start, end: range.end, bounds: range.bounds }); })
            };
        }
        else {
            throw new Error("Number filterClause expected, found: " + filterClause + ". Dimension: " + referenceName);
        }
    }
};
var timeFilterClauseConverter = {
    toFilterClause: function (filterModel, dimension) {
        var timeRanges = filterModel.timeRanges, timePeriods = filterModel.timePeriods;
        if (timeRanges === undefined && timePeriods === undefined) {
            throw Error("Time filter must have one of: timeRanges or timePeriods property. Dimension: " + dimension);
        }
        if (timeRanges !== undefined && timeRanges.length !== 1) {
            throw Error("Time filter support a single timeRange only. Dimension: " + dimension);
        }
        if (timePeriods !== undefined && timePeriods.length !== 1) {
            throw Error("Time filter support a single timePeriod only. Dimension: " + dimension);
        }
        var expression = dimension.expression;
        var selection;
        if (timeRanges !== undefined && timeRanges.length === 1) {
            selection = plywood_1.r(__assign({}, timeRanges[0], { type: "TIME_RANGE" }));
        }
        else if (timePeriods !== null && timePeriods.length === 1) {
            var timePeriod = timePeriods[0];
            selection = timePeriodToExpression(timePeriod);
        }
        else {
            throw new Error("Wrong time filter definition: " + filterModel);
        }
        return new filter_clause_1.FilterClause({ action: filter_clause_1.SupportedAction.overlap, expression: expression, selection: selection });
    },
    fromFilterClause: function (filterClause, dimension) {
        var selection = filterClause.selection;
        var referenceName = dimension.name;
        if (isFixedTimeRangeSelection(selection)) {
            var timeRange = selection.value;
            return {
                type: FilterType.time,
                ref: referenceName,
                timeRanges: [{ start: timeRange.start.toISOString(), end: timeRange.end.toISOString() }]
            };
        }
        else if (isRelativeTimeRangeSelection(selection)) {
            if (selection.operand instanceof plywood_1.TimeFloorExpression) {
                return {
                    type: FilterType.time,
                    ref: referenceName,
                    timePeriods: [{ duration: selection.duration.toJS(), type: "floored", step: selection.step }]
                };
            }
            else {
                return {
                    type: FilterType.time,
                    ref: referenceName,
                    timePeriods: [{ duration: selection.duration.toJS(), type: "latest", step: selection.step }]
                };
            }
        }
        else {
            throw new Error("Time filterClause expected, found: " + filterClause + ". Dimension: " + referenceName);
        }
    }
};
function timePeriodToExpression(timePeriod) {
    switch (timePeriod.type) {
        case "latest":
            return plywood_1.$(filter_clause_1.FilterClause.MAX_TIME_REF_NAME)
                .timeRange(timePeriod.duration, timePeriod.step);
        case "floored":
            return plywood_1.$(filter_clause_1.FilterClause.NOW_REF_NAME)
                .timeFloor(timePeriod.duration)
                .timeRange(timePeriod.duration, timePeriod.step);
    }
}
var filterClauseConverters = {
    boolean: booleanFilterClauseConverter,
    number: numberFilterClauseConverter,
    string: stringFilterClauseConverter,
    time: timeFilterClauseConverter
};
exports.filterDefinitionConverter = {
    toFilterClause: function (clauseDefinition, dataCube) {
        if (clauseDefinition.ref == null) {
            throw new Error("Dimension name cannot be empty.");
        }
        var dimension = dataCube.getDimension(clauseDefinition.ref);
        if (dimension == null) {
            throw new Error("Dimension " + clauseDefinition.ref + " not found in data cube " + dataCube.name + ".");
        }
        var clauseConverter = filterClauseConverters[clauseDefinition.type];
        return clauseConverter.toFilterClause(clauseDefinition, dimension);
    },
    fromFilterClause: function (filterClause, dataCube) {
        var expression = filterClause.expression, selection = filterClause.selection;
        var dimension = dataCube.getDimensionByExpression(expression);
        if (isBooleanFilterSelection(selection)) {
            return booleanFilterClauseConverter.fromFilterClause(filterClause, dimension);
        }
        else if (isNumberFilterSelection(selection)) {
            return numberFilterClauseConverter.fromFilterClause(filterClause, dimension);
        }
        else if (isFixedTimeRangeSelection(selection) || isRelativeTimeRangeSelection(selection)) {
            return timeFilterClauseConverter.fromFilterClause(filterClause, dimension);
        }
        else {
            return stringFilterClauseConverter.fromFilterClause(filterClause, dimension);
        }
    }
};
function isBooleanFilterSelection(selection) {
    return selection instanceof plywood_1.LiteralExpression && selection.type === "SET/BOOLEAN";
}
function isNumberFilterSelection(selection) {
    return selection instanceof plywood_1.LiteralExpression && selection.type === "SET/NUMBER_RANGE";
}
function isFixedTimeRangeSelection(selection) {
    return selection instanceof plywood_1.LiteralExpression && selection.type === "TIME_RANGE";
}
function isRelativeTimeRangeSelection(selection) {
    return selection instanceof plywood_1.TimeRangeExpression;
}
//# sourceMappingURL=filter-definition.js.map