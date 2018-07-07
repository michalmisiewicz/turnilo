"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_class_1 = require("immutable-class");
var plywood_1 = require("plywood");
var general_1 = require("../../utils/general/general");
function ensureNotNative(name) {
    if (name === "native") {
        throw new Error("can not be 'native'");
    }
}
function ensureNotTiny(v) {
    if (v === 0)
        return;
    if (v < 1000) {
        throw new Error("can not be < 1000 (is " + v + ")");
    }
}
var Cluster = (function (_super) {
    __extends(Cluster, _super);
    function Cluster(parameters) {
        var _this = _super.call(this, parameters) || this;
        switch (_this.type) {
            case "druid":
                _this.database = null;
                _this.user = null;
                _this.password = null;
                break;
            case "mysql":
            case "postgres":
                _this.introspectionStrategy = null;
                _this.requestDecorator = null;
                _this.decoratorOptions = null;
                break;
        }
        return _this;
    }
    Cluster.isCluster = function (candidate) {
        return candidate instanceof Cluster;
    };
    Cluster.fromJS = function (parameters) {
        if (!parameters.host && (parameters.druidHost || parameters.brokerHost)) {
            parameters.host = parameters.druidHost || parameters.brokerHost;
        }
        if (typeof parameters.timeout === "string") {
            parameters.timeout = parseInt(parameters.timeout, 10);
        }
        if (typeof parameters.sourceListRefreshInterval === "string") {
            parameters.sourceListRefreshInterval = parseInt(parameters.sourceListRefreshInterval, 10);
        }
        if (typeof parameters.sourceReintrospectInterval === "string") {
            parameters.sourceReintrospectInterval = parseInt(parameters.sourceReintrospectInterval, 10);
        }
        return new Cluster(immutable_class_1.BaseImmutable.jsToValue(Cluster.PROPERTIES, parameters));
    };
    Cluster.prototype.toClientCluster = function () {
        return new Cluster({
            name: this.name,
            type: this.type
        });
    };
    Cluster.prototype.makeExternalFromSourceName = function (source, version) {
        return plywood_1.External.fromValue({
            engine: this.type,
            source: source,
            version: version,
            suppress: true,
            allowSelectQueries: true,
            allowEternity: false
        });
    };
    Cluster.prototype.shouldScanSources = function () {
        return this.getSourceListScan() === "auto";
    };
    Cluster.TYPE_VALUES = ["druid", "mysql", "postgres"];
    Cluster.DEFAULT_TIMEOUT = 40000;
    Cluster.DEFAULT_HEALTH_CHECK_TIMEOUT = 1000;
    Cluster.DEFAULT_SOURCE_LIST_SCAN = "auto";
    Cluster.SOURCE_LIST_SCAN_VALUES = ["disable", "auto"];
    Cluster.DEFAULT_SOURCE_LIST_REFRESH_INTERVAL = 0;
    Cluster.DEFAULT_SOURCE_LIST_REFRESH_ON_LOAD = false;
    Cluster.DEFAULT_SOURCE_REINTROSPECT_INTERVAL = 0;
    Cluster.DEFAULT_SOURCE_REINTROSPECT_ON_LOAD = false;
    Cluster.DEFAULT_INTROSPECTION_STRATEGY = "segment-metadata-fallback";
    Cluster.PROPERTIES = [
        { name: "name", validate: [general_1.verifyUrlSafeName, ensureNotNative] },
        { name: "type", possibleValues: Cluster.TYPE_VALUES },
        { name: "host", defaultValue: null },
        { name: "title", defaultValue: "" },
        { name: "version", defaultValue: null },
        { name: "timeout", defaultValue: Cluster.DEFAULT_TIMEOUT },
        { name: "healthCheckTimeout", defaultValue: Cluster.DEFAULT_HEALTH_CHECK_TIMEOUT },
        { name: "sourceListScan", defaultValue: Cluster.DEFAULT_SOURCE_LIST_SCAN, possibleValues: Cluster.SOURCE_LIST_SCAN_VALUES },
        { name: "sourceListRefreshOnLoad", defaultValue: Cluster.DEFAULT_SOURCE_LIST_REFRESH_ON_LOAD },
        {
            name: "sourceListRefreshInterval",
            defaultValue: Cluster.DEFAULT_SOURCE_LIST_REFRESH_INTERVAL,
            validate: [immutable_class_1.BaseImmutable.ensure.number, ensureNotTiny]
        },
        { name: "sourceReintrospectOnLoad", defaultValue: Cluster.DEFAULT_SOURCE_REINTROSPECT_ON_LOAD },
        {
            name: "sourceReintrospectInterval",
            defaultValue: Cluster.DEFAULT_SOURCE_REINTROSPECT_INTERVAL,
            validate: [immutable_class_1.BaseImmutable.ensure.number, ensureNotTiny]
        },
        { name: "introspectionStrategy", defaultValue: Cluster.DEFAULT_INTROSPECTION_STRATEGY },
        { name: "requestDecorator", defaultValue: null },
        { name: "decoratorOptions", defaultValue: null },
        { name: "database", defaultValue: null },
        { name: "user", defaultValue: null },
        { name: "password", defaultValue: null }
    ];
    return Cluster;
}(immutable_class_1.BaseImmutable));
exports.Cluster = Cluster;
immutable_class_1.BaseImmutable.finalize(Cluster);
//# sourceMappingURL=cluster.js.map