"use strict";
var cluster = require('cluster');
var mongoose = require('mongoose');
var util_1 = require('./util');
if (cluster.isWorker) {
    cluster.worker.on('message', function (a) {
        e.apply(void 0, a);
    });
}
var e = function (ba, countData, countBS, packSize, params, baPath) {
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec(ba.constructor.toString());
    var name = (results && results.length > 1) ? results[1] : "";
    "";
    var chainDir = ba.dirChaine;
    var elemPerWork = Math.floor(countData / countBS);
    if (cluster.isMaster) {
        cluster.setupMaster({
            exec: './cluster.js'
        });
        for (var i = 0; i < countBS - 1; i++) {
            var w = cluster.fork();
            w.send([ba, countData, countBS, packSize, params, name]);
        }
        var startIndex = elemPerWork * (countBS - 1);
        var finish = countData;
        ba.startBS(startIndex, finish, params);
        ba.log("Init master ");
    }
    else {
        util_1.auth(util_1.program.env);
        var d = require("./batchs/" + baPath).default;
        ba = new d();
        ba.dirChaine = chainDir;
        ba.packSize = packSize;
        var clusId = parseInt(cluster.worker.id);
        ba.log("Init #" + clusId + " worker");
        var startIndex_1 = elemPerWork * (clusId - 1);
        var finish_1 = startIndex_1 + elemPerWork;
        mongoose.connection.on('connected', function () {
            ba.startBS(startIndex_1, finish_1, params);
        });
    }
};
module.exports = e;
