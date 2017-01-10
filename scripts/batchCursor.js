"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var batch_1 = require('./batch');
var BatchActivityCursor = (function (_super) {
    __extends(BatchActivityCursor, _super);
    function BatchActivityCursor() {
        _super.apply(this, arguments);
        this.offset = 0;
        this.numberBS = 20;
        this.packSize = 20;
    }
    BatchActivityCursor.prototype.selectData = function (callback, params) { };
    BatchActivityCursor.prototype.splitData = function (datas) { return null; };
    BatchActivityCursor.prototype.execute = function (params) {
        var _this = this;
        this.log("Start cursor");
        var that = this;
        this.getCountData(function (count) {
            _this.log("total of elements : " + count);
            if (count == 0) {
                _this.finishBA();
                return;
            }
            var startingTime = new Date().getTime();
            var nbBS = Math.min(Math.ceil(count / _this.packSize), _this.numberBS);
            _this.currentBS = nbBS;
            for (var bsNumber = 0; bsNumber < nbBS; bsNumber++) {
                var bs = _this.createBatchSession();
                bs.dirChaine = _this.dirChaine;
                var starting = that.offset;
                that.offset += that.packSize;
                that.getData(starting, that.packSize, function (datas) {
                    bs.execute(datas);
                }, params);
                bs.on('end', function (returningCode) {
                    if (that.returningCode < returningCode) {
                        that.returningCode = returningCode;
                        this.log(this.bsID + " => " + returningCode);
                    }
                    var now = new Date().getTime();
                    var diff = (now - startingTime);
                    var leftSec = (count - that.offset) * (that.offset / (diff / 1000));
                    that.log("Time left : " + Math.round(leftSec) + " sec - ETA : " + new Date(now + leftSec * 1000));
                    that.log(" " + diff / that.offset + " elem/s ");
                    if (that.offset >= count) {
                        that.currentBS--;
                        if (that.currentBS == 0)
                            that.finishBA();
                    }
                    else {
                        try {
                            var newOffset = that.offset;
                            that.offset += that.packSize;
                            that.getData(newOffset, that.packSize, function (datas) {
                                bs.execute(datas);
                            }, params);
                        }
                        catch (error) {
                            this.log(error);
                        }
                    }
                });
            }
        }, params);
    };
    return BatchActivityCursor;
}(batch_1.BatchActivity));
exports.BatchActivityCursor = BatchActivityCursor;
