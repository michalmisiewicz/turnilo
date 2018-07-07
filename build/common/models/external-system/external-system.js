"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validator_1 = require("validator");
var ExternalSystem = (function () {
    function ExternalSystem(parameters) {
        var enabled = parameters.enabled, exportTimeout = parameters.exportTimeout, redirectLink = parameters.redirectLink;
        if (redirectLink && !validator_1.isURL(redirectLink)) {
            throw new Error("External system URL is malformed: " + redirectLink);
        }
        this.enabled = !!(redirectLink || enabled);
        this.redirectLink = redirectLink;
        this.exportTimeout = Boolean(exportTimeout) ? exportTimeout : ExternalSystem.DEFAULT_EXPORT_TIMEOUT;
    }
    ExternalSystem.isExternalSystem = function (candidate) {
        return candidate instanceof ExternalSystem;
    };
    ExternalSystem.fromJS = function (parameters) {
        var redirectLink = parameters.redirectLink, enabled = parameters.enabled;
        return new ExternalSystem({
            redirectLink: redirectLink,
            enabled: enabled
        });
    };
    ExternalSystem.prototype.equals = function (other) {
        return ExternalSystem.isExternalSystem(other) &&
            this.redirectLink === other.redirectLink &&
            this.enabled === other.enabled &&
            this.exportTimeout === other.exportTimeout;
    };
    ExternalSystem.prototype.toJS = function () {
        var js = {
            enabled: this.enabled,
            exportTimeout: this.exportTimeout,
            redirectLink: this.redirectLink
        };
        return js;
    };
    ExternalSystem.prototype.toJSON = function () {
        return this.toJS();
    };
    ExternalSystem.prototype.valueOf = function () {
        var value = {
            enabled: this.enabled,
            exportTimeout: this.exportTimeout,
            redirectLink: this.redirectLink
        };
        return value;
    };
    ExternalSystem.DEFAULT_EXPORT_TIMEOUT = 1000;
    return ExternalSystem;
}());
exports.ExternalSystem = ExternalSystem;
//# sourceMappingURL=external-system.js.map