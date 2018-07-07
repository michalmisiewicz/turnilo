"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function favicon(options) {
    var version = options.version, title = options.title;
    return "\n<link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"/favicon/apple-touch-icon.png?v=" + version + "\">\n<link rel=\"icon\" type=\"image/png\" sizes=\"32x32\" href=\"/favicon/favicon-32x32.png?v=" + version + "\">\n<link rel=\"icon\" type=\"image/png\" sizes=\"16x16\" href=\"/favicon/favicon-16x16.png?v=" + version + "\">\n<link rel=\"manifest\" href=\"/favicon/site.webmanifest?v=" + version + "\">\n<link rel=\"mask-icon\" href=\"/favicon/safari-pinned-tab.svg?v=4\" color=\"#ff5a00\">\n<link rel=\"shortcut icon\" href=\"/favicon/favicon.ico?v=" + version + "\">\n<meta name=\"apple-mobile-web-app-title\" content=\"" + title + "\">\n<meta name=\"application-name\" content=\"" + title + "\">\n<meta name=\"msapplication-TileColor\" content=\"#da532c\">\n<meta name=\"msapplication-config\" content=\"/favicon/browserconfig.xml?v=" + version + "\">\n<meta name=\"theme-color\" content=\"#ffffff\">\n";
}
function layout(options, content) {
    return "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"description\" content=\"Data Explorer\">\n  <meta name=\"author\" content=\"Imply\">\n  <meta name=\"google\" value=\"notranslate\">\n  " + favicon(options) + "\n  <meta name=\"viewport\" content=\"width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1\">\n  <title>" + options.title + "</title>\n</head>\n<body>\n" + content + "\n</body>\n</html>\n";
}
exports.layout = layout;
function mainLayout(options) {
    var version = options.version, user = options.user, appSettings = options.appSettings, timekeeper = options.timekeeper, stateful = options.stateful;
    return layout(options, "<div class=\"app-container\"></div>\n<script>var __CONFIG__ = " + JSON.stringify({ version: version, user: user, appSettings: appSettings, timekeeper: timekeeper, stateful: stateful }) + ";</script>\n<script charset=\"UTF-8\" src=\"main.js?v=" + version + "\"></script>");
}
exports.mainLayout = mainLayout;
function errorLayout(options, message, error) {
    if (error === void 0) { error = {}; }
    return layout(options, "<h1>{{message}}</h1>\n<h2>{{error.status}}</h2>\n<pre>{{error.stack}}</pre>");
}
exports.errorLayout = errorLayout;
//# sourceMappingURL=views.js.map