"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var plywood_1 = require("plywood");
var dimensions_fixtures_1 = require("../dimension/dimensions.fixtures");
var measures_fixtures_1 = require("../measure/measures.fixtures");
var data_cube_1 = require("./data-cube");
var executor = plywood_1.basicExecutorFactory({
    datasets: {
        wiki: plywood_1.Dataset.fromJS([]),
        twitter: plywood_1.Dataset.fromJS([])
    }
});
var DataCubeMock = (function () {
    function DataCubeMock() {
    }
    Object.defineProperty(DataCubeMock, "WIKI_JS", {
        get: function () {
            return {
                name: "wiki",
                title: "Wiki",
                description: "Wiki description",
                clusterName: "druid-wiki",
                source: "wiki",
                introspection: "none",
                attributes: [
                    { name: "time", type: "TIME" },
                    { name: "articleName", type: "STRING" },
                    { name: "page", type: "STRING" },
                    { name: "userChars", type: "SET/STRING" },
                    { name: "count", type: "NUMBER", unsplitable: true, maker: { op: "count" } }
                ],
                dimensions: dimensions_fixtures_1.DimensionsFixtures.wikiJS(),
                measures: measures_fixtures_1.MeasuresFixtures.wikiJS(),
                timeAttribute: "time",
                defaultTimezone: "Etc/UTC",
                defaultFilter: { op: "literal", value: true },
                defaultDuration: "P3D",
                defaultSortMeasure: "count",
                defaultPinnedDimensions: ["articleName"],
                defaultSelectedMeasures: ["count"],
                refreshRule: {
                    time: new Date("2016-04-30T12:39:51.350Z"),
                    rule: "fixed"
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataCubeMock, "TWITTER_JS", {
        get: function () {
            return {
                name: "twitter",
                title: "Twitter",
                description: "Twitter description should go here",
                clusterName: "druid-twitter",
                source: "twitter",
                introspection: "none",
                dimensions: dimensions_fixtures_1.DimensionsFixtures.twitterJS(),
                measures: measures_fixtures_1.MeasuresFixtures.twitterJS(),
                timeAttribute: "time",
                defaultTimezone: "Etc/UTC",
                defaultFilter: { op: "literal", value: true },
                defaultDuration: "P3D",
                defaultSortMeasure: "count",
                defaultPinnedDimensions: ["tweet"],
                refreshRule: {
                    rule: "realtime"
                }
            };
        },
        enumerable: true,
        configurable: true
    });
    DataCubeMock.wiki = function () {
        return data_cube_1.DataCube.fromJS(DataCubeMock.WIKI_JS, { executor: executor });
    };
    DataCubeMock.twitter = function () {
        return data_cube_1.DataCube.fromJS(DataCubeMock.TWITTER_JS, { executor: executor });
    };
    return DataCubeMock;
}());
exports.DataCubeMock = DataCubeMock;
//# sourceMappingURL=data-cube.mock.js.map