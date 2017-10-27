'use strict';
var Alexa = require('alexa-sdk');

var APP_ID = ''; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";
var SKILL_NAME = 'Sight Words';

/**
 * Array containing space facts.
 */
 var wordMAP = new Map();
 wordMAP.set('from', ['f', 'r', 'o', 'm']);
 wordMAP.set('good', ['g', 'o', 'o', 'd']);
 wordMAP.set('any', ['a', 'n', 'y']);
 /*
var RESPONSES = [
    "No Doubt.",
    "Oh, without a doubt.",
    "For Sure.",
    "Hell Yeah Son.",
    "Nah, Nope.",
    "yiss ir",
    "But of course my Gee.",
    "Sorry my dude.",
    "It ain't looking good."    
];
*/

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var keyword;

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetWelcome');
    },
    'GetNewIntent': function () {
        this.emit('GetResponse');
    },    
    'GetWelcome': function () {
        // Get a random space fact from the space facts list
        //var responseIndex = Math.floor(Math.random() * RESPONSES.length);
        //var randomResponse = RESPONSES[responseIndex];
        //var welcomeResponse = "Ask Street Wizard a yes or no question and I will answer it, or you can say exit. Ask me a yes or no question.";
        // Create speech output
        //var reprompt = "Ask a yes or no question.";
        //var speechOutput = welcomeResponse;


        
        for (var key of wordMAP.keys()) {
          keyword = key;
        }

        var speechOutput = 'Please spell the following word. ' + wordMAP.get(keyword);

        this.emit(':ask', speechOutput, speechOutput);
        //this.emit(':tellWithCard', speechOutput, SKILL_NAME, welcomeResponse);
    },
    'GetResponse': function () {
        // Get a random space fact from the space facts list
        //var responseIndex = Math.floor(Math.random() * RESPONSES.length);
        //var randomResponse = RESPONSES[responseIndex];

        // Create speech output
        //var speechOutput = randomResponse;
        //var keyword;
        //for (var key of wordMAP.keys()) {
        //  keyword = key;
        //}

        //var speechOutput = 'Please spell the following word. ' + wordMAP.get(keyword);
        wordMAP.get(keyword);
        this.emit(':tellWithCard', speechOutput, SKILL_NAME, randomResponse);
    },
    'AMAZON.HelpIntent': function () {
        //var speechOutput = "You can say tell me a space fact, or, you can say exit... What can I help you with?";
        var speechOutput = "Spell the word provided, or you can say stop.";
        //var reprompt = "Ask a yes or no question.";
        this.emit(':ask', speechOutput, speechOutput);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Goodbye!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Goodbye!');
    }
};