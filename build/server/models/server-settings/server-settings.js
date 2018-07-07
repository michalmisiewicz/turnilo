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
var settings_location_1 = require("../settings-location/settings-location");
function ensureOneOfOrNull(name, thing, things) {
    if (thing == null)
        return;
    if (things.indexOf(thing) === -1) {
        throw new Error("'" + thing + "' is not a valid value for " + name + ", must be one of: " + things.join(", "));
    }
}
function basicEqual(a, b) {
    return Boolean(a) === Boolean(b);
}
var ServerSettings = (function (_super) {
    __extends(ServerSettings, _super);
    function ServerSettings(parameters) {
        return _super.call(this, parameters) || this;
    }
    ServerSettings.isServerSettings = function (candidate) {
        return candidate instanceof ServerSettings;
    };
    ServerSettings.fromJS = function (parameters) {
        if (typeof parameters.port === "string")
            parameters.port = parseInt(parameters.port, 10);
        if (parameters.serverRoot && parameters.serverRoot[0] !== "/")
            parameters.serverRoot = "/" + parameters.serverRoot;
        if (parameters.serverRoot === "/")
            parameters.serverRoot = null;
        return new ServerSettings(immutable_class_1.BaseImmutable.jsToValue(ServerSettings.PROPERTIES, parameters));
    };
    ServerSettings.DEFAULT_PORT = 9090;
    ServerSettings.DEFAULT_SERVER_ROOT = "/turnilo";
    ServerSettings.DEFAULT_HEALTH_ENDPOINT = "/health";
    ServerSettings.DEFAULT_REQUEST_LOG_FORMAT = "common";
    ServerSettings.DEFAULT_PAGE_MUST_LOAD_TIMEOUT = 800;
    ServerSettings.IFRAME_VALUES = ["allow", "deny"];
    ServerSettings.DEFAULT_IFRAME = "allow";
    ServerSettings.TRUST_PROXY_VALUES = ["none", "always"];
    ServerSettings.DEFAULT_TRUST_PROXY = "none";
    ServerSettings.STRICT_TRANSPORT_SECURITY_VALUES = ["none", "always"];
    ServerSettings.DEFAULT_STRICT_TRANSPORT_SECURITY = "none";
    ServerSettings.DEFAULT_EXPORT_TO_EXTERNAL_SYSTEM_ENDPOINT = "/external";
    ServerSettings.PROPERTIES = [
        { name: "port", defaultValue: ServerSettings.DEFAULT_PORT, validate: immutable_class_1.BaseImmutable.ensure.number },
        { name: "serverHost", defaultValue: null },
        { name: "serverRoot", defaultValue: ServerSettings.DEFAULT_SERVER_ROOT },
        { name: "healthEndpoint", defaultValue: ServerSettings.DEFAULT_HEALTH_ENDPOINT },
        { name: "requestLogFormat", defaultValue: ServerSettings.DEFAULT_REQUEST_LOG_FORMAT },
        { name: "trackingUrl", defaultValue: null },
        { name: "trackingContext", defaultValue: null, equal: basicEqual },
        { name: "pageMustLoadTimeout", defaultValue: ServerSettings.DEFAULT_PAGE_MUST_LOAD_TIMEOUT },
        { name: "iframe", defaultValue: ServerSettings.DEFAULT_IFRAME, possibleValues: ServerSettings.IFRAME_VALUES },
        { name: "trustProxy", defaultValue: ServerSettings.DEFAULT_TRUST_PROXY, possibleValues: ServerSettings.TRUST_PROXY_VALUES },
        {
            name: "strictTransportSecurity",
            defaultValue: ServerSettings.DEFAULT_STRICT_TRANSPORT_SECURITY,
            possibleValues: ServerSettings.STRICT_TRANSPORT_SECURITY_VALUES
        },
        { name: "auth", defaultValue: null },
        { name: "settingsLocation", defaultValue: null, immutableClass: settings_location_1.SettingsLocation },
        { name: "externalSystem", defaultValue: null },
        { name: "externalSystemEndpoint", defaultValue: ServerSettings.DEFAULT_EXPORT_TO_EXTERNAL_SYSTEM_ENDPOINT }
    ];
    return ServerSettings;
}(immutable_class_1.BaseImmutable));
exports.ServerSettings = ServerSettings;
immutable_class_1.BaseImmutable.finalize(ServerSettings);
//# sourceMappingURL=server-settings.js.map