"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
exports.measuresDefinitionConverter = {
    fromSimpleValues: function (multiMeasureMode, singleMeasure, selectedMeasures) {
        return {
            isMulti: multiMeasureMode,
            single: singleMeasure,
            multi: selectedMeasures.toArray()
        };
    },
    toMultiMeasureMode: function (measuresDefinition) {
        return measuresDefinition.isMulti;
    },
    toSingleMeasure: function (measuresDefinition) {
        return measuresDefinition.single;
    },
    toSelectedMeasures: function (measuresDefinition) {
        return immutable_1.OrderedSet(measuresDefinition.multi);
    }
};
//# sourceMappingURL=measures-definition.js.map