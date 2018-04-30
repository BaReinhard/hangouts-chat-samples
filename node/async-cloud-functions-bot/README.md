# Hangouts Chatbot Template

This code sample creates a simple Hangouts Chat bot that responds to events and
messages from a room. The sample is built using JavaScript on Google Cloud Functions.

## Run the sample in Hangouts Chat

1.  Create a cloud function
    **Please Note, asyncBot here needs to match the name of the function exported in index.js**
    `gcloud functions deploy asyncBot --trigger-http`
2.  [Enable the Hangouts Chat API, configure and publish the bot](https://developers.google.com/hangouts/chat/how-tos/bots-publish).
    Make sure to register the URL for the App Engine instance as the
    **HTTP endpoint** of the bot.
3.  Add the bot to a room or direct message.
4.  Send the message to the bot with an @-message or directly in a DM, example: `@BotName /chillah`

### Todos

1.  Testing Async functionality
2.  Add async samples for CARD_CLICKED, ADDED_TO_ROOM, etc.
3.  Clear out unneed functions, and rethink the composition of other functions

### Documentation:

* [Interactive Cards](https://developers.google.com/hangouts/chat/how-tos/cards-onclick)
* [Messages and Cards Reference](https://developers.google.com/hangouts/chat/reference/rest/v1/spaces.messages)
* [Simple Text Messages](https://developers.google.com/hangouts/chat/reference/message-formats/basic)
* [Event Formats](https://developers.google.com/hangouts/chat/reference/message-formats/events)
* [Card Formatting Messages](https://developers.google.com/hangouts/chat/reference/message-formats/cards)
