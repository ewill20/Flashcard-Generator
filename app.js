var BasicCard = require("./BasicCard.js");
var ClozeCard = require("./ClozeCard.js");
var inquirer = require("inquirer");
var fs = require("fs");

inquirer.prompt([{
    name: 'command',
    message: 'Was willst du tun?',
    type: "list",
    choices: [{
        name: "add-flashcard"
    },
    {
        name: "show-all-cards"
        }]
}]).then(function(answer) {
    if(answer.command === 'add-flashcard') {
        addCard();
    } else if (answer.command === 'show-all-cards') {
        showCards();
    }
});

var addCard = function() {

    inquirer.prompt ([{
        name: 'cardType',
        message: 'Welche Art von Flashcard würdest du gerne machen?',
        type: 'list',
        choices: [{
            name: 'Basic-Flashcard',
        }, 
    {
        name: "Cloze-Flashcard",
    }]
    // Once the user input is received...//
    }]).then(function(answer) {
        if(answer.cardType === 'Basic-Flashcard') {
            inquirer.prompt ([{
                name: 'front',
                message: 'Was is der Frage?',
                validate: function(input) {
                    if(input === '') {
                        console.log("Bitte stellen Sie eine Frage");
                        return false;
                    } else {
                        return true;
                    }
                }
            },{
                name: 'back',
                message: 'Was ist der Frage?',
                validate: function(input) {
                    if(input === '') {
                        console.log("Bitte stellen Sie eine Antworten");
                        return false;
                    } else {
                        return true;
                    }
                }
            }]).then(function(answer) {
                var newBasic = new BasicCard(answer.front, answer.back);
                newBasic.create();
                whatsNext();
            });
        } else if (answer.cardType === 'cloze-flashcard') {
            inquirer.prompt([{
                name: 'text',
                message: 'Was ist der Volltext?',
                validate: function(input) {
                    if (input === '') {
                        console.log("Bitte stellen Sie der Volltext");
                        return false;
                    } else {
                        return true;
                    }
                }
            },
        {
            name: 'cloze',
            message: 'Was ist der "cloze" Portion?',
            validate: function(input) {
                if(input === '') {
                    console.log('Bitte stellen Sie der cloze Portion');
                    return false;
                } else {
                    return true;
                }
            }
        }]).then(function(answer) {
                var text = answer.text;
                var cloze = this.cloze;
                if (text.includes(cloze)) {
                    var newCloze = new ClozeCard(text, cloze);
                    newCloze.create();
                    whatsNext();
                } else {
                    console.log('Der Cloze-Portion, den Sie zur Verfügung gestellt haben, kann nicht gefunden werden.  Bitte versuche es erneut!');
                    addCard();
                }
            });
        }
    });
};

var whatsNext = function() {
    inquirer.prompt([{
        name: 'nextAction',
        message: 'Was willst du nächste tun?',
        type: 'list',
        choices: [{

        },
    {
        name: "Neue-Karte-erstellen",
    },
    {
        name: 'Alle-Karte-anzeigen',
    },
{
    name: "nichts",
}]
    }]).then(function(answer) {
        if(answer.nextAction === 'Neue-Karte-erstellen') {
            addCard();
        } else if (answer.nextAction === 'Alle-Karte-anzeigen') {
            showCards();
        } else if (answer.nextAction === 'nichts') {
            return;
        }
    });
};

 var showCards = function() {
     // reads the log.txt file
     fs.readFile('./log.txt', 'utf8', function(error, data) {
         if (error) {
             console.log('Ein Fehler ist aufgetreten' + error);
         }
         var Fragen = data.split(';');
         var notBlank = function(value) {
             return value;
         };
         Fragen = Fragen.filter(notBlank);
         var graf = 0;
         frageAnzeigen(Fragen, graf);
     });
 };

 var frageAnzeigen = function(array, index) {
     Frage = array[index];
     var geparktFrage = JSON.parse(Frage);
     var frageText;
     var richtigeAntwort;
     if (geparktFrage.type === 'basic') {
         frageText = geparktFrage.front;
         richtigeAntwort = geparktFrage.back;
     } else if (geparktFrage.type === 'cloze') {
         frageText = geparktFrage.clozeDeleted;
         richtigeAntwort = geparktFrage.cloze;
     }
     inquirer.prompt([{
         name: 'response',
         message: frageText
     }]).then(function(answer) {
         if (answer.response === richtigeAntwort) {
             console.log("Richtig!");
             if (index < array.length - 1) {
                frageAnzeigen(array, index + 1);
             }
         } else {
             console.log("Falsch!");
             if (index < array.length - 1) {
                 frageAnzeigen(array, index + 1);
             }
         }
     });
 };