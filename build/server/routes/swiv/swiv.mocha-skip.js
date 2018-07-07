"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var express = require("express");
var Q = require("q");
var supertest = require("supertest");
var app_settings_mock_1 = require("../../../common/models/app-settings/app-settings.mock");
var swivRouter = require("./swiv");
var app = express();
var appSettings = app_settings_mock_1.AppSettingsMock.wikiOnlyWithExecutor();
app.use(function (req, res, next) {
    req.user = null;
    req.version = "0.9.4";
    req.getSettings = function (dataCubeOfInterest) { return Q(appSettings); };
    next();
});
app.use("/", swivRouter);
describe("swiv router", function () {
    it("does a query (value)", function (testComplete) {
        supertest(app)
            .get("/")
            .expect(200)
            .end(function (err, res) {
            if (err)
                testComplete(err);
            chai_1.expect(res.text).to.contain("<!DOCTYPE html>");
            chai_1.expect(res.text).to.contain('<meta name="description" content="Data Explorer">');
            testComplete();
        });
    });
});
//# sourceMappingURL=swiv.mocha-skip.js.map