"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var batch_1 = require('../batch');
var usb_1 = require("../models/usb");
var BS_ClearStatus = (function (_super) {
    __extends(BS_ClearStatus, _super);
    function BS_ClearStatus() {
        _super.apply(this, arguments);
    }
    BS_ClearStatus.prototype.doElement = function (element) {
        var _this = this;
        var repo = new usb_1.UsbRepository();
        var usb = element;
        usb.status = 0;
        repo.update(usb.id, usb, function (err, res) {
            if (err) {
                _this.finishOneData(0);
            }
            else {
                _this.finishOneData(-1);
            }
        });
    };
    return BS_ClearStatus;
}(batch_1.BatchSession));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BS_ClearStatus;
