"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var cluster = require('cluster');
var batch_1 = require('./batch');
var BatchActivityCursorCluster = (function (_super) {
    __extends(BatchActivityCursorCluster, _super);
    function BatchActivityCursorCluster() {
        _super.apply(this, arguments);
        this.offset = 0;
        this.numberBS = 20;
        this.packSize = 20;
        this.currentWorker = -1;
        this.startingTime = 0;
    }
    BatchActivityCursorCluster.prototype.selectData = function (callback, params) { };
    BatchActivityCursorCluster.prototype.splitData = function (datas) { return null; };
    BatchActivityCursorCluster.prototype.execute = function (params) {
        var _this = this;
        this.log("Start cursor cluster");
        var that = this;
        if (this.packSize <= 0)
            this.packSize = 1;
        this.getCountData(function (count) {
            _this.log("total of elements : " + count);
            if (count == null || count <= 0) {
                _this.finishBA();
                return;
            }
            var startingTime = new Date().getTime();
            var nbBS = Math.min(Math.ceil(count / _this.packSize), _this.numberBS);
            _this.currentWorker = nbBS;
            that.startingTime = new Date().getTime();
            require('./cluster')(_this, count, nbBS, _this.packSize, params);
        }, params);
    };
    BatchActivityCursorCluster.prototype.startBS = function (startIndex, limit, params) {
        var _this = this;
        var that = this;
        if (cluster.isMaster) {
            cluster.on('message', function (messageData) {
                console.log('message from worker', messageData);
                if (messageData.action = 'finishBS') {
                    that.finishBS(messageData.returningCode);
                }
            });
        }
        this.currentBS++;
        var bs = this.createBatchSession();
        bs.dirChaine = this.dirChaine;
        that.startingTime = new Date().getTime();
        var offset = startIndex;
        var returningCode = 0;
        var next = function () {
            if (offset >= limit) {
                _this.finishBS(returningCode);
                return;
            }
            if (that.packSize <= 0)
                that.packSize = 1;
            var startGet = offset;
            offset += that.packSize;
            that.getData(startGet, that.packSize, function (data) {
                if (data == null) {
                    that.getData(startGet, that.packSize, function (dataRetry) {
                        if (dataRetry == null) {
                            next();
                        }
                        else {
                            bs.execute(dataRetry);
                        }
                    }, params);
                }
                else {
                    bs.execute(data);
                }
            }, params);
        };
        bs.on('end', function (rCode) {
            returningCode = rCode;
            next();
        });
        next();
    };
    BatchActivityCursorCluster.prototype.finishBS = function (returningCode) {
        this.log("Finish " + (cluster.isMaster ? 'master' : cluster.worker.id));
        if (cluster.isWorker) {
            process.send({ action: 'finishBS', returningCode: returningCode });
            return;
        }
        this.currentWorker -= 1;
        if (returningCode > this.returningCode)
            this.returningCode = returningCode;
        if (this.currentWorker <= 0) {
            cluster.removeAllListeners('message');
            this.log('All BS cluster are finished ?');
            this.emit('end', this.returningCode);
        }
    };
    return BatchActivityCursorCluster;
}(batch_1.BatchActivity));
exports.BatchActivityCursorCluster = BatchActivityCursorCluster;
