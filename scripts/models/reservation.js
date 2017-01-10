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
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    usb: {
        type: mongoose.Types.ObjectId,
        ref: 'Usb',
        required: true
    },
    user: {
        type: Number,
        required: true
    },
    reserved_at: {
        type: Date,
        require: false
    },
    returned_at: {
        type: Date,
        required: false
    },
    created_at: {
        type: Date,
        require: false
    },
    updated_at: {
        type: Date,
        required: false
    }
}).pre('save', function (next) {
    if (_this._doc) {
        var doc = _this._doc;
        var now = new Date();
        if (!doc.create_at) {
            doc.created_at = now;
        }
        if (!doc.reserved_at) {
            doc.reserved_at = now;
        }
        doc.updated_at = now;
    }
    next();
    return _this;
});
exports.ReservationSchema = mongoose.model('reservation', schema, 'reservations', true);
var ReservationModel = (function () {
    function ReservationModel(reservationModel) {
        this._reservationModel = reservationModel;
    }
    Object.defineProperty(ReservationModel.prototype, "name", {
        get: function () {
            return this._reservationModel.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReservationModel.prototype, "filename", {
        get: function () {
            return this._reservationModel.filename;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReservationModel.prototype, "usb", {
        get: function () {
            return this._reservationModel.usb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReservationModel.prototype, "status", {
        get: function () {
            return this._reservationModel.status;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReservationModel.prototype, "reserved_at", {
        get: function () {
            return this._reservationModel.reserved_at;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReservationModel.prototype, "returned_at", {
        get: function () {
            return this._reservationModel.returned_at;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReservationModel.prototype, "user", {
        get: function () {
            return this._reservationModel.user;
        },
        enumerable: true,
        configurable: true
    });
    ReservationModel.createReservation = function (name, status, filename, user) {
        var p = new Promise(function (resolve, reject) {
            var repo = new ReservationRepository();
            var usb = {
                name: name,
                status: status,
                filename: filename,
                user: user
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
    ReservationModel.findReservation = function (_id) {
        var p = new Promise(function (resolve, reject) {
            var repo = new ReservationRepository();
            repo.find({ _id: mongoose.Types.ObjectId.createFromHexString(_id) }).sort({ created_at: -1 }).limit(1).exec(function (err, res) {
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
    return ReservationModel;
}());
exports.ReservationModel = ReservationModel;
Object.seal(ReservationModel);
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
        this._model.update({ _id: _id }, item, callback);
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
var ReservationRepository = (function (_super) {
    __extends(ReservationRepository, _super);
    function ReservationRepository() {
        _super.call(this, exports.ReservationSchema);
    }
    return ReservationRepository;
}(RepositoryBase));
exports.ReservationRepository = ReservationRepository;
Object.seal(ReservationRepository);
