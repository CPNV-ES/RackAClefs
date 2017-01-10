"use strict";
global.mongoosasticOptions = { hosts: ['127.0.0.1:9874'] };
exports.config = {
    database: {
        'url': 'mongodb://localhost:27017/rackaclefs'
    },
};
