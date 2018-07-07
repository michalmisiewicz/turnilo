"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClusterFixtures = (function () {
    function ClusterFixtures() {
    }
    ClusterFixtures.druidWikiClusterJS = function () {
        return {
            name: "druid-wiki",
            type: "druid",
            host: "192.168.99.100",
            version: "0.9.1",
            timeout: 30000,
            healthCheckTimeout: 50,
            sourceListScan: "auto",
            sourceListRefreshInterval: 10000,
            sourceReintrospectInterval: 10000,
            introspectionStrategy: "segment-metadata-fallback"
        };
    };
    ClusterFixtures.druidTwitterClusterJS = function () {
        return {
            name: "druid-twitter",
            type: "druid",
            host: "192.168.99.101",
            version: "0.9.1",
            timeout: 30000,
            healthCheckTimeout: 200,
            sourceListScan: "auto",
            sourceListRefreshInterval: 10000,
            sourceReintrospectInterval: 10000,
            introspectionStrategy: "segment-metadata-fallback"
        };
    };
    return ClusterFixtures;
}());
exports.ClusterFixtures = ClusterFixtures;
//# sourceMappingURL=cluster.fixtures.js.map