"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var batch_1 = require('../batch');
var BS_ClearStatus_1 = require('./BS_ClearStatus');
var usb_1 = require("../models/usb");
var BA_ClearStatus = (function (_super) {
    __extends(BA_ClearStatus, _super);
    function BA_ClearStatus() {
        _super.apply(this, arguments);
    }
    BA_ClearStatus.prototype.selectData = function (callback) {
        var repo = new usb_1.UsbRepository();
        repo.retrieve(function (err, res) {
            callback(res);
        });
    };
    BA_ClearStatus.prototype.splitData = function (datas) {
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
    BA_ClearStatus.prototype.createBatchSession = function () {
        return new BS_ClearStatus_1.default();
    };
    return BA_ClearStatus;
}(batch_1.BatchActivity));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BA_ClearStatus;
