module.exports = function FileDescriptor(path, dest){
    this.path = path;
    this.dest = dest;

    this.getDest = function(){
        return this.dest;
    };

    this.getPath = function(){
        return this.path;
    };

    this.toString = function() {
        return this.path + ' --> ' + this.dest;
    };
};
