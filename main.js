const Discordjs = require('Discord.js');
const client = new Discordjs.Client();

const config = require('./config.json');
const command = require('./funcs/commands.js');

const backupFuncs = require("./jsonbackups/backup.js");

const xpRewards = require('./funcs/xpRewards.js');

client.on('ready', () => {
    backupFuncs.backup();
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

    xpRewards.checkVoiceChannelActivity(client);
	// setInterval(checkVoiceActivity, 540000); // 9 minute intervals 540000
	setInterval(xpRewards.checkVoiceChannelActivity, 300000, client); // 5 minute intervals 300000
});

client.login(config.authToken);

client.on('message', message => {
    xpRewards.checkTextChannelActivity(message.author);

    // Command prefix entered
    if(message.content.charAt(0) === config.prefix){
        // Get Command and args
        commandIssued = message.content.substr(1); // remove prefix
        commandIssued = commandIssued.split(" ");

        // Store Info
        originChannel = message.channel;
        originUser = message.author;
        originMessage = message;
        originMember = message.member;

        console.log('Command: ' + commandIssued + " By: " + originUser.username + " In: " + originChannel.name);
        // Begin Command Switch
        switch(commandIssued[0]){
            case "ping":
                command.ping(originChannel, originUser);
            break;
            case 'help':
                command.help(originChannel, originUser);
            break;
            case 'class':
                command.changeUserClass(originMessage, originMember, commandIssued[1]);
            break;
            case 'xp':
                command.xpCommand(originMessage, originUser);
            break;
            case 'train':
                command.train(originMessage, originUser);
            break;
            case 'investxp':
                command.investXP(originMessage, originUser, originMember);
            break;
            case 'tier3':
                command.tier3(originChannel, originUser);
            break;
            case 'jarlxp':
                command.jarlxp(originChannel, originUser);
            break;
            case 'jarldom':
                command.jarldom(originMessage, originUser, originMember);
            break;

        }
    }
});

