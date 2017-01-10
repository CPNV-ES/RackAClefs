"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var batch_1 = require('../batch');
var BS_Check_1 = require('./BS_Check');
var exec = require('child_process').exec;
var BA_Check = (function (_super) {
    __extends(BA_Check, _super);
    function BA_Check() {
        _super.apply(this, arguments);
    }
    BA_Check.prototype.selectData = function (callback) {
        exec('blkid | grep -v Antergos', function (error, stdout, stderr) {
            var datas = [];
            var objs = stdout.replace(/^\s+|\s+$/g, '').split("\n");
            if (objs[0] != "") {
                for (var _i = 0, objs_1 = objs; _i < objs_1.length; _i++) {
                    var obj = objs_1[_i];
                    var o = obj.split(" ");
                    var name = o[1].split("=")[1].replace(/'|"/g, "");
                    var uuid = o[2].split("=")[1].replace(/'|"/g, "");
                    datas.push({ name: name, uuid: uuid });
                }
            }
            callback(datas);
        });
    };
    BA_Check.prototype.splitData = function (datas) {
        var packets = [];
        for (var i = 0; i < Math.floor(datas.length / this.packSize); i++) {
            var packet = [];
            for (var j = i * this.packSize; j < ((i + 1) * this.packSize); j++) {
                packet.push(datas[j]);
            }
            packets.push(packet);
        }
        var packetFinal = [];
        for (var j = Math.floor(datas.length / this.packSize) * this.packSize; j < datas.length; j++) {
            packetFinal.push(datas[j]);
        }
        if (packetFinal.length > 0)
            packets.push(packetFinal);
        this.log(packets.length + " packets");
        return packets;
    };
    BA_Check.prototype.createBatchSession = function () {
        return new BS_Check_1.default();
    };
    return BA_Check;
}(batch_1.BatchActivity));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BA_Check;
