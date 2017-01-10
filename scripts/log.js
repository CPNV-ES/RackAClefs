"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var path = require('path');
var events = require('events');
var Logger = (function (_super) {
    __extends(Logger, _super);
    function Logger() {
        _super.apply(this, arguments);
        this.dirChaine = '';
    }
    Logger.prototype.getClassName = function () {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec(this.constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    };
    Logger.prototype.getLogFileName = function () {
        return "" + this.getClassName();
    };
    Logger.prototype.getLogTitle = function () {
        return this.getClassName() + " : " + new Date().toString() + " : ";
    };
    Logger.prototype.getFileLogPath = function () {
        var date = new Date();
        var dateStr = date.getFullYear() + "_" + this.zeroPad((date.getMonth() + 1).toString(), 2) + "_" + this.zeroPad(date.getDate().toString(), 2);
        var dateYearMonth = date.getFullYear() + "_" + this.zeroPad((date.getMonth() + 1).toString(), 2);
        var directory = path.join(__dirname, 'logs', dateYearMonth, dateStr, this.dirChaine);
        if (!fs.existsSync(directory)) {
            var mkdirp = require('mkdirp');
            mkdirp.sync(directory);
        }
        return path.join(directory, this.getLogFileName() + ".log");
    };
    Logger.prototype.log = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i - 0] = arguments[_i];
        }
        if (this.fileOutput == null) {
            var fileLogPath = this.getFileLogPath();
            this.fileOutput = fs.createWriteStream(fileLogPath);
        }
        var fileConsole = new (require('console').Console)(this.fileOutput);
        fileConsole.log.apply(fileConsole, [this.getLogTitle()].concat(messages));
        console.log.apply(console, [this.getLogTitle()].concat(messages));
    };
    Logger.prototype.error = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i - 0] = arguments[_i];
        }
        if (this.fileOutput == null) {
            var fileLogPath = this.getFileLogPath();
            this.fileOutput = fs.createWriteStream(fileLogPath);
        }
        var fileConsole = new (require('console').Console)(this.fileOutput);
        messages.unshift("[ERROR]");
        fileConsole.error.apply(fileConsole, [this.getLogTitle()].concat(messages));
        console.error.apply(console, [this.getLogTitle()].concat(messages));
    };
    Logger.prototype.warm = function () {
        var messages = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            messages[_i - 0] = arguments[_i];
        }
        if (this.fileOutput == null) {
            var fileLogPath = this.getFileLogPath();
            this.fileOutput = fs.createWriteStream(fileLogPath);
        }
        var fileConsole = new (require('console').Console)(this.fileOutput);
        messages.unshift("[WARNING]");
        fileConsole.warn.apply(fileConsole, [this.getLogTitle()].concat(messages));
        console.warn.apply(console, [this.getLogTitle()].concat(messages));
    };
    Logger.prototype.zeroPad = function (str, places) {
        var zero = Math.max(places - str.length, 0);
        for (var i = 0; i < zero; i++) {
            str = "0" + str;
        }
        return str;
    };
    return Logger;
}(events.EventEmitter));
exports.Logger = Logger;
