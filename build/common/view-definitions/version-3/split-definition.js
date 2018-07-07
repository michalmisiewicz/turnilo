"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chronoshift_1 = require("chronoshift");
var plywood_1 = require("plywood");
var split_combine_1 = require("../../models/split-combine/split-combine");
var SplitType;
(function (SplitType) {
    SplitType["number"] = "number";
    SplitType["string"] = "string";
    SplitType["time"] = "time";
})(SplitType = exports.SplitType || (exports.SplitType = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["ascending"] = "ascending";
    SortDirection["descending"] = "descending";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
exports.sortDirectionMapper = {
    ascending: "ascending",
    descending: "descending"
};
exports.directionMapper = {
    ascending: SortDirection.ascending,
    descending: SortDirection.descending
};
var numberSplitConversion = {
    toSplitCombine: function (split) {
        var dimension = split.dimension, limit = split.limit, sort = split.sort, granularity = split.granularity;
        var expression = plywood_1.$(dimension);
        var bucketAction = new plywood_1.NumberBucketExpression({ size: granularity });
        var sortAction = sort && new plywood_1.SortExpression({ expression: plywood_1.$(sort.ref), direction: exports.sortDirectionMapper[sort.direction] });
        var limitAction = limit && new plywood_1.LimitExpression({ value: limit });
        return new split_combine_1.SplitCombine({ expression: expression, bucketAction: bucketAction, sortAction: sortAction, limitAction: limitAction });
    },
    fromSplitCombine: function (splitCombine) {
        var expression = splitCombine.expression, bucketAction = splitCombine.bucketAction, sortAction = splitCombine.sortAction, limitAction = splitCombine.limitAction;
        if (bucketAction instanceof plywood_1.NumberBucketExpression) {
            var dimension = expression.name;
            return {
                type: SplitType.number,
                dimension: dimension,
                granularity: bucketAction.size,
                sort: sortAction && { ref: sortAction.refName(), direction: exports.directionMapper[sortAction.direction] },
                limit: limitAction && limitAction.value
            };
        }
        else {
            throw new Error("");
        }
    }
};
var timeSplitConversion = {
    toSplitCombine: function (split) {
        var dimension = split.dimension, limit = split.limit, sort = split.sort, granularity = split.granularity;
        var expression = plywood_1.$(dimension);
        var bucketAction = new plywood_1.TimeBucketExpression({ duration: chronoshift_1.Duration.fromJS(granularity) });
        var sortAction = sort && new plywood_1.SortExpression({ expression: plywood_1.$(sort.ref), direction: exports.sortDirectionMapper[sort.direction] });
        var limitAction = limit && new plywood_1.LimitExpression({ value: limit });
        return new split_combine_1.SplitCombine({ expression: expression, bucketAction: bucketAction, sortAction: sortAction, limitAction: limitAction });
    },
    fromSplitCombine: function (splitCombine) {
        var expression = splitCombine.expression, bucketAction = splitCombine.bucketAction, sortAction = splitCombine.sortAction, limitAction = splitCombine.limitAction;
        if (bucketAction instanceof plywood_1.TimeBucketExpression) {
            var dimension = expression.name;
            return {
                type: SplitType.time,
                dimension: dimension,
                granularity: bucketAction.duration.toJS(),
                sort: sortAction && { ref: sortAction.refName(), direction: exports.directionMapper[sortAction.direction] },
                limit: limitAction && limitAction.value
            };
        }
        else {
            throw new Error("");
        }
    }
};
var stringSplitConversion = {
    toSplitCombine: function (split) {
        var dimension = split.dimension, limit = split.limit, sort = split.sort;
        var expression = plywood_1.$(dimension);
        var bucketAction = null;
        var sortAction = sort && new plywood_1.SortExpression({ expression: plywood_1.$(sort.ref), direction: exports.sortDirectionMapper[sort.direction] });
        var limitAction = limit && new plywood_1.LimitExpression({ value: limit });
        return new split_combine_1.SplitCombine({ expression: expression, bucketAction: bucketAction, sortAction: sortAction, limitAction: limitAction });
    },
    fromSplitCombine: function (splitCombine) {
        var expression = splitCombine.expression, sortAction = splitCombine.sortAction, limitAction = splitCombine.limitAction;
        var dimension = expression.name;
        return {
            type: SplitType.string,
            dimension: dimension,
            sort: sortAction && { ref: sortAction.refName(), direction: exports.directionMapper[sortAction.direction] },
            limit: limitAction && limitAction.value
        };
    }
};
var splitConversions = {
    number: numberSplitConversion,
    string: stringSplitConversion,
    time: timeSplitConversion
};
exports.splitConverter = {
    toSplitCombine: function (split) {
        return splitConversions[split.type].toSplitCombine(split);
    },
    fromSplitCombine: function (splitCombine) {
        var bucketAction = splitCombine.bucketAction;
        if (bucketAction instanceof plywood_1.NumberBucketExpression) {
            return numberSplitConversion.fromSplitCombine(splitCombine);
        }
        else if (bucketAction instanceof plywood_1.TimeBucketExpression) {
            return timeSplitConversion.fromSplitCombine(splitCombine);
        }
        else {
            return stringSplitConversion.fromSplitCombine(splitCombine);
        }
    }
};
//# sourceMappingURL=split-definition.js.map