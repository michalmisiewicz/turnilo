"use strict";
var express_1 = require("express");
var manifests_1 = require("../../../common/manifests");
var url_hash_converter_1 = require("../../../common/utils/url-hash-converter/url-hash-converter");
var view_definitions_1 = require("../../../common/view-definitions");
var router = express_1.Router();
router.post("/", function (req, res) {
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
        if (!myDataCube) {
            res.status(400).send({ error: "unknown data cube" });
            return;
        }
        var essence;
        try {
            essence = definitionConverter.fromViewDefinition(viewDefinition, myDataCube, manifests_1.MANIFESTS);
        }
        catch (e) {
            res.status(400).send({
                error: "invalid viewDefinition object",
                message: e.message
            });
            return;
        }
        res.json({
            hash: "#" + myDataCube.name + "/" + url_hash_converter_1.urlHashConverter.toHash(essence)
        });
    })
        .done();
});
module.exports = router;
//# sourceMappingURL=mkurl.js.map