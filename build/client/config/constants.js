"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TITLE_HEIGHT = 36;
exports.DIMENSION_HEIGHT = 27;
exports.MEASURE_HEIGHT = 27;
exports.CORE_ITEM_WIDTH = 192;
exports.CORE_ITEM_GAP = 8;
exports.BAR_TITLE_WIDTH = 66;
exports.PIN_TITLE_HEIGHT = 36;
exports.PIN_ITEM_HEIGHT = 25;
exports.PIN_PADDING_BOTTOM = 12;
exports.VIS_H_PADDING = 10;
exports.VIS_SELECTOR_WIDTH = 79;
exports.OVERFLOW_WIDTH = 40;
exports.SPLIT = "SPLIT";
exports.MAX_SEARCH_LENGTH = 300;
exports.SEARCH_WAIT = 900;
exports.STRINGS = {
    add: "Add",
    addFromCube: "Add from Cube",
    addNewCollection: "Add new collection",
    addNewTile: "Add new tile",
    addToCollection: "Add to collection",
    addVisualization: "Add tile",
    any: "any",
    autoFillDimensionsAndMeasures: "Auto-fill dimensions and measures",
    autoUpdate: "Auto update",
    cancel: "Cancel",
    close: "Close",
    collections: "Collections",
    configureCluster: "configure cluster",
    configureDataCube: "configure dataCube",
    connectNewCluster: "Connect new cluster",
    contains: "Contains",
    convertToFixedTime: "Convert to fixed time",
    copyDefinition: "Copy definition",
    copyFixedTimeUrl: "Copy URL - fixed time",
    copyRelativeTimeUrl: "Copy URL - relative time",
    copyUrl: "Copy URL",
    copyValue: "Copy value",
    createDataCube: "Create new cube",
    createCluster: "Create new cluster",
    createCubesFromCluster: "Create cubes from cluster",
    current: "Current",
    create: "Create",
    cubes: "cubes",
    dataCubes: "Data Cubes",
    delete: "Delete",
    deleteCollection: "Delete this collection",
    deleteCollectionTile: "Delete this tile",
    dimensions: "Dimensions",
    dimension: "Dimension",
    download: "Download",
    dragToReorder: "Drag tiles to reorder",
    duplicateCollectionTile: "Duplicate this tile",
    edit: "Edit",
    editCollection: "Edit collection",
    editDataCube: "Edit cube",
    editCluster: "Edit cluster",
    editThisCube: "Edit this cube",
    editTitleAndDesc: "Edit title and description",
    editVisualization: "Edit visualization",
    end: "End",
    exclude: "Exclude",
    explore: "Explore",
    exportToCSV: "Export to CSV",
    exportToExternalSystem: "Export to external system",
    exportToTSV: "Export to TSV",
    filter: "Filter",
    generalSettings: "General settings",
    goToUrl: "Go to URL",
    granularity: "Granularity",
    home: "Turnilo",
    include: "Include",
    infoAndFeedback: "Info & Feedback",
    intersection: "Intersection",
    last5Minutes: "Last 5 minutes",
    lastDay: "Last Day",
    lastHour: "Last Hour",
    lastWeek: "Last Week",
    latest: "Latest",
    limit: "Limit",
    logout: "Logout",
    measures: "Measures",
    measure: "Measure",
    mkurlDomainPlaceholder: "CHANGE ME",
    next: "Next",
    no: "No",
    noIllCreateThem: "No, I'll create them myself",
    noClusters: "No clusters",
    noDescription: "No description",
    noFilter: "No filter",
    noQueryableDataCubes: "There are no queryable data cubes configured",
    noTilesInThisCollection: "There are no tiles in this collection",
    ok: "OK",
    openIn: "Open in",
    pin: "Pin",
    pinboard: "Pinboard",
    pinboardPlaceholder: "Click or drag dimensions to pin them",
    previous: "Previous",
    quarter: "Quarter",
    queryError: "Query error",
    rawData: "Raw Data",
    regex: "Regex",
    relative: "Relative",
    save: "Save",
    select: "Select",
    settings: "Settings",
    sortBy: "Sort by",
    fixed: "Fixed",
    split: "Split",
    splitDelimiter: "by",
    start: "Start",
    stringSearch: "String search",
    subsplit: "Split",
    suggestion: "suggestion",
    timezone: "Timezone",
    undo: "Click here to undo",
    updateTimezone: "Update Timezone",
    displayRawData: "Display raw data",
    displayViewDefinition: "Display view definition",
    viewDefinition: "View definition",
    viewDefinitionSubtitle: "View definition for mkurl",
    yes: "Yes"
};
exports.DATA_CUBES_STRATEGIES_LABELS = {
    "none": "None",
    "no-autofill": "No autofill",
    "autofill-dimensions-only": "Autofill dimensions only",
    "autofill-measures-only": "Autofill measures only",
    "autofill-all": "Autofill all"
};
var EN_US = {
    shortDays: ["S", "M", "T", "W", "T", "F", "S"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
    weekStart: 0
};
function getLocale() {
    return EN_US;
}
exports.getLocale = getLocale;
exports.exportOptions = [
    { label: exports.STRINGS.exportToCSV, fileFormat: "csv" },
    { label: exports.STRINGS.exportToTSV, fileFormat: "tsv" }
];
//# sourceMappingURL=constants.js.map