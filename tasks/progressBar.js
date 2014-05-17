function ProgressBar(total){
    var _total = total;
    var _itemsProcessed = 0;

    if(this instanceof ProgressBar) {
        _total = total;
        _itemsProcessed = 0;
    }else {
        return new ProgressBar(total);
    }

    this.getTotal = function() {
        return _total;
    };

    this.getItemsProcessed = function(){
        return _itemsProcessed;
    };

    this.increment = function(){
        _itemsProcessed++;
    }
}

ProgressBar.prototype = {
    constructor : ProgressBar,
    currentProgress : function(){
        return (this.getItemsProcessed() * 100) / this.getTotal();
    },
    printProgress : function(status, description){
        var toPrint = '['.green + status.green +'] '.green  +
        this.currentProgress().toFixed(2) + '% ' + description;

        console.log(toPrint);
    }
};

module.exports = ProgressBar;