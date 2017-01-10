"use strict";
var mongoose = require('mongoose');
var redis = require('redis');
var commander = require('commander');
exports.program = commander.version("1.0")
    .option('-e, --env [env]', 'environnement')
    .parse(process.argv);
exports.auth = function (env) {
    var config = exports.getConfiguration(env);
    var databaseURL = config.database.url;
    var mongoOptions = {};
    if (config.database != null && config.database.user != null && config.database.pass != null) {
        mongoOptions.user = config.database.user;
        mongoOptions.pass = config.database.pass;
        if (config.database.dbAuth != null)
            mongoOptions.db = { authSource: config.database.dbAuth };
    }
    mongoose.connect(databaseURL, mongoOptions, function (err) {
    });
};
exports.getConfiguration = function (env) {
    if (env == null) {
        env = exports.program.env;
    }
    var file = "./config";
    if (env != null && env != "prod") {
        file = "./config_" + env;
    }
    return require(file).config;
};
if (global['redisClient'] == null) {
    global['redisClient'] = redis.createClient();
}
exports.RedisClient = global['redisClient'];
