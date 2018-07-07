"use strict";
var bodyParser = require("body-parser");
var compress = require("compression");
var express = require("express");
var helmet_1 = require("helmet");
var logger_tracker_1 = require("logger-tracker");
var path = require("path");
var config_1 = require("./config");
var collectionsRoutes = require("./routes/collections/collections");
var errorRoutes = require("./routes/error/error");
var externalSystemRoutes = require("./routes/export-to-external-system/export-to-external-system");
var healthRoutes = require("./routes/health/health");
var mkurlRoutes = require("./routes/mkurl/mkurl");
var plyqlRoutes = require("./routes/plyql/plyql");
var plywoodRoutes = require("./routes/plywood/plywood");
var settingsRoutes = require("./routes/settings/settings");
var swivRoutes = require("./routes/swiv/swiv");
var views_1 = require("./views");
function makeGuard(guard) {
    return function (req, res, next) {
        var user = req.user;
        if (!user) {
            next(new Error("no user"));
            return;
        }
        var allow = user.allow;
        if (!allow) {
            next(new Error("no user.allow"));
            return;
        }
        if (!allow[guard]) {
            next(new Error("not allowed"));
            return;
        }
        next();
    };
}
var app = express();
app.disable("x-powered-by");
if (config_1.SERVER_SETTINGS.getTrustProxy() === "always") {
    app.set("trust proxy", 1);
}
function addRoutes(attach, router) {
    app.use(attach, router);
    app.use(config_1.SERVER_SETTINGS.getServerRoot() + attach, router);
}
function addGuardedRoutes(attach, guard, router) {
    var guardHandler = makeGuard(guard);
    app.use(attach, guardHandler, router);
    app.use(config_1.SERVER_SETTINGS.getServerRoot() + attach, guardHandler, router);
}
app.use(compress());
app.use(logger_tracker_1.logAndTrack(config_1.SERVER_SETTINGS.getRequestLogFormat()));
if (config_1.SERVER_SETTINGS.getStrictTransportSecurity() === "always") {
    app.use(helmet_1.hsts({
        maxAge: 10886400000,
        includeSubdomains: true,
        preload: true
    }));
}
if (app.get("env") === "dev-hmr") {
    var webpack = require("webpack");
    var webpackConfig = require("../../config/webpack.dev");
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpackHotMiddleware = require("webpack-hot-middleware");
    if (webpack && webpackDevMiddleware && webpackHotMiddleware) {
        var webpackCompiler = webpack(webpackConfig);
        app.use(webpackDevMiddleware(webpackCompiler, {
            hot: true,
            noInfo: true,
            publicPath: webpackConfig.output.publicPath
        }));
        app.use(webpackHotMiddleware(webpackCompiler, {
            log: console.log,
            path: "/__webpack_hmr"
        }));
    }
}
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        logger_tracker_1.LOGGER.error("Server Error: " + err.message);
        logger_tracker_1.LOGGER.error(err.stack);
        res.status(err.status || 500);
        res.send(views_1.errorLayout({ version: config_1.VERSION, title: "Error" }, err.message, err));
    });
}
addRoutes("/", express.static(path.join(__dirname, "../../build/public")));
addRoutes("/", express.static(path.join(__dirname, "../../assets")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var stateful = config_1.SETTINGS_MANAGER.isStateful();
app.use(function (req, res, next) {
    req.user = null;
    req.version = config_1.VERSION;
    req.stateful = stateful;
    req.getSettings = function (opts) {
        if (opts === void 0) { opts = {}; }
        return config_1.SETTINGS_MANAGER.getSettings(opts);
    };
    next();
});
app.use(function (req, res, next) {
    var version = req.body.version;
    if (version && version !== req.version) {
        res.status(412).send({
            error: "incorrect version",
            action: "reload"
        });
        return;
    }
    next();
});
if (config_1.AUTH) {
    app.use(config_1.AUTH);
}
else {
    app.use(function (req, res, next) {
        if (req.stateful) {
            req.user = {
                id: "admin",
                email: "admin@admin.com",
                displayName: "Admin",
                allow: {
                    settings: true
                }
            };
        }
        next();
    });
}
addRoutes(config_1.SERVER_SETTINGS.getHealthEndpoint(), healthRoutes);
addRoutes("/plywood", plywoodRoutes);
addRoutes("/plyql", plyqlRoutes);
addRoutes("/mkurl", mkurlRoutes);
addRoutes("/error", errorRoutes);
if (stateful) {
    addRoutes("/collections", collectionsRoutes);
    addGuardedRoutes("/settings", "settings", settingsRoutes);
}
if (config_1.SERVER_SETTINGS.externalSystem) {
    addRoutes(config_1.SERVER_SETTINGS.getExternalSystemEndpoint(), externalSystemRoutes);
}
if (config_1.SERVER_SETTINGS.getIframe() === "deny") {
    app.use(function (req, res, next) {
        res.setHeader("X-Frame-Options", "DENY");
        res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
        next();
    });
}
addRoutes("/", swivRoutes);
app.use(function (req, res, next) {
    res.redirect("/");
});
app.use(function (err, req, res, next) {
    logger_tracker_1.LOGGER.error("Server Error: " + err.message);
    logger_tracker_1.LOGGER.error(err.stack);
    res.status(err.status || 500);
    res.send(views_1.errorLayout({ version: config_1.VERSION, title: "Error" }, err.message));
});
module.exports = app;
//# sourceMappingURL=app.js.map