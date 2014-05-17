function ProgressBar(total){
    if(this instanceof ProgressBar) {
        this.total = total;
        this.itemsProcessed = 0;
    }else {
        return new ProgressBar(total);
    }
};

ProgressBar.prototype = {
    constructor : ProgressBar,
    currentProgress : function(){
        return (this.itemsProcessed * 100) / this.total;
    },
    printProgress : function(status, description){
        var toPrint = '['.green + status.green +'] '.green  +
        this.currentProgress().toFixed(2) + '% ' + description;

        console.log(toPrint);
    },
    increment : function(){
        this.itemsProcessed++;
    }
};

module.exports = ProgressBar;