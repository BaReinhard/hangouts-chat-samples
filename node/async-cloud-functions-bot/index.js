const arrify = require('arrify');
const {
 singleImageCard,
 createHeaderObject,
 createImageWidget,
 createWidgets,
 createCardObject,
 createCards
} = require('hangouts-card-helper');
/**
 * Description: A basic Chat Bot setup, to be used with Google Cloud Functions.
 */

var BOT_NAME = 'Basicbot';
var ACTIONS = {
 DOG: { command: '/dog', word: 'DOG' },
 CAT: { command: '/cat', word: 'CAT' },
 NO_ACTION: { command: '', word: 'NO_ACTION' }
};
var TEXT = 'TEXT',
 CARD = 'CARD',
 HELP_TYPE = TEXT;
exports.asyncBot = (req, res) => {
 // Pass req and res to functions to handle async actions and clear up readability
 switch (req.body.type) {
  case 'ADDED_TO_SPACE':
   handleAddToSpace(req, res);
   break;
  case 'MESSAGE':
   handleMessage(req, res);
   break;
  case 'CARD_CLICKED':
   handleCardClick(req, res);
   break;
  case 'REMOVED_FROM_SPACE':
   res.send();
   break;
 }
};

/**
 * Handles interactions when when the Bot is added to the Room
 * @param {Object} body
 * @returns {Object} returns a Card with widgets containing key value pairs
 */
function handleAddToSpace(req, res) {
 res.send(getHelp());
}

/**
 * Handles Type of MESSAGE, cleans the text to find what search text was used and returns proper response
 * @param {Object} req , the request  object
 * @param {Object} res , the response object
 * @returns {Object} Returns a Card object with multiple images and buttons
 */
function handleMessage(req, res) {
 let DEV_ROOMS = require('devspaces.js');
 let { user, message, space } = req.body,
  { sender, annotations } = message,
  text,
  promise = promisify(getHelp(user)),
  actionWord;
 if (message) {
  text = message.text.toLowerCase();
 }
 if (DEV_ROOMS.includes(space.name)) {
  // If space is dev testing room
  // Place Beta Code here to test in a room so it will only affect specfic room
 } else {
  // Place production release code here

  // Handle Sync Actions First
  actionWord = getActionWord(text);

  // Then Handle Async next

  switch (actionWord) {
   case ACTION_WORDS.CAT.word:
    promise = asyncTimer(300).then(r => {
     return singleImageCard(
      'http://images.all-free-download.com/images/graphiclarge/cute_cat_06_hd_picture_170909.jpg'
     );
    });
    break;
   case ACTION_WORDS.DOG.word:
    promise = asyncTimer(200).then(r => {
     return singleImageCard(
      'https://cdni.rt.com/files/2016.01/article/568d0043c46188505b8b459d.jpg'
     );
    });
    break;
   case ACTION_WORD.NO_ACTION.word:
    promise = promisify({ text: 'No action was found' });
    break;

   default:
    promise = promisify({ text: 'No action was found' });
    break;
  }
  // Wait for promise to be resolved then return message
  promise.then(responseMessage => {
   res.send(responseMessage);
  });
 }
}

/**
 * Checks text for specific commands, and returns the respective action word.
 * @param {String} text
 * @returns {String}
 */
function getActionWord(text = '') {
 let actionWord = 'NO_ACTION';
 if (text.includes(ACTION_WORDS.DOG.command)) {
  actionWord = ACTION_WORDS.DOG.word;
 } else if (text.includes(ACTION_WORDS.CAT.command)) {
  actionWord = ACTION_WORDS.CAT.word;
 }

 return actionWord;
}

/**
 * Handles the interaction when a card is clicked. Returns a single image
 * @param {Object} req request object
 * @param {Object} res response object
 * @returns {Object} returns a card object with the proper actionResponse to update the existing comment
 */
function handleCardClick(body) {
 let { cards } = getSingleImage(body.action.parameters[0].value);
 return {
  actionResponse: {
   type: 'UPDATE_MESSAGE'
  },
  cards
 };
}

/**
 * Removed bot name, extra spaces, and returns back the important part of the text sent
 * @param {String} text
 * @return {String}
 */
function cleanText(text) {
 return text
  .toLowerCase()
  .replace(`@${BOTNAME.toLowerCase()}`, '')
  .split(' ')
  .filter(char => char !== '')
  .join(' ');
}

/**
 * Returns a static interactive card, you can map over arrays to populate something similar
 * @returns {Object}
 */
function getInteractiveCard() {
 let imageUrls = [
  'https://photos.app.goo.gl/5noEuKjptkjWd01n1',
  'https://photos.app.goo.gl/DRqnKP4YBO12SnLT2'
 ];
 return createCards(
  createCardObject(
   createHeaderObject(
    'Which type',
    'Click on to Choose',
    'http://www.freepngimg.com/download/dog/9-dog-png-image-picture-download-dogs.png',
    'IMAGE'
   ),

   createWidgets([imageUrls.map(url => createImageWidget(url))])
  )
 );
}

/**
 * Return an array of widgets
 * @param {Array} urls a simple array of imageUrls, strings
 * @param {Function} widgetComposer a function used to compose a widget object
 * @returns {Array}
 */
function getWidgets(urls, widgetComposer) {
 return urls.map(url => widgetComposer(url));
}

/**
 * Returns a Widget with an image and button with a set url parameter
 * @param {String} imageUrl
 * @param {String} actionMethodName a simple string that can be passed to choose what actionMethodName is to be specified
 * @return {Object} a widget with an image and button
 */
function getImageButtonWidget(imageUrl, actionMethodName = 'choose') {
 return {
  image: {
   imageUrl
  },
  buttons: [
   {
    textButton: {
     text: 'Select',
     onClick: {
      action: {
       actionMethodName,
       parameters: [
        {
         key: 'url',
         value: imageUrl
        }
       ]
      }
     }
    }
   }
  ]
 };
}

/**
 * Returns a Card List Commands/Usage of the bot
 * @returns {Object|String}
 */
function getHelp(user = {}) {
 let commands = [
  ['Get Dog Image', `@${BOTNAME} ${ACTION_WORDS.DOG.command}`],
  ['Get Cat Image', `@${BOTNAME} ${ACTION_WORDS.CAT.command}`]
 ];
 let helpCard;
 switch (HELP_TYPE) {
  case CARD:
   helpCard = {
    cards: [
     {
      header: {
       title: `Need Help ${user.displayName || ''}?`,
       subtitle: 'Examples Below:',
       imageUrl:
        'http://images.all-free-download.com/images/graphiclarge/cute_cat_06_hd_picture_170909.jpg',
       imageStyle: 'IMAGE'
      },
      sections: [
       {
        widgets: getWidgetValuePair(commands)
       }
      ]
     }
    ]
   };
   break;
  default:
   helpCard = { text: mapHelpText(commands) };
   break;
 }

 return helpCard;
}

/**
 * Returns help text formatted, created from an array of commands
 * @param {Array} commands, An array with the shape Array<String,String>
 * @returns {String}
 */
function mapHelpText(commands) {
 let helpText = '';
 commands.forEach(command => {
  helpText += `*${command[0]}* \n${command[1]}`;
 });
 return helpText;
}

/**
 * Creates an array of widget objects with key value pairs
 * @param {Array} commands an array of array of length 2 (aka array of tuples or key value pairs)
 * @returns {Array}
 */
function getWidgetValuePair(commands) {
 commands = arrify(commands);
 return commands.map(command => ({
  keyValue: {
   topLabel: command[0],
   content: command[1]
  }
 }));
}

/**
 * A function that returns a promise and resolves after delay milliseconds, used to display async functionality
 * @param {String} delay A delay is milliseconds for the promise to resolve
 * @returns {Promise}
 */
function asyncTimer(delay) {
 return new Promise((resolve, reject) => {
  setTimeout(() => {
   resolve();
  }, delay);
 });
}

/**
 * Creates an image widget to be used with hangouts chat widgets
 * @param {String} imageUrl
 * @returns {Object} an image widget, doc: https://developers.google.com/hangouts/chat/reference/message-formats/cards
 */
function createImageWidget(imageUrl) {
 return { image: { imageUrl } };
}

/**
 * Wraps a value in a resolved Promise
 * @param {*} val
 * @returns {Promise} Returns a resolved promise with the passed value inside
 */
function promisify(val) {
 return Promise.resolve(val);
}
