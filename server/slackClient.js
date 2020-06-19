'use strict';
const { RTMClient } = require('@slack/rtm-api');
let rtm = null;

function handleOnAuthenticated(rtmStartData) {
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel.`);
}

async function handleOnMessage(message) {
    console.log(message);

    const code = /<#[A-Z0-9]+/g;
    const name = /[a-z]+-?[a-z]+>/g;
    let channelCodes = message.text.match(code);
    let channelNames = message.text.match(name);

    if (channelNames == null || channelCodes == null || channelNames == [] || channelCodes == []) {
        // failure to find channel
        await rtm.sendMessage('Please send private messages in the format: "#channel question"', message.channel);
    }

    try{
        let channelLength = channelNames.length;
        const question = message.text.split('> ')[channelLength];

        // Fix channel names
        for(var i = 0; i < channelLength; i++) {
            channelCodes[i] = channelCodes[i].substr(2, channelCodes[i].length - 1);
            channelNames[i] = channelNames[i].substr(0, channelNames[i].length - 1);

            await rtm.sendMessage(`Sending "${question}" to channel: ${channelNames[i]}`, message.channel);
            await rtm.sendMessage(question, channelCodes[i]);
        }
    } catch (ex) {
        console.error(ex.message);
        await rtm.sendMessage(`Failed to send message. Please ensure you have provided the correct channel names and that AnonyQs has been added to the channels first.`, message.channel);
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