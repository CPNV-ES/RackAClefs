"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var batch_1 = require('../batch');
var usb_1 = require("../models/usb");
var BS_Check = (function (_super) {
    __extends(BS_Check, _super);
    function BS_Check() {
        _super.apply(this, arguments);
    }
    BS_Check.prototype.doElement = function (element) {
        var _this = this;
        var repo = new usb_1.UsbRepository();
        repo.findOne({ uuid: element.uuid }, function (err, usb) {
            if (usb.name.indexOf('CPNV-USB') < 0) {
                usb.status = 2;
            }
            else {
                usb.status = 1;
            }
            _this.log(usb);
            repo.update(usb.id, usb, function (err, usb) {
                if (err) {
                    _this.finishOneData(0);
                }
                else {
                    _this.finishOneData(-1);
                }
            });
        });
    };
    return BS_Check;
}(batch_1.BatchSession));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BS_Check;
