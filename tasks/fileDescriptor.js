module.exports = function(path, dest){
    this.path = path;
    this.dest = dest;

    function getDest(){
        return dest;
    }

    function getPath(){
        return path;
    }

    function printable() {
        return path + ' --> ' + dest;
    }
    return {
        getDest: getDest,
        getPath : getPath,
        toString: printable
    }
};
