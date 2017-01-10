"use strict";
var path = require('path');
var batchManager_1 = require('../batchManager');
var cluster = require('cluster');
var util_1 = require('../util');
function default_1(chainName) {
    var env = util_1.program.env;
    if (env != null) {
        console.log("Environnement : ", env);
    }
    util_1.auth(env);
    var confPath = path.join(__dirname, chainName + ".json");
    if (cluster.isMaster) {
        var batchManager = new batchManager_1.BatchManager(confPath);
        batchManager.dirChaine = chainName;
        batchManager.run();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
