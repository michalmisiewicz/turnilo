"use strict";
var express_1 = require("express");
var request = require("request-promise-native");
var view_definitions_1 = require("../../../common/view-definitions");
var config_1 = require("../../config");
var router = express_1.Router();
router.post("/", function (req, res) {
    var externalSystem = config_1.SERVER_SETTINGS.externalSystem;
    var _a = req.body, dataCubeName = _a.dataCubeName, viewDefinitionVersion = _a.viewDefinitionVersion, viewDefinition = _a.viewDefinition;
    if (typeof viewDefinitionVersion !== "string") {
        res.status(400).send({
            error: "must have a viewDefinitionVersion"
        });
        return;
    }
    var definitionConverter = view_definitions_1.definitionConverters[viewDefinitionVersion];
    if (definitionConverter == null) {
        res.status(400).send({
            error: "unsupported viewDefinitionVersion value"
        });
        return;
    }
    if (typeof dataCubeName !== "string") {
        res.status(400).send({
            error: "must have a dataCubeName"
        });
        return;
    }
    if (typeof viewDefinition !== "object") {
        res.status(400).send({
            error: "viewDefinition must be an object"
        });
        return;
    }
    req.getSettings({ dataCubeOfInterest: dataCubeName })
        .then(function (appSettings) {
        var myDataCube = appSettings.getDataCube(dataCubeName);
        var requestTimeout = Boolean(appSettings.customization.externalSystem.exportTimeout) ?
            appSettings.customization.externalSystem.exportTimeout : 1000;
        if (!myDataCube) {
            res.status(400).send({ error: "unknown data cube" });
            return;
        }
        request
            .post(externalSystem, { json: req.body, timeout: requestTimeout })
            .promise()
            .then(function (_) { return res.status(204).end(); })
            .catch(function (reason) {
            var returnCode = Boolean(reason.statusCode) ? reason.statusCode : 500;
            res.status(returnCode).send({ message: reason.message });
        });
    });
});
module.exports = router;
//# sourceMappingURL=export-to-external-system.js.map