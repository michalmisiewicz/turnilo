"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var numeral = require("numeral");
var plywood_1 = require("plywood");
var constants_1 = require("../../../client/config/constants");
var models_1 = require("../../models");
var time_1 = require("../../utils/time/time");
var scales = {
    a: {
        "": 1,
        "k": 1e3,
        "m": 1e6,
        "b": 1e9,
        "t": 1e12
    },
    b: {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
        TB: 1024 * 1024 * 1024 * 1024,
        PB: 1024 * 1024 * 1024 * 1024 * 1024,
        EB: 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
        ZB: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
        YB: 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024
    }
};
function getMiddleNumber(values) {
    var filteredAbsData = [];
    for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
        var v = values_1[_i];
        if (v === 0 || isNaN(v) || !isFinite(v))
            continue;
        filteredAbsData.push(Math.abs(v));
    }
    var n = filteredAbsData.length;
    if (n) {
        filteredAbsData.sort(function (a, b) { return b - a; });
        return filteredAbsData[Math.ceil((n - 1) / 2)];
    }
    else {
        return 0;
    }
}
exports.getMiddleNumber = getMiddleNumber;
function formatterFromData(values, format) {
    var match = format.match(/^(\S*)( ?)([ab])$/);
    if (match) {
        var numberFormat_1 = match[1];
        var space = match[2];
        var formatType = match[3];
        var middle = getMiddleNumber(values);
        var formatMiddle = numeral(middle).format("0 " + formatType);
        var unit = formatMiddle.split(" ")[1] || "";
        var scale_1 = scales[formatType][unit];
        var append_1 = unit ? space + unit : "";
        return function (n) {
            if (isNaN(n) || !isFinite(n))
                return "-";
            return numeral(n / scale_1).format(numberFormat_1) + append_1;
        };
    }
    else {
        return function (n) {
            if (isNaN(n) || !isFinite(n))
                return "-";
            return numeral(n).format(format);
        };
    }
}
exports.formatterFromData = formatterFromData;
function formatNumberRange(value) {
    return formatValue(value.start || "any") + " to " + formatValue(value.end || "any");
}
exports.formatNumberRange = formatNumberRange;
function formatValue(value, timezone, displayYear) {
    if (plywood_1.NumberRange.isNumberRange(value)) {
        return formatNumberRange(value);
    }
    else if (plywood_1.TimeRange.isTimeRange(value)) {
        return time_1.formatTimeRange(value, timezone, displayYear);
    }
    else {
        return "" + value;
    }
}
exports.formatValue = formatValue;
function formatFilterClause(dimension, clause, timezone, verbose) {
    var _a = this.getFormattedClause(dimension, clause, timezone, verbose), title = _a.title, values = _a.values;
    return title ? title + " " + values : values;
}
exports.formatFilterClause = formatFilterClause;
function getFormattedClause(dimension, clause, timezone, verbose) {
    var dimKind = dimension.kind;
    var values;
    var clauseSet = clause.getLiteralSet();
    function getClauseLabel() {
        var dimTitle = dimension.title;
        if (dimKind === "time" && !verbose)
            return "";
        var delimiter = ["regex", "contains"].indexOf(clause.action) !== -1 ? " ~" : ":";
        if (clauseSet && clauseSet.elements.length > 1 && !verbose)
            return "" + dimTitle;
        return "" + dimTitle + delimiter;
    }
    switch (dimKind) {
        case "boolean":
        case "number":
        case "string":
            if (verbose) {
                values = clauseSet.toString();
            }
            else {
                var setElements = clauseSet.elements;
                if (setElements.length > 1) {
                    values = "(" + setElements.length + ")";
                }
                else {
                    values = formatValue(setElements[0]);
                }
            }
            if (clause.action === "match")
                values = "/" + values + "/";
            if (clause.action === models_1.Filter.CONTAINS)
                values = "\"" + values + "\"";
            break;
        case "time":
            values = getFormattedTimeClauseValues(clause, timezone);
            break;
        default:
            throw new Error("unknown kind " + dimKind);
    }
    return { title: getClauseLabel(), values: values };
}
exports.getFormattedClause = getFormattedClause;
var $now = plywood_1.$(models_1.FilterClause.NOW_REF_NAME);
var $max = plywood_1.$(models_1.FilterClause.MAX_TIME_REF_NAME);
function getFormattedTimeClauseValues(clause, timezone) {
    var relative = clause.relative, selection = clause.selection;
    if (isLatestDuration(relative, selection)) {
        return constants_1.STRINGS.latest + " " + getQualifiedDurationDescription(selection);
    }
    else if (isPreviousDuration(relative, selection)) {
        return constants_1.STRINGS.previous + " " + getQualifiedDurationDescription(selection);
    }
    else if (isCurrentDuration(relative, selection)) {
        return constants_1.STRINGS.current + " " + getQualifiedDurationDescription(selection);
    }
    else if (selection instanceof plywood_1.LiteralExpression && selection.value instanceof plywood_1.TimeRange) {
        return time_1.formatTimeRange(selection.value, timezone, time_1.DisplayYear.IF_DIFF);
    }
    else {
        throw Error("unsupported time filter clause: " + clause.selection);
    }
}
function isLatestDuration(isRelative, selection) {
    function isEarlierTimeRange(selection) {
        return selection.step < 0;
    }
    return isRelative
        && selection instanceof plywood_1.TimeRangeExpression
        && selection.getHeadOperand().equals($max)
        && isEarlierTimeRange(selection);
}
function isCurrentDuration(isRelative, selection) {
    function isCurrentTimeRange(selection) {
        return selection.step === 1;
    }
    return isRelative
        && selection instanceof plywood_1.TimeRangeExpression
        && selection.getHeadOperand().equals($now)
        && isCurrentTimeRange(selection);
}
function isPreviousDuration(isRelative, selection) {
    function isPreviousTimeRange(selection) {
        return selection.step === -1;
    }
    return isRelative
        && selection instanceof plywood_1.TimeRangeExpression
        && selection.getHeadOperand().equals($now)
        && isPreviousTimeRange(selection);
}
function getQualifiedDurationDescription(selection) {
    return normalizeDurationDescription(selection.getQualifiedDurationDescription(), selection.duration);
}
function normalizeDurationDescription(description, duration) {
    if (duration.toString() === "P3M") {
        return constants_1.STRINGS.quarter.toLowerCase();
    }
    else {
        return description;
    }
}
//# sourceMappingURL=formatter.js.map