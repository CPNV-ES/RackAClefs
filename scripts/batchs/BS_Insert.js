"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var batch_1 = require('../batch');
var usb_1 = require("../models/usb");
var regex = /CPNV-([A-Z0-9])\w+/g;
var BS_Insert = (function (_super) {
    __extends(BS_Insert, _super);
    function BS_Insert() {
        _super.apply(this, arguments);
    }
    BS_Insert.prototype.doElement = function (element) {
        var _this = this;
        usb_1.UsbModel.findUsb(element.uuid).then(function (res1) {
            if (res1 == null) {
                usb_1.UsbModel.createUsb(element.name, true, false, element.uuid, regex.test(element.name)).then(function (res2) {
                    _this.log('Create');
                    _this.finishOneData(-1);
                });
            }
            else {
                _this.log('Exist');
                _this.finishOneData(-1);
            }
        });
    };
    return BS_Insert;
}(batch_1.BatchSession));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BS_Insert;
