module.exports = function(total){
    this.total = total;
    this.itemsProcessed = 0;

    this.currentProgress = function(){
        return (this.itemsProcessed * 100) / this.total;
    };

    this.increment = function(){
        this.itemsProcessed++;
    };

    this.printProgress = function(status, description){
        var toPrint = '['.green + status.green +'] '.green  +
            this.currentProgress().toFixed(2) + '% ' + description;

        console.log(toPrint);
    };
};