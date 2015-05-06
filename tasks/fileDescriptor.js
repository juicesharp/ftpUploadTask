var sha1=require("sha1");
var fs=require("fs");

function FileDescriptor(path, dest){
    var _path, _dest, _localSha, _remoteSha;

    if(this instanceof FileDescriptor) {
        _path = path;
        _dest = dest;
    }else{
        return new FileDescriptor(path, dest);
    }

    this.getPath = function(){
        return _path;
    };

    this.getDest = function(){
        return _dest;
    };

    this.getLocalSha = function() {
        if (_localSha)
            return _localSha;

        if (fs.statSync(_path).isDirectory())
            return undefined;

        _localSha=sha1(fs.readFileSync(_path));
        return _localSha;
    }

    this.getRemoteSha = function() {
        return _remoteSha;
    }

    this.setRemoteSha = function(remoteSha) {
        _remoteSha=remoteSha;
    }
}

FileDescriptor.prototype = {
    constructor : FileDescriptor,
    getDest      : function(){ return this.getDest(); },
    getPath      : function(){ return this.getPath(); },
    getLocalSha  : function(){ return this.getLocalSha(); },
    getRemoteSha : function(){ return this.getRemoteSha(); },
    setRemoteSha : function(sha){ this.setRemoteSha(sha); },
    shouldSkip   : function(){ return this.getRemoteSha() && (this.getRemoteSha()==this.getLocalSha()); },
    print        : function(){ return this.getPath() + ' --> ' + this.getDest(); }
};

module.exports = FileDescriptor;
