"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var fs = require('fs');
var log_1 = require('./log');
var BatchManager = (function (_super) {
    __extends(BatchManager, _super);
    function BatchManager(batchConfigPath) {
        _super.call(this);
        this.batchs = [];
        this.batchConfigPath = batchConfigPath;
        this.initLogDir();
    }
    BatchManager.prototype.initLogDir = function () {
        if (!fs.existsSync('./logs/')) {
            fs.mkdirSync('./logs');
        }
    };
    BatchManager.prototype.run = function (bas) {
        try {
            if (!fs.existsSync(this.batchConfigPath))
                throw new Error("Batch configuration file " + this.batchConfigPath + " doesn't exists");
            var fileContentRaw = fs.readFileSync(this.batchConfigPath);
            try {
                this.batchs = JSON.parse(fileContentRaw.toString());
            }
            catch (e) {
                throw new Error("Error when parsing batch configuration file : " + e.message);
            }
            if (bas != null) {
                var newBatchs = [];
                for (var _i = 0, _a = Object.keys(bas); _i < _a.length; _i++) {
                    var batchName = _a[_i];
                    var batch = { params: bas[batchName] };
                    var findBatch = this.batchs.filter(function (val, i, a) { return val.name == batchName; });
                    if (findBatch.length == 0)
                        continue;
                    var firstBatch = findBatch[0];
                    for (var _b = 0, _c = Object.keys(firstBatch); _b < _c.length; _b++) {
                        var key = _c[_b];
                        if (key == 'params')
                            continue;
                        batch[key] = firstBatch[key];
                    }
                    if (firstBatch.params != null) {
                        for (var _d = 0, _e = Object.keys(firstBatch.params); _d < _e.length; _d++) {
                            var key = _e[_d];
                            if (batch.params[key] != null)
                                continue;
                            batch.params[key] = firstBatch.params[key];
                        }
                    }
                    newBatchs.push(batch);
                }
                this.batchs = newBatchs;
            }
            this.log('Execute : ', this.batchs);
            this.nextBatch();
        }
        catch (e) {
            this.log(e);
        }
    };
    BatchManager.prototype.nextBatch = function () {
        if (this.batchs.length == 0) {
            process.exit();
        }
        var batchData = this.batchs[0];
        this.batchs.shift();
        this.executeBA(batchData);
    };
    BatchManager.prototype.executeBA = function (batchData) {
        var that = this;
        var baClass = require('./batchs/' + batchData.name).default;
        var ba = new baClass();
        ba.setDirChaine(this.dirChaine);
        var params = batchData.params;
        if (batchData.numberBS != null) {
            ba.numberBS = batchData.numberBS;
        }
        if (batchData.packSize != null) {
            ba.packSize = batchData.packSize;
        }
        ba.on('end', function (returningCode) {
            that.log(batchData.name, ' return code ', returningCode);
            if (returningCode < 10) {
                that.nextBatch();
            }
            else {
                process.exit(returningCode);
            }
        });
        try {
            ba.execute(params);
        }
        catch (e) {
            ba.log(e);
        }
    };
    BatchManager.prototype.getLogFileName = function () {
        var date = "" + new Date().getDate() + new Date().getMonth() + new Date().getFullYear();
        this.logPath = "0_" + this.getClassName() + "_" + date;
        return this.logPath;
    };
    return BatchManager;
}(log_1.Logger));
exports.BatchManager = BatchManager;
