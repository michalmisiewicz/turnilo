"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("../../models");
var resolutions_1 = require("./resolutions");
var Actions = (function () {
    function Actions() {
    }
    Actions.ready = function (score) {
        if (score === void 0) { score = 10; }
        return function () { return models_1.Resolve.ready(score); };
    };
    Actions.manualDimensionSelection = function (message) {
        return function (_a) {
            var dataCube = _a.dataCube;
            return models_1.Resolve.manual(4, message, resolutions_1.Resolutions.someDimensions(dataCube));
        };
    };
    Actions.manualMeasuresSelection = function () {
        return function (_a) {
            var dataCube = _a.dataCube;
            var selectDefault = resolutions_1.Resolutions.defaultSelectedMeasures(dataCube);
            var resolutions = selectDefault.length > 0 ? selectDefault : resolutions_1.Resolutions.firstMeasure(dataCube);
            return models_1.Resolve.manual(3, "At least one of the measures should be selected", resolutions);
        };
    };
    return Actions;
}());
exports.Actions = Actions;
//# sourceMappingURL=actions.js.map