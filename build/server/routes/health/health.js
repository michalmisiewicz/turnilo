"use strict";
var express_1 = require("express");
var request = require("request-promise-native");
var router = express_1.Router();
router.get("/", function (req, res) {
    req
        .getSettings()
        .then(function (appSettings) { return appSettings.clusters; })
        .then(checkClusters)
        .then(function (clusterHealths) { return emitHealthStatus(clusterHealths)(res); })
        .catch(function (reason) { return res.status(unhealthyHttpStatus).send({ status: ClusterHealthStatus.unhealthy, message: reason.message }); });
});
var unhealthyHttpStatus = 503;
var healthyHttpStatus = 200;
var ClusterHealthStatus;
(function (ClusterHealthStatus) {
    ClusterHealthStatus["healthy"] = "healthy";
    ClusterHealthStatus["unhealthy"] = "unhealthy";
})(ClusterHealthStatus || (ClusterHealthStatus = {}));
var statusToHttpStatusMap = {
    healthy: healthyHttpStatus,
    unhealthy: unhealthyHttpStatus
};
var checkClusters = function (clusters) {
    var promises = clusters
        .filter(function (cluster) { return (cluster.type === "druid"); })
        .map(checkDruidCluster);
    return Promise.all(promises);
};
var checkDruidCluster = function (cluster) {
    var host = cluster.host;
    var loadStatusUrl = "http://" + cluster.host + "/druid/broker/v1/loadstatus";
    return request
        .get(loadStatusUrl, { json: true, timeout: cluster.healthCheckTimeout })
        .promise()
        .then(function (loadStatus) {
        var inventoryInitialized = loadStatus.inventoryInitialized;
        if (inventoryInitialized) {
            return { host: host, status: ClusterHealthStatus.healthy, message: "" };
        }
        else {
            return { host: host, status: ClusterHealthStatus.unhealthy, message: "inventory not initialized" };
        }
    })
        .catch(function (reason) {
        var reasonMessage;
        if (reason != null && reason instanceof Error) {
            reasonMessage = reason.message;
        }
        return { host: host, status: ClusterHealthStatus.unhealthy, message: "connection error: '" + reasonMessage + "'" };
    });
};
var emitHealthStatus = function (clusterHealths) {
    return function (response) {
        var overallHealth = clusterHealths
            .map(function (clusterHealth) { return (clusterHealth.status); })
            .reduce(healthStatusReducer, ClusterHealthStatus.healthy);
        var httpState = statusToHttpStatusMap[overallHealth];
        response.status(httpState).send({ status: overallHealth, clusters: clusterHealths });
    };
};
var healthStatusReducer = function (before, current) {
    return current === ClusterHealthStatus.unhealthy ? current : before;
};
module.exports = router;
//# sourceMappingURL=health.js.map