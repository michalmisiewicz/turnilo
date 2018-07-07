"use strict";
var express_1 = require("express");
var config_1 = require("../../config");
var views_1 = require("../../views");
var router = express_1.Router();
router.get("/", function (req, res, next) {
    req.getSettings()
        .then(function (appSettings) {
        var clientSettings = appSettings.toClientSettings();
        res.send(views_1.mainLayout({
            version: req.version,
            title: appSettings.customization.getTitle(req.version),
            user: req.user,
            appSettings: clientSettings,
            timekeeper: config_1.SETTINGS_MANAGER.getTimekeeper(),
            stateful: req.stateful
        }));
    })
        .done();
});
module.exports = router;
//# sourceMappingURL=swiv.js.map