"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../../models");
exports.legendConverter = {
    toColors: function (legend) {
        var dimension = legend.dimension, values = legend.values, limit = legend.limit, hasNull = legend.hasNull;
        return new models_1.Colors({ dimension: dimension, limit: limit, values: values, hasNull: hasNull });
    },
    fromColors: function (colors) {
        var dimension = colors.dimension, limit = colors.limit, values = colors.values, hasNull = colors.hasNull;
        return {
            dimension: dimension,
            limit: limit,
            values: values,
            hasNull: hasNull
        };
    }
};
//# sourceMappingURL=legend-definition.js.map