"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var nock = require("nock");
var Q = require("q");
var supertest = require("supertest");
var app_settings_mock_1 = require("../../../common/models/app-settings/app-settings.mock");
var cluster_fixtures_1 = require("../../../common/models/cluster/cluster.fixtures");
var healthRouter = require("./health");
var appSettingsHandlerProvider = function (appSettings) {
    return function (req, res, next) {
        req.user = null;
        req.version = "0.9.4";
        req.getSettings = function (dataCubeOfInterest) { return Q(appSettings); };
        next();
    };
};
var mockLoadStatus = function (nock, fixture) {
    var status = fixture.status, initialized = fixture.initialized, delay = fixture.delay;
    nock
        .get(loadStatusPath)
        .delay(delay)
        .reply(status, { inventoryInitialized: initialized });
};
var appSettings = app_settings_mock_1.AppSettingsMock.wikiOnly();
var loadStatusPath = "/druid/broker/v1/loadstatus";
var wikiBrokerNock = nock("http://" + cluster_fixtures_1.ClusterFixtures.druidWikiClusterJS().host);
var twitterBrokerNock = nock("http://" + cluster_fixtures_1.ClusterFixtures.druidTwitterClusterJS().host);
describe("health router", function () {
    var app;
    var server;
    describe("single druid cluster", function () {
        before(function (done) {
            app = express();
            app.use(appSettingsHandlerProvider(appSettings));
            app.use("/", healthRouter);
            server = app.listen(0, done);
        });
        after(function (done) {
            server.close(done);
        });
        var singleClusterTests = [
            { scenario: "healthy broker", status: 200, initialized: true, delay: 0, expectedStatus: 200 },
            { scenario: "unhealthy broker", status: 500, initialized: false, delay: 0, expectedStatus: 503 },
            { scenario: "uninitialized broker", status: 200, initialized: false, delay: 0, expectedStatus: 503 },
            { scenario: "timeout to broker", status: 200, initialized: true, delay: 200, expectedStatus: 503 }
        ];
        singleClusterTests.forEach(function (_a) {
            var scenario = _a.scenario, status = _a.status, initialized = _a.initialized, delay = _a.delay, expectedStatus = _a.expectedStatus;
            it("returns " + expectedStatus + " with " + scenario, function (testComplete) {
                mockLoadStatus(wikiBrokerNock, { status: status, initialized: initialized, delay: delay });
                supertest(app)
                    .get("/")
                    .expect(expectedStatus, testComplete);
            });
        });
    });
    describe("multiple druid clusters", function () {
        before(function (done) {
            app = express();
            app.use(appSettingsHandlerProvider(app_settings_mock_1.AppSettingsMock.wikiTwitter()));
            app.use("/", healthRouter);
            server = app.listen(0, done);
        });
        after(function (done) {
            server.close(done);
        });
        var multipleClustersTests = [
            {
                scenario: "all healthy brokers",
                wikiBroker: { status: 200, initialized: true, delay: 0 },
                twitterBroker: { status: 200, initialized: true, delay: 0 },
                expectedStatus: 200
            },
            {
                scenario: "single unhealthy broker",
                wikiBroker: { status: 500, initialized: true, delay: 0 },
                twitterBroker: { status: 200, initialized: true, delay: 0 },
                expectedStatus: 503
            },
            {
                scenario: "single uninitialized broker",
                wikiBroker: { status: 200, initialized: true, delay: 0 },
                twitterBroker: { status: 200, initialized: false, delay: 0 },
                expectedStatus: 503
            },
            {
                scenario: "timeout to single broker",
                wikiBroker: { status: 200, initialized: true, delay: 100 },
                twitterBroker: { status: 200, initialized: true, delay: 0 },
                expectedStatus: 503
            }
        ];
        multipleClustersTests.forEach(function (_a) {
            var scenario = _a.scenario, wikiBroker = _a.wikiBroker, twitterBroker = _a.twitterBroker, expectedStatus = _a.expectedStatus;
            it("returns " + expectedStatus + " with " + scenario, function (testComplete) {
                mockLoadStatus(wikiBrokerNock, wikiBroker);
                mockLoadStatus(twitterBrokerNock, twitterBroker);
                supertest(app)
                    .get("/")
                    .expect(expectedStatus, testComplete);
            });
        });
    });
});
//# sourceMappingURL=health.mocha.js.map