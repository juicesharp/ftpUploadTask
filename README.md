# grunt-ftpuploadtask

> Push files to ftp server

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ftpUploadTask --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ftpUploadTask');
```

## The "ftpuploadtask" task

### Overview
In your project's Gruntfile, add a section named `ftpUploadTask` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    ftpUploadTask: {
      target1: {
        options: {
            user: 'domain\\username',
            password: '*********',
            port: 21,
            host: 'ftp host'
        },
        files: [{
            expand: true,
            cwd: 'Path to directory',
            dest: 'site/wwwroot/',
            src: [
              '**/*.js',
              '**/*.html',
              '!**/node_modules/**',
              '!**/dist/**'
           ]}]
        }
      }
});
```

### Options

#### options.separator
Type: `String`
Default value: `',  '`

A string value that is used to do something with whatever.

#### options.punctuation
Type: `String`
Default value: `'.'`

A string value that is used to do something else with whatever else.

### Usage Examples

#### Default Options

#### Custom Options

## Contributing
_(Nothing yet)_

## Release History
_(Nothing yet)_
