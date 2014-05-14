module.exports = function(total){
    var itemsToProcess = total;
    var itemsProcessed = 0;

    return{
        increment : function (){
            itemsProcessed++;
        },
        currentProgress : function(){
            return (itemsProcessed * 100) / itemsToProcess;
        },
        printProgress : function(status, description){
            var toPrint = '['.green + status.green +'] '.green  +
                this.currentProgress().toFixed(2) + '% ' + description;
            console.log(toPrint);
        }
    }
};