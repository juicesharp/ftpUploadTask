/*
 * grunt-ftpUploadTask
 * https://github.com/juicesharp/ftpUploadTask
 *
 * Copyright (c) 2014 Sergii Guslystyi
 * Licensed under the MIT license.
 */

'use strict';

require('colors');
var FtpClient = require('ftp');
var path = require('path');
var async = require('async');
var ProgressBar = require('./progressBar');
var FileDescriptor = require('./fileDescriptor');

module.exports = function(grunt) {

    function uploadToServer(client, queue, filesUploadedCb) {

        function uploadFile(client, fsObject, fileUploadedCb) {
            var dir = path.dirname(fsObject.getDest()) + '/';
            client.mkdir(dir, true, function(err) {
                if (err) {
                    throw err;
                }

                if (grunt.file.isDir(fsObject.getPath())) {
                    fileUploadedCb(null, fsObject);
                } else if (fsObject.shouldSkip()) {
                    fileUploadedCb(null, fsObject);
                } else {
                    client.put(fsObject.getPath(), fsObject.getDest(), function(err) {
                        if (err) {
                            throw err;
                        }

                        fileUploadedCb(err, fsObject);
                    });
                }
            });
        }

        var progress = new ProgressBar(queue.length);
        async.forEachLimit(queue, 2, function(item, clb) {
            uploadFile(client, item, function(err, data) {
                if (!err) {
                    progress.increment();

                    if (item.shouldSkip()) {
                        progress.printProgress('--', data.print());
                    } else {
                        progress.printProgress('Ok', data.print());
                    }
                }
                clb(err, data);
            })
        }, function(err, result) {
            filesUploadedCb(err, result);
        });
    }

    function uploadSha(client, queue, targetFile, callback) {
        var o = {};

        queue.forEach(function(fileDescriptor) {
            if (!grunt.file.isDir(fileDescriptor.getPath()))
                o[fileDescriptor.getDest()] = fileDescriptor.getLocalSha();
        });

        var b = new Buffer(JSON.stringify(o));

        client.put(b, targetFile, function(err) {
            if (!err)
                console.log('[Ok]'.green + ' uploaded checksums to ' + targetFile + ' ...');

            callback(err);
        });
    }

    function downloadSha(client, queue, targetFile, callback) {
        console.log('[Ok]'.green + ' checking for checksum file ' + targetFile + ' ...');

        client.get(targetFile, function(err, stream) {
            var jsonData = "";

            if (err) {
                console.log('[--]'.yellow + ' checksum file not found ...');
                callback();
                return;
            }

            stream.on("error", function(err) {
                callback(err);
            });

            stream.on("data", function(data) {
                jsonData += data;
            });

            stream.on("end", function() {
                var o = JSON.parse(jsonData);

                queue.forEach(function(fileDescriptor) {
                    var remoteSha = o[fileDescriptor.getDest()];

                    if (remoteSha)
                        fileDescriptor.setRemoteSha(remoteSha);
                });

                console.log('[Ok]'.green + ' checksum file downloaded ...');
                callback();
            });
        });
    }

    grunt.registerMultiTask('ftpUploadTask', 'Push files to ftp server', function() {
        var started = new Date();

        console.log('[Ok]'.green + ' ftp upload task started ...');
        var done = this.async();

        var options = this.options({
            port: 21,
            password: null,
            username: 'anonymous',
            checksumfile: null
        });

        if (!options.host)
            throw Error('You have to specify a host.')

        var fileDescriptors = [];

        this.files.forEach(function(file) {
            file.src.filter(function(path) {
                return grunt.file.exists(path);
            }).map(function insertDescriptor(path) {
                var descriptor = new FileDescriptor(path, file.dest);
                fileDescriptors.push(descriptor);
            });
        });

        console.log('[Ok]'.green + ' ' + fileDescriptors.length + ' files added into upload queue ...');

        var client = new FtpClient();

        client.on('ready', function handleConnection() {
            console.log('[Ok]'.green + ' ftp connection established ...');

            async.series([
                function(cb) {
                    if (options.checksumfile) {
                        downloadSha(client, fileDescriptors, options.checksumfile, cb);
                    } else {
                        cb(null);
                    }
                },

                function(cb) {
                    uploadToServer(client, fileDescriptors, cb);
                },

                function(cb) {
                    if (options.checksumfile) {
                        uploadSha(client, fileDescriptors, options.checksumfile, cb)
                    } else {
                        cb(null);
                    }
                }
            ], function(err) {
                if (err) {
                    console.log('[Error]'.red + ' upload to server failed.');
                    throw err;
                } else {
                    var current = new Date();
                    console.log('[Ok]'.green + ' completed in ' + (current - started) / 1000 + ' seconds.');

                    client.end();
                    done();
                }
            });
        });

        client.on('error', function(err) {
            console.log('[Error]'.red + ' ftp connection error.');
            throw err;
        });

        client.connect(options);
    });
};