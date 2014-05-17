function FileDescriptor(path, dest){
    if(this instanceof FileDescriptor) {
        this.path = path;
        this.dest = dest;
    }else{
        return new FileDescriptor(path, dest);
    }
}

FileDescriptor.prototype = {
    constructor : FileDescriptor,
    getDest : function(){ return this.dest; },
    getPath : function(){ return this.path; },
    print   : function(){ return this.path + ' --> ' + this.dest; }
};

module.exports = FileDescriptor;
