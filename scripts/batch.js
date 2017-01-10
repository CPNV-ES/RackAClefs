"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cluster = require("cluster");
var log_1 = require('./log');
var BatchSession = (function (_super) {
    __extends(BatchSession, _super);
    function BatchSession() {
        _super.apply(this, arguments);
        this.dateExecution = "" + new Date().getDate() + new Date().getMonth() + new Date().getFullYear() + "_" + new Date().getUTCSeconds();
        this.bsID = -1;
        this.returningCode = -1;
        this.datas = [];
    }
    BatchSession.prototype.execute = function (elements) {
        this.log("starting " + elements.length + " elements to process");
        this.currentData = elements.length;
        this.datas = elements;
        var data = this.datas.shift();
        if (data == null)
            this.finishOneData(-1);
        else
            this.doElement(data);
        return -1;
    };
    BatchSession.prototype.finishOneData = function (returningCode) {
        if (this.returningCode < returningCode) {
            this.returningCode = returningCode;
            this.log("end", returningCode);
            this.emit('end', returningCode);
            return;
        }
        if (this.datas.length == 0) {
            this.log("end");
            this.emit('end', returningCode);
        }
        else {
            this.doElement(this.datas.shift());
        }
    };
    BatchSession.prototype.getId = function () {
        if (cluster.isWorker) {
            return "W#" + cluster.worker.id;
        }
        if (BatchSession.BSCount[this.getClassName()] == null)
            BatchSession.BSCount[this.getClassName()] = 0;
        if (this.bsID <= 0) {
            BatchSession.BSCount[this.getClassName()] = BatchSession.BSCount[this.getClassName()] + 1;
            this.bsID = BatchSession.BSCount[this.getClassName()];
        }
        return this.bsID;
    };
    BatchSession.prototype.getLogFileName = function () {
        return this.getClassName() + "_" + this.getId();
    };
    BatchSession.prototype.getLogTitle = function () {
        return this.getClassName() + " " + this.getId() + " : " + new Date().toString() + " : ";
    };
    BatchSession.BSCount = {};
    return BatchSession;
}(log_1.Logger));
exports.BatchSession = BatchSession;
var BatchActivity = (function (_super) {
    __extends(BatchActivity, _super);
    function BatchActivity() {
        _super.apply(this, arguments);
        this.returningCode = -1;
        this.numberBS = -1;
        this.packSize = -1;
    }
    BatchActivity.prototype.execute = function (params) {
        var _this = this;
        this.log("Start");
        this.selectData(function (datas) {
            _this.log(datas.length + " for split");
            var datasForBS = _this.splitData(datas);
            var BSs = [];
            _this.currentBS = datasForBS.length;
            var that = _this;
            if (datasForBS.length == 0) {
                _this.finishBA();
                return;
            }
            if (_this.numberBS == -1)
                _this.numberBS = datasForBS.length;
            for (var bsNumber = 0; bsNumber < Math.min(_this.numberBS, datasForBS.length); bsNumber++) {
                var bsDatas = datasForBS.shift();
                if (bsDatas == null || bsDatas.length == 0)
                    continue;
                var bs = _this.createBatchSession();
                bs.dirChaine = _this.dirChaine;
                bs.on('end', function (returningCode) {
                    if (that.returningCode < returningCode) {
                        that.returningCode = returningCode;
                        this.log(this.bsID + " => " + returningCode);
                    }
                    if (datasForBS.length == 0) {
                        that.currentBS -= 1;
                        if (that.currentBS <= 0) {
                            that.finishBA();
                        }
                    }
                    else {
                        try {
                            var newbsDatas = datasForBS.shift();
                            if (newbsDatas == null || newbsDatas.length == 0) {
                                that.currentBS -= 1;
                                if (that.currentBS <= 0) {
                                    that.finishBA();
                                }
                            }
                            else {
                                this.execute(newbsDatas);
                            }
                        }
                        catch (e) {
                            this.log(e);
                        }
                    }
                });
                try {
                    bs.execute(bsDatas);
                }
                catch (e) {
                    bs.log(e);
                }
                BSs.push(bs);
            }
        }, params);
    };
    BatchActivity.prototype.OnEnd = function () { };
    BatchActivity.prototype.finishBA = function () {
        this.OnEnd();
        this.log("End -> returningCode : ", this.returningCode);
        this.emit('end', this.returningCode);
    };
    BatchActivity.prototype.setDirChaine = function (dir) {
        this.dirChaine = dir;
    };
    return BatchActivity;
}(log_1.Logger));
exports.BatchActivity = BatchActivity;
