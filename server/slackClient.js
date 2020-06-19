'use strict';
const { RTMClient } = require('@slack/rtm-api');
let rtm = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel.`);
}

async function handleOnMessage(message) {
    console.log(message);

    const code = "<#[A-Z0-9]+";
    const name = "[a-z]+-?[a-z]+>";
    let channelCode = message.text.match(code);
    let channelName = message.text.match(name);

    if (channelName == null || channelCode == null) {
        // failure to find channel
        await rtm.sendMessage('Please send private messages in the format: "#channel question"', message.channel);
    }

    try{
        channelCode = channelCode[0].substr(2, channelCode[0].length - 1);
        channelName = channelName[0].substr(0, channelName[0].length - 1);
        console.log(channelCode);    
        console.log(channelName);
        
        const question = message.text.split('> ')[1];

        console.log(`Messaging channel: #${channelName}.`);

        await rtm.sendMessage(`Sending "${question}" to #${channelName}.`, message.channel);

        await rtm.sendMessage(question, channelCode);
    } catch (ex) {
        console.error(ex.message);
        await rtm.sendMessage(`Failed to send message. Please ensure you have provided the correct channel name and that AnonyQs has been added to the channel first.`, message.channel);
    }
}

function addAuthenticatedHandler(rtm, handler) {
    rtm.on('authenticated', handler);
}

module.exports.init = function slackClient(token, logLevel) {
    rtm = new RTMClient(token, {logLevel: logLevel});
    addAuthenticatedHandler(rtm, handleOnAuthenticated);

    rtm.on('message', handleOnMessage);

    return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;