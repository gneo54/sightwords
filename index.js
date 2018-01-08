'use strict';
const Alexa = require('alexa-sdk');
const appId = //'amzn1.echo-sdk-ams.app.your-skill-id';

exports.handler = function(event, context, callback) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    //alexa.dynamoDBTableName = 'sightWordsUsers';
    alexa.registerHandlers(newSessionHandlers, guessModeHandlers, startGameHandlers, guessAttemptHandlers);
    alexa.execute();
};

const states = {
    GUESSMODE: '_GUESSMODE', // User is trying to guess the number.
    STARTMODE: '_STARTMODE'  // Prompt the user to start or restart the game.
};

var wordsUsed = [];
 const wordARR =  ['about','after','again','all','always','and','any','apple','are','around','ask','ate','away','baby','back','ball','bear','because','bed','been','before','bell','best','better','big','bird','birthday','black','blue','boat','both','box','boy','bread','bring','brother','brown','but','buy','cake','call','came','can','car','carry','cat','chair','chicken','children','Christmas','clean','coat','cold','come','corn','could','cow','cut','day','did','does','dog','doll','done','don’t','door','down','draw','drink','duck','eat','egg','eight','every','eye','fall','far','farm','farmer','fast','father','feet','find','fire','first','fish','five','floor','flower','fly','for','found','four','from','full','funny','game','garden','gave','get','girl','give','goes','going','good','goodbye','got','grass','green','ground','grow','had','hand','has','have','head','help','her','here','hill','him','his','hold','home','horse','hot','house','how','hurt','into','its','jump','just','keep','kind','kitty','know','laugh','leg','let','letter','light','like','little','live','long','look','made','make','man','many','may','men','milk','money','morning','mother','much','must','myself','name','nest','never','new','night','not','now','off','old','once','one','only','open','our','out','over','own','paper','party','pick','picture','pig','play','please','pretty','pull','put','rabbit','rain','ran','read','red','ride','right','ring','robin','round','run','said','saw','say','school','see','seed','seven','shall','she','sheep','shoe','show','sing','sister','sit','six','sleep','small','snow','some','song','soon','squirrel','start','stick','stop','street','sun','table','take','tell','ten','thank','that','the','their','them','then','there','these','they','thing','think','this','those','three','time','today','together','too','top','toy','tree','try','two','under','upon','use','very','walk','want','warm','was','wash','watch','water','way','well','went','were','what','when','where'];


const gameINFO = {
    'roundNum': 0,
    'attemptNum': 0,
    'correctNum': 0,
    'incorrectNum': 0,
    'roundAttempt': 0

};
const newSessionHandlers = {
    'NewSession': function() {
        //if(Object.keys(this.attributes).length === 0) {
        //    this.attributes['endedSessionCount'] = 0;
        //    this.attributes['gamesPlayed'] = 0;
        //}

        gameINFO.roundNum = 0;
        gameINFO.attemptNum = 0;
        gameINFO.correctNum = 0;
        gameINFO.incorrectNum = 0;
        gameINFO.roundAttempt = 0;
        //this.attributes['wordMAP'] = wordMAP;

        this.handler.state = states.STARTMODE;
        this.response.speak('Welcome to Sight Words spelling game. Would you like to play?')
            .listen('Say yes to start the game or no to quit.');
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
      this.response.speak("b. y. e. Bye!");
      this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        //this.attributes['endedSessionCount'] += 1;
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    }
};

const startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'NewSession': function () {
        this.emit('NewSession'); // Uses the handler in newSessionHandlers
    },
    'AMAZON.HelpIntent': function() {
        const message = 'I will tell you a sight word, respond with only the spelling of the word and I will tell you if'  +
            ' you spelled it correctly. Do you want to start the game?';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    },
    'AMAZON.YesIntent': function() {
        console.log('yes intent');
        var keyword;
        console.log(wordARR);
        var warr = wordARR;//this.attributes['wordMAP'];
        //var i = 1;
        var gameNum = Math.floor(Math.random()*(warr.length-1+1)+1) ;

        /*
        for (var key of wm.keys()) {
            keyword = key;
            if (i==gameNum){break;}
            i++;
        }
        */

        for (var i = 0; i < warr.length; i++){
            keyword = warr[i];
            if ((i+1)==gameNum){break;}
               
        }
   
        console.log('keyword' + gameNum);
        console.log('keyword' + keyword);
        this.attributes['guessSpelling'] = keyword;

        gameINFO.roundNum++;
        var rndText = 'Round ' + gameINFO.roundNum + '. ';
        var sightWordSpeech = rndText + 'Here is your sight word. ' + keyword + '. Spell It.';
        //this.attributes["guessSpelling"] = keyword;
        this.handler.state = states.GUESSMODE;
        this.response.speak('Great! ' + 'Get ready. ' + sightWordSpeech).listen(sightWordSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.NoIntent': function() {
        console.log("NOINTENT");
        this.response.speak('Ok, see you next time!');
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
      console.log("STOPINTENT");
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
      console.log("CANCELINTENT");
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        console.log("UNHANDLED");
        const message = 'Say yes to continue, or no to end the game.';
        this.response.speak(message).listen(message);
        this.emit(':responseReady');
    }
});

const guessModeHandlers = Alexa.CreateStateHandler(states.GUESSMODE, {
    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession'); // Equivalent to the Start Mode NewSession handler
    },
    'SpellGuessIntent': function() {
        console.log('in spell guess');

         gameINFO.attemptNum++;
        gameINFO.roundAttempt++;

  
        var guessSpell = this.event.request.intent.slots.guess.value.toLowerCase();
        guessSpell = guessSpell.replace(/\s/g,'');

        guessSpell = guessSpell.replace(/\./g,'');
        //guessSpell = guessSpell.replace('.', '');

        //const targetSpellingWord = this.attributes["guessSpelling"];
        const targetSpellingWord = this.attributes['guessSpelling'];
        console.log('target');
        console.log(targetSpellingWord);
        var warr = wordARR;//this.attributes['wordMAP'];
        //console.log(warr);
        //var letters = wm.get(targetSpellingWord).join('. ') + '.';

        console.log('user guessed: ' + guessSpell);
        console.log('looking for: ' + targetSpellingWord);

        //if(guessNum > targetNum){
        //    this.emit('TooHigh', guessNum);
        //} else if( guessNum < targetNum){
        //    this.emit('TooLow', guessNum);
        //} else if (guessNum === targetNum){
        var rightResponse = 'Say yes to get a new word, or no to end the game.';
        if (guessSpell === targetSpellingWord){
             gameINFO.roundAttempt = 0;
    
            // With a callback, use the arrow function to preserve the correct 'this' context
            this.emit('JustRight', () => {
                var pctCorrect = 'You grade is ' + (100* Number(Math.round((gameINFO.correctNum / (gameINFO.correctNum + gameINFO.incorrectNum))+'e'+2)+'e-'+2)) + '%. ' ;
                this.response.speak('Correct!' + pctCorrect + 'Would you like a new sight word?')
                .listen(rightResponse);
                this.emit(':responseReady');
        });
        }else
        {
                 
        
            if (gameINFO.roundAttempt == 3){
                //this.emit('IncorrectSoNewRound');
                gameINFO.roundAttempt = 0;
                this.emit('IncorrectSoNewRound', () => {
                var pctgrade = 'Your grade is ' + (100* Number(Math.round((gameINFO.correctNum / (gameINFO.correctNum + gameINFO.incorrectNum))+'e'+2)+'e-'+2)) + '%. ' ;
                this.response.speak('Sorry, that round has ended! ' + pctgrade + 'Would you like a new sight word?')
                .listen(rightResponse);
                this.emit(':responseReady');
                });
            }else{
                this.emit('incorrect');
            }
      
            
        }
        //} else {
        //    this.emit('NotANum');
        //}
    },
    'AMAZON.HelpIntent': function() {
        var helpResponse = 'Here is your sight word. ' + this.attributes['guessSpelling'];
        this.response.speak('I will tell you a sight word, respond with only the spelling of the word and I will tell you if' +
            ' you spelled it correctly. ' + helpResponse)
            .listen(helpResponse);
        this.emit(':responseReady');
    },
    "AMAZON.StopIntent": function() {
        console.log("STOPINTENT");
      this.response.speak("Goodbye!");
      this.emit(':responseReady');
    },
    "AMAZON.CancelIntent": function() {
        console.log("CANCELINTENT");
    },
    'SessionEndedRequest': function () {
        console.log("SESSIONENDEDREQUEST");
        //this.attributes['endedSessionCount'] += 1;
        this.response.speak("Goodbye!");
        this.emit(':responseReady');
    },
    'Unhandled': function() {
        var newWordSpeech  = 'Your sight word is ' + this.attributes['guessSpelling'];
        console.log("UNHANDLED");
        this.response.speak('Sorry, I didn\'t get that. Try spelling it again. ' + newWordSpeech)
        .listen(newWordSpeech);
        this.emit(':responseReady');
    }
});

// These handlers are not bound to a state
const guessAttemptHandlers = {
    
    'JustRight': function(callback) {
        gameINFO.correctNum++;
        this.handler.state = states.STARTMODE;
        //this.response.sessionAttributes.gamesPlayed
        //this.attributes['gamesPlayed']++;
        callback();
    }, 
    'IncorrectSoNewRound': function(callback) {
        gameINFO.incorrectNum++;
        this.handler.state = states.STARTMODE;
        //this.response.sessionAttributes.gamesPlayed
        //this.attributes['gamesPlayed']++;
        callback();
    }, 
    'incorrect': function() {
        
        var lastChance = '';
        if (gameINFO.roundAttempt==2){
            lastChance = 'This is your last chance for this word. ';
        }
        var retrySpeech  = 'your sight word is ' + this.attributes['guessSpelling'] + '. Spell it. ' + lastChance;
        this.response.speak('Sorry. That is incorrect. Again, ' + retrySpeech).listen('Try again.');
        this.emit(':responseReady');
    }

};