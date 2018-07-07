"use strict";
var express_1 = require("express");
var index_1 = require("../../../common/manifests/index");
var index_2 = require("../../../common/models/index");
var config_1 = require("../../config");
var router = express_1.Router();
router.post("/", function (req, res) {
    var collections = req.body.collections;
    if (!Array.isArray(collections)) {
        res.status(400).send({
            error: "bad collections",
            message: "not an array"
        });
        return;
    }
    config_1.SETTINGS_MANAGER.getSettings()
        .then(function (appSettings) {
        var collectionContext = {
            dataCubes: appSettings.dataCubes,
            visualizations: index_1.MANIFESTS
        };
        return appSettings.changeCollections(collections.map(function (collection) {
            return index_2.Collection.fromJS(collection, collectionContext);
        }));
    })
        .then(function (newAppSettings) { return config_1.SETTINGS_MANAGER.updateSettings(newAppSettings); })
        .then(function () {
        res.send({ status: "ok" });
    }, function (e) {
        console.log("error:", e.message);
        if (e.hasOwnProperty("stack")) {
            console.log(e.stack);
        }
        res.status(500).send({
            error: "could not compute",
            message: e.message
        });
    })
        .done();
});
module.exports = router;
//# sourceMappingURL=collections.js.map