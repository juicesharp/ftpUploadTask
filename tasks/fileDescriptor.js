module.exports = function(path, dest){
    var _path = path;
    var _dest = dest;

    function getDest(){
        return _dest;
    }

    function getPath(){
        return _path;
    }

    function printable() {
        return _path + ' --> ' + _dest
    }
    return {
        getDest: getDest,
        getPath : getPath,
        toString: printable
    }
};
