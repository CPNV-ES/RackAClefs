"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _this = this;
var mongoose = require("mongoose");
exports.Schema = mongoose.Schema;
exports.ObjectId = mongoose.Schema.Types.ObjectId;
exports.Mixed = mongoose.Schema.Types.Mixed;
var schema = new exports.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    reserved: {
        type: Boolean,
        required: true
    },
    uuid: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        require: false
    },
    updated_at: {
        type: Date,
        required: false
    },
    initialized: {
        type: Boolean,
        required: true
    }
}).pre('save', function (next) {
    if (_this._doc) {
        var doc = _this._doc;
        var now = new Date();
        if (!doc.create_at) {
            doc.created_at = now;
        }
        doc.updated_at = now;
    }
    next();
    return _this;
});
exports.UsbSchema = mongoose.model('usb', schema, 'usbs', true);
var UsbModel = (function () {
    function UsbModel(usbModel) {
        this._usbModel = usbModel;
    }
    Object.defineProperty(UsbModel.prototype, "name", {
        get: function () {
            return this._usbModel.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UsbModel.prototype, "status", {
        get: function () {
            return this._usbModel.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UsbModel.prototype, "reserved", {
        get: function () {
            return this._usbModel.reserved;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UsbModel.prototype, "uuid", {
        get: function () {
            return this._usbModel.uuid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UsbModel.prototype, "initialized", {
        get: function () {
            return this._usbModel.initialized;
        },
        enumerable: true,
        configurable: true
    });
    UsbModel.createUsb = function (name, status, reserved, uuid, initialized) {
        var p = new Promise(function (resolve, reject) {
            var repo = new UsbRepository();
            var usb = {
                name: name,
                status: status,
                reserved: reserved,
                uuid: uuid,
                initialized: initialized
            };
            repo.create(usb, function (err, res) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
        return p;
    };
    UsbModel.findUsb = function (uuid) {
        var p = new Promise(function (resolve, reject) {
            var repo = new UsbRepository();
            repo.find({ uuid: uuid }).sort({ created_at: -1 }).limit(1).exec(function (err, res) {
                if (err) {
                    reject(err);
                }
                else {
                    if (res.length) {
                        resolve(res[0]);
                    }
                    else {
                        resolve(null);
                    }
                }
            });
        });
        return p;
    };
    return UsbModel;
}());
exports.UsbModel = UsbModel;
Object.seal(UsbModel);
var RepositoryBase = (function () {
    function RepositoryBase(schemaModel) {
        this._model = schemaModel;
    }
    RepositoryBase.prototype.create = function (item, callback) {
        this._model.create(item, callback);
    };
    RepositoryBase.prototype.retrieve = function (callback) {
        this._model.find({}, callback);
    };
    RepositoryBase.prototype.update = function (_id, item, callback) {
        this._model.update({ _id: this.toObjectId(_id) }, item, callback);
    };
    RepositoryBase.prototype.delete = function (_id, callback) {
        this._model.remove({ _id: this.toObjectId(_id) }, function (err) { return callback(err, null); });
    };
    RepositoryBase.prototype.findById = function (_id, callback) {
        this._model.findById(_id, callback);
    };
    RepositoryBase.prototype.findOne = function (cond, callback) {
        return this._model.findOne(cond, callback);
    };
    RepositoryBase.prototype.find = function (cond, fields, options, callback) {
        return this._model.find(cond, options, callback);
    };
    RepositoryBase.prototype.toObjectId = function (_id) {
        return mongoose.Types.ObjectId.createFromHexString(_id);
    };
    return RepositoryBase;
}());
exports.RepositoryBase = RepositoryBase;
var UsbRepository = (function (_super) {
    __extends(UsbRepository, _super);
    function UsbRepository() {
        _super.call(this, exports.UsbSchema);
    }
    return UsbRepository;
}(RepositoryBase));
exports.UsbRepository = UsbRepository;
Object.seal(UsbRepository);
