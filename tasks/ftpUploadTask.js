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
var progressBar = require('./progressBar');
var fileDescriptor = require('./fileDescriptor');

module.exports = function(grunt) {

    function uploadToServer(client, queue, filesUploadedCb){

        function uploadFile(client, fsObject, fileUploadedCb){
            var dir = path.dirname(fsObject.getDest()) + '/';
            client.mkdir(dir, true, function (err) {
                if (err) {
                    throw err;
                }

                if(grunt.file.isDir(fsObject.getPath())) {
                    fileUploadedCb(null, 'success');
                }
                else {
                    client.put(fsObject.getPath(), fsObject.getDest(), function (err) {
                        if (err) { throw err; }

                        fileUploadedCb(null, 'success');
                    });
                }
            });
        }

        var q = async.queue(function(item, clb){
            uploadFile(client, item, clb);
        }, 2);

        q.drain = function() {
            console.log('All items have been uploaded.');
            filesUploadedCb(null, 'success');
        };

        var progress = progressBar(queue.length);
        for(var i = 0; i < queue.length; ++i){
            (function(d) {
                q.push(d, function (err) {
                    if(err){
                        throw err;
                    }

                    progress.increment();
                    progress.printProgress('Ok', d.toString());
                });
            })(queue[i]);
        }
    }

    grunt.registerMultiTask('ftpUploadTask', 'Push files to ftp server', function() {
        console.log('[Ok]'.green + ' ftp upload task started ...');
        var done = this.async();

        var options = this.options({
            port: 21,
            password: null,
            username: 'anonymous'
        });

        var fileDescriptors = [];

        this.files.forEach(function(file) {
           file.src.filter(function(path) {
                return grunt.file.exists(path);
            }).map(function(path) {
               fileDescriptors.push(fileDescriptor(path, file.dest));
            });
        });

        console.log('[Ok]'.green +  ' ' + fileDescriptors.length + ' files added into upload queue ...');

        var client = new FtpClient();

        client.on('ready', function() {
            console.log('[Ok]'.green + ' ftp connection established ...');
            uploadToServer(client, fileDescriptors, function(err, data){
                if(err) {
                    console.log('[Error]'.red + ' upload to server failed.');
                    throw err;
                }

                client.end();
                done();
            });
        });

        client.on('error', function(err) {
            console.log('[Error]'.red + ' ftp connection error.');
            throw err;
        });

        client.connect(options);
    });
};
