var fs = require("fs");

module.exports = BasicFlashcard;

function BasicFlashcard(front, back) {
    this.front = front;
    this.back = back;
    this.create = function() {
        // card that will be appended //
        var data = {
            front: this.front,
            back: this.back,
            type: "basic",
        };
        // add card to log.txt file //
        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {
            if (error) {
                console.log(error);
            }
        });
    };
}