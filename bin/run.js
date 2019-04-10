'use strict';

const service = require('../server/service');
const http = require('http');
const config = require('config');
const slackClient = require('../server/slackClient');
const server = http.createServer(service);

const slackToken = config.get('slackToken');
const slackLogLevel = 'verbose';

// Begin authentication with slack client
const rtm = slackClient.init(slackToken, slackLogLevel);
rtm.start()
    .catch(console.error);

// Once slack authnetication is complete, connect to server
slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', function() {
    console.log(`Slackbot is listening on ${server.address().port} in ${service.get('env')} mode.`);
});