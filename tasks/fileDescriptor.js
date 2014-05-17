function FileDescriptor(path, dest){
    var _path, _dest;

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
}

FileDescriptor.prototype = {
    constructor : FileDescriptor,
    getDest : function(){ return this.getDest(); },
    getPath : function(){ return this.getPath(); },
    print   : function(){ return this.getPath() + ' --> ' + this.getDest(); }
};

module.exports = FileDescriptor;
