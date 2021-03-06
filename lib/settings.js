// Load modules

var Utils = require('./utils');


// Declare internals

var internals = {};


exports.ticket = {
    ttl: 60 * 60 * 1000,                                // 1 hour
    secretBits: 256,                                    // Ticket secret size in bits
    hmacAlgorithm: 'sha256',
    timestampWindow: 5 * 60 * 1000,                     // +/- 5m window for timestamp clock shift

    encryptionKey: {
        saltBits: 256,
        algorithm: 'aes-256-cbc',                       // 'aes-128-ctr' Requires node 0.9.x
        iterations: 1
    },

    integrityKey: {
        saltBits: 256,
        algorithm: 'sha256',
        iterations: 1
    }
};


exports.rsvp = {
    ttl: 1 * 60 * 1000                                  // 1 minute
};


exports.set = function (arg1, arg2) {     // (group, settings) OR (tree)

    Utils.assert(arguments.length === 1 || arguments.length === 2, 'Incorrect number of arguments');
    Utils.assert(arguments.length === 1 || (typeof arguments[0] === 'string' && typeof arguments[1] === 'object'), 'Bad arguments type when used as set(group, settings)');
    Utils.assert(arguments.length === 2 || typeof arguments[0] === 'object', 'Bad arguments type when used as set(tree)');

    var groups = (arguments.length === 1 ? Object.keys(arguments[0]) : [arguments[0]]);
    var settings = arguments[0];
    if (arguments.length === 2) {
        settings = {};
        settings[arguments[0]] = arguments[1];
    }

    for (var i in groups) {
        var group = groups[i];

        Utils.assert(['ticket'].indexOf(group) !== -1, 'Unknown settings group: ' + group);
        Utils.merge(exports[group], settings[group]);
    }
};