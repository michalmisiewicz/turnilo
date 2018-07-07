"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var express = require("express");
var plywood_1 = require("plywood");
var Q = require("q");
var supertest = require("supertest");
var app_settings_mock_1 = require("../../../common/models/app-settings/app-settings.mock");
var url_hash_converter_fixtures_1 = require("../../../common/utils/url-hash-converter/url-hash-converter.fixtures");
var mkurlRouter = require("./mkurl");
var app = express();
app.use(bodyParser.json());
var appSettings = app_settings_mock_1.AppSettingsMock.wikiOnlyWithExecutor();
app.use(function (req, res, next) {
    req.user = null;
    req.version = "0.9.4";
    req.getSettings = function (dataCubeOfInterest) { return Q(appSettings); };
    next();
});
var mkurlPath = "/mkurl";
app.use(mkurlPath, mkurlRouter);
describe("mkurl router", function () {
    it("gets a simple url back", function (testComplete) {
        supertest(app)
            .post(mkurlPath)
            .set("Content-Type", "application/json")
            .send({
            dataCubeName: "wiki",
            viewDefinitionVersion: "2",
            viewDefinition: {
                visualization: "totals",
                timezone: "Etc/UTC",
                filter: {
                    op: "literal",
                    value: true
                },
                pinnedDimensions: [],
                singleMeasure: "count",
                selectedMeasures: [],
                splits: []
            }
        })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect({
            hash: "#wiki/3/N4IgbglgzgrghgGwgLzgFwgewHYgFwhqZqJQgA0hEAtgKbI634gCiaAxgPQCqAKgMIUQAMwgI0tAE5k8AbQC6l" +
                "KAAckaGQsp04sSbRmhoAWRjiI+YaVpKI2AOYImBdphjY0Q6qYz4FAX0plW2xaABMAERpabCgsGN9FECDsENCAZUxJD2dXdyFHO2jQ/GxTBEoACwg7CqQa7NKEBD8gA"
        }, testComplete);
    });
    it("gets a complex url back", function (testComplete) {
        supertest(app)
            .post(mkurlPath)
            .set("Content-Type", "application/json")
            .send({
            dataCubeName: "wiki",
            viewDefinitionVersion: "2",
            viewDefinition: {
                visualization: "table",
                timezone: "Etc/UTC",
                filter: plywood_1.$("time")
                    .overlap(new Date("2015-09-12Z"), new Date("2015-09-13Z"))
                    .and(plywood_1.$("channel").overlap(["en"]))
                    .and(plywood_1.$("isRobot").overlap([true]).not())
                    .and(plywood_1.$("page").contains("Jeremy"))
                    .and(plywood_1.$("userChars").match("^A$"))
                    .and(plywood_1.$("commentLength").overlap([{ start: 3, end: null, type: "NUMBER_RANGE" }]))
                    .toJS(),
                pinnedDimensions: ["channel", "namespace", "isRobot"],
                pinnedSort: "delta",
                singleMeasure: "delta",
                selectedMeasures: ["count", "added"],
                multiMeasureMode: true,
                splits: [
                    {
                        expression: {
                            op: "ref",
                            name: "channel"
                        },
                        sortAction: {
                            op: "sort",
                            expression: {
                                op: "ref",
                                name: "delta"
                            },
                            direction: "descending"
                        },
                        limitAction: {
                            op: "limit",
                            value: 50
                        }
                    },
                    {
                        expression: {
                            op: "ref",
                            name: "isRobot"
                        },
                        sortAction: {
                            op: "sort",
                            expression: {
                                op: "ref",
                                name: "delta"
                            },
                            direction: "descending"
                        },
                        limitAction: {
                            op: "limit",
                            value: 5
                        }
                    },
                    {
                        expression: {
                            op: "ref",
                            name: "commentLength"
                        },
                        bucketAction: {
                            op: "numberBucket",
                            size: 10,
                            offset: 0
                        },
                        sortAction: {
                            op: "sort",
                            expression: {
                                op: "ref",
                                name: "delta"
                            },
                            direction: "descending"
                        },
                        limitAction: {
                            op: "limit",
                            value: 5
                        }
                    },
                    {
                        expression: {
                            op: "ref",
                            name: "time"
                        },
                        bucketAction: {
                            op: "timeBucket",
                            duration: "PT1H"
                        },
                        sortAction: {
                            op: "sort",
                            expression: {
                                op: "ref",
                                name: "delta"
                            },
                            direction: "descending"
                        }
                    }
                ]
            }
        })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(200)
            .expect({
            hash: "#wiki/" + url_hash_converter_fixtures_1.UrlHashConverterFixtures.tableHashVersion3()
        }, testComplete);
    });
});
//# sourceMappingURL=mkurl.mocha.js.map