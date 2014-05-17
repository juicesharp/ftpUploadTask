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

    function uploadToServer(client, queue, filesUploadedCb){

        function uploadFile(client, fsObject, fileUploadedCb){
            var dir = path.dirname(fsObject.getDest()) + '/';
            client.mkdir(dir, true, function (err) {
                if (err) {
                    throw err;
                }

                if(grunt.file.isDir(fsObject.getPath())) {
                    fileUploadedCb(null, fsObject);
                }
                else {
                    client.put(fsObject.getPath(), fsObject.getDest(), function (err) {
                        if (err) { throw err; }

                        fileUploadedCb(err, fsObject);
                    });
                }
            });
        }

        var progress = new ProgressBar(queue.length);
        async.forEachLimit(queue, 2, function (item, clb){
            uploadFile(client, item, function(err, data){
                if(!err) {
                    progress.increment();
                    progress.printProgress('Ok', data.print());
                }
                clb(err, data);
            })
        }, function (err, result){
            filesUploadedCb(err, result);
        });
    }

    grunt.registerMultiTask('ftpUploadTask', 'Push files to ftp server', function() {
        console.log('[Ok]'.green + ' ftp upload task started ...');
        var done = this.async();

        var options = this.options({
            port: 21,
            password: null,
            username: 'anonymous'
        });

        if(!options.host)
            throw Error('You have to specify a host.')

        var fileDescriptors = [];

        this.files.forEach(function(file) {
           file.src.filter(function (path) {
                return grunt.file.exists(path);
            }).map(function insertDescriptor(path) {
               var descriptor = new FileDescriptor(path, file.dest);
               fileDescriptors.push(descriptor);
            });
        });

        console.log('[Ok]'.green +  ' ' + fileDescriptors.length + ' files added into upload queue ...');

        var client = new FtpClient();

        client.on('ready', function handleConnection() {
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
