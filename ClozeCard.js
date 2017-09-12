var fs = require("fs");

module.exports = ClozeFlashcard;

// Constructor for Cloze Flashcard //
function ClozeFlashcard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.clozeDeleted - this.text.replace(this.cloze, '_______');
    this.create = function() {
        var data = {
            text: this.text,
            cloze: this.cloze,
            clozeDeleted: this.clozeDeleted,
            type: "cloze"
        };
        // Add card to log.txt //
        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {
            if(error) {
                console.log(error);
            }
        });
    };
}