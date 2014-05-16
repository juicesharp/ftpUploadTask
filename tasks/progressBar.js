module.exports = function(total){
    this.total = total;
    var itemsProcessed = 0;

    function currentProgress(){
        return (itemsProcessed * 100) / total;
    }

    return{
        increment : function (){
            itemsProcessed++;
        },
        currentProgress : currentProgress,
        printProgress : function(status, description){
            var toPrint = '['.green + status.green +'] '.green  +
                currentProgress().toFixed(2) + '% ' + description;
            console.log(toPrint);
        }
    }
};