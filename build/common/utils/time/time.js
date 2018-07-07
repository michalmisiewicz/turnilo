"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chronoshift_1 = require("chronoshift");
var moment = require("moment-timezone");
var FORMAT_ISO_WITHOUT_TIMEZONE = "YYYY-MM-DD[T]HH:mm:ss";
var FORMAT_DATE = "YYYY-MM-DD";
var FORMAT_TIME = "HH:mm";
var FORMAT_WITH_YEAR = "MMM D, YYYY";
var FORMAT_WITHOUT_YEAR = "MMM D";
var FORMAT_TIME_OF_DAY_WITHOUT_MINUTES = "Ha";
var FORMAT_TIME_OF_DAY_WITH_MINUTES = "H:mma";
var FORMAT_FULL_MONTH_WITH_YEAR = "MMMM YYYY";
function formatTimeOfDay(d) {
    return d.minute() ? d.format(FORMAT_TIME_OF_DAY_WITH_MINUTES) : d.format(FORMAT_TIME_OF_DAY_WITHOUT_MINUTES);
}
function isCurrentYear(year, timezone) {
    var nowWallTime = moment.tz(new Date(), timezone.toString());
    return nowWallTime.year() === year;
}
var DisplayYear;
(function (DisplayYear) {
    DisplayYear[DisplayYear["ALWAYS"] = 0] = "ALWAYS";
    DisplayYear[DisplayYear["NEVER"] = 1] = "NEVER";
    DisplayYear[DisplayYear["IF_DIFF"] = 2] = "IF_DIFF";
})(DisplayYear = exports.DisplayYear || (exports.DisplayYear = {}));
function getEndWallTimeInclusive(exclusiveEnd, timezone) {
    return moment.tz(exclusiveToInclusiveEnd(exclusiveEnd), timezone.toString());
}
exports.getEndWallTimeInclusive = getEndWallTimeInclusive;
function exclusiveToInclusiveEnd(exclusiveEnd) {
    return new Date(exclusiveEnd.valueOf() - 1);
}
exports.exclusiveToInclusiveEnd = exclusiveToInclusiveEnd;
function formatTimeRange(timeRange, timezone, displayYear) {
    var start = timeRange.start, end = timeRange.end;
    var startWallTime = moment.tz(start, timezone.toString());
    var endWallTime = moment.tz(end, timezone.toString());
    var endWallTimeInclusive = getEndWallTimeInclusive(end, timezone);
    var showingYear = true;
    var formatted;
    if (startWallTime.year() !== endWallTimeInclusive.year()) {
        formatted = [startWallTime.format(FORMAT_WITH_YEAR), endWallTimeInclusive.format(FORMAT_WITH_YEAR)].join(" - ");
    }
    else {
        showingYear = displayYear === DisplayYear.ALWAYS ||
            (displayYear === DisplayYear.IF_DIFF && !isCurrentYear(endWallTimeInclusive.year(), timezone));
        var fmt = showingYear ? FORMAT_WITH_YEAR : FORMAT_WITHOUT_YEAR;
        if (startWallTime.month() !== endWallTimeInclusive.month() || startWallTime.date() !== endWallTimeInclusive.date()) {
            formatted = [startWallTime.format(FORMAT_WITHOUT_YEAR), endWallTimeInclusive.format(fmt)].join(" - ");
        }
        else {
            formatted = startWallTime.format(fmt);
        }
    }
    if (startWallTime.hour() || startWallTime.minute() || endWallTime.hour() || endWallTime.minute()) {
        formatted += (showingYear ? " " : ", ");
        var startTimeStr = formatTimeOfDay(startWallTime).toLowerCase();
        var endTimeStr = formatTimeOfDay(endWallTime).toLowerCase();
        if (startTimeStr === endTimeStr) {
            formatted += startTimeStr;
        }
        else {
            if (startTimeStr.substr(-2) === endTimeStr.substr(-2)) {
                startTimeStr = startTimeStr.substr(0, startTimeStr.length - 2);
            }
            formatted += [startTimeStr, endTimeStr].join("-");
        }
    }
    return formatted;
}
exports.formatTimeRange = formatTimeRange;
function monthToWeeks(firstDayOfMonth, timezone, locale) {
    var weeks = [];
    var firstDayNextMonth = chronoshift_1.month.shift(firstDayOfMonth, timezone, 1);
    var week = [];
    var currentPointer = chronoshift_1.day.floor(firstDayOfMonth, timezone);
    while (currentPointer < firstDayNextMonth) {
        var wallTime = moment.tz(currentPointer, timezone.toString());
        if ((wallTime.day() === locale.weekStart || 0) && week.length > 0) {
            weeks.push(week);
            week = [];
        }
        week.push(currentPointer);
        currentPointer = chronoshift_1.day.shift(currentPointer, timezone, 1);
    }
    if (week.length > 0)
        weeks.push(week);
    return weeks;
}
exports.monthToWeeks = monthToWeeks;
function prependDays(timezone, weekPrependTo, countPrepend) {
    for (var i = 0; i < countPrepend; i++) {
        var firstDate = weekPrependTo[0];
        var shiftedDate = chronoshift_1.day.shift(firstDate, timezone, -1);
        weekPrependTo.unshift(shiftedDate);
    }
    return weekPrependTo;
}
exports.prependDays = prependDays;
function appendDays(timezone, weekAppendTo, countAppend) {
    for (var i = 0; i < countAppend; i++) {
        var lastDate = weekAppendTo[weekAppendTo.length - 1];
        var shiftedDate = chronoshift_1.day.shift(lastDate, timezone, 1);
        weekAppendTo.push(shiftedDate);
    }
    return weekAppendTo;
}
exports.appendDays = appendDays;
function shiftOneDay(floored, timezone) {
    return chronoshift_1.day.shift(floored, timezone, 1);
}
exports.shiftOneDay = shiftOneDay;
function datesEqual(d1, d2) {
    if (!Boolean(d1) === Boolean(d2))
        return false;
    if (d1 === d2)
        return true;
    return d1.valueOf() === d2.valueOf();
}
exports.datesEqual = datesEqual;
function getWallTimeDay(date, timezone) {
    return moment.tz(date, timezone.toString()).date();
}
exports.getWallTimeDay = getWallTimeDay;
function getWallTimeMonthWithYear(date, timezone) {
    return moment.tz(date, timezone.toString()).format(FORMAT_FULL_MONTH_WITH_YEAR);
}
exports.getWallTimeMonthWithYear = getWallTimeMonthWithYear;
function wallTimeInclusiveEndEqual(d1, d2, timezone) {
    if (!Boolean(d1) === Boolean(d2))
        return false;
    if (d1 === d2)
        return true;
    var d1InclusiveEnd = getEndWallTimeInclusive(d1, timezone);
    var d2InclusiveEnd = getEndWallTimeInclusive(d2, timezone);
    return datesEqual(d1InclusiveEnd.toDate(), d2InclusiveEnd.toDate());
}
exports.wallTimeInclusiveEndEqual = wallTimeInclusiveEndEqual;
function getWallTimeString(date, timezone) {
    var wallTimeISOString = moment.tz(date, timezone.toString()).format(FORMAT_ISO_WITHOUT_TIMEZONE);
    return wallTimeISOString.replace("T", ", ");
}
exports.getWallTimeString = getWallTimeString;
function getWallTimeDateOnlyString(date, timezone) {
    return moment.tz(date, timezone.toString()).format(FORMAT_DATE);
}
exports.getWallTimeDateOnlyString = getWallTimeDateOnlyString;
function getWallTimeTimeOnlyString(date, timezone) {
    return moment.tz(date, timezone.toString()).format(FORMAT_TIME);
}
exports.getWallTimeTimeOnlyString = getWallTimeTimeOnlyString;
function pad(input) {
    if (input < 10)
        return "0" + input;
    return String(input);
}
function formatTimeBasedOnGranularity(range, granularity, timezone, locale) {
    var wallTimeStart = moment.tz(range.start, timezone.toString());
    var year = wallTimeStart.year();
    var month = wallTimeStart.month();
    var day = wallTimeStart.date();
    var hour = wallTimeStart.hour();
    var minute = wallTimeStart.minute();
    var second = wallTimeStart.second();
    var monthString = locale.shortMonths[month];
    var hourToTwelve = hour % 12 === 0 ? 12 : hour % 12;
    var amPm = (hour / 12) >= 1 ? "pm" : "am";
    var granularityString = granularity.toJS();
    var unit = granularityString.substring(granularityString.length - 1);
    switch (unit) {
        case "S":
            return monthString + " " + day + ", " + pad(hour) + ":" + pad(minute) + ":" + pad(second);
        case "M":
            var prefix = granularityString.substring(0, 2);
            return prefix === "PT" ? monthString + " " + day + ", " + hourToTwelve + ":" + pad(minute) + amPm : monthString + ", " + year;
        case "H":
            return monthString + " " + day + ", " + year + ", " + hourToTwelve + amPm;
        case "D":
            return monthString + " " + day + ", " + year;
        case "W":
            return "" + formatTimeRange(range, timezone, DisplayYear.ALWAYS);
        default:
            return wallTimeStart.format(FORMAT_ISO_WITHOUT_TIMEZONE);
    }
}
exports.formatTimeBasedOnGranularity = formatTimeBasedOnGranularity;
function formatGranularity(granularity) {
    return granularity.replace(/^PT?/, "");
}
exports.formatGranularity = formatGranularity;
function maybeFullyDefinedDate(date) {
    return date.length === FORMAT_DATE.length;
}
exports.maybeFullyDefinedDate = maybeFullyDefinedDate;
function maybeFullyDefinedTime(time) {
    return time.length === FORMAT_TIME.length;
}
exports.maybeFullyDefinedTime = maybeFullyDefinedTime;
function combineDateAndTimeIntoMoment(date, time, timezone) {
    var fullDateTimeString = date + "T" + time;
    return moment.tz(fullDateTimeString, timezone.toString());
}
exports.combineDateAndTimeIntoMoment = combineDateAndTimeIntoMoment;
//# sourceMappingURL=time.js.map