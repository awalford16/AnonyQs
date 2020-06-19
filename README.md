# AnonyQs SlackBot

AnonyQs is a slackbot that allows users to send questions to a slack channel anonymously. Users no longer need to be unsure whether to ask a quesion or not because they fear it may be seen as a "stupid question". AnonyQs will post their question in to the desired channel on the user's behalf and no other member will know who it has come from. 

## Tools

AnonyQs uses the Web-Socket based [Real Time Messaging API](https://api.slack.com/rtm) to validate user authentication and trigger events when a message is sent to the channel.

## Setup

To begin using AnonyQs, it first needs to be added as an app in a users slack evironment. Additionally, it needs to be added to the channels that users will ask questions in, otherwise the bot will not have the correct permissions to post to that channel. 

## Input

The bot only requires one input which is broken into 2 parts; the channel name and the question. The channel name must begin with a '#' and be a valid channel within the slack environment. The question will be regarded as whatever text follows the name of the channel. For example:

```
Ask #my-channel What day is it today?
```

Post In | Question
---|---
#my-channel | What day is it today?

NOTE: Anything prior to the channel name will be ignored.