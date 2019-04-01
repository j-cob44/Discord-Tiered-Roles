const userFuncs = require("../json/user.js");
const fs = require("fs");

const config = require('../config.json');

var chatXPReward = config.textActivityReward;
var voiceXPReward = config.voiceActivityReward;

// Server (GUILD) ID
var guildID = '503706496740229152';

// Functions
async function checkTextChannelActivity(user){
    checkUser = await userFuncs.userRetrieve(user.id);

    awardedXP = false;
	data = fs.readFileSync('./json/users.json', 'utf8');
    usersObj = JSON.parse(data); // Take JSON file and make it an OBJ

	currentTime = (new Date()).getTime();

	for(i = 0; i < usersObj.Users.length; i++){
		if(usersObj.Users[i].id == user.id) {
			if((usersObj.Users[i].nextXPAward < currentTime) || (typeof usersObj.Users[i].nextXPAward === 'undefined')) {
				usersObj.Users[i].xp += chatXPReward;
				usersObj.Users[i].nextXPAward = (currentTime + 600000);

				awardedXP = true; // Output to console that XP was awarded.

				console.log("Awarded " + user.username + " for being active in textchannels.");

				json = JSON.stringify(usersObj); // Convert Data back to JSON file
				fs.writeFileSync('./json/users.json', json, 'utf8'); // Rewrite file
				break;
			}

		}
	}
}

async function checkVoiceChannelActivity(botClient){
    console.log("Checking Voice Activity");
	guilds = await botClient.guilds.array();

    for(g = 0; g < guilds.length; g++){
        if(guilds[g].id == guildID){
            guildchannels = await guilds[g].channels.array();
            voicechannels = [];

            for(c = 0; c < guildchannels.length; c++){
                if(guildchannels[c].type == 'voice'){
                    voicechannels.push(guildchannels[c]);
                }
            }
            
            for(v = 0; v < voicechannels.length; v++){
                //if(voicechannels[v].members !== undefined)
                activityVoiceUsers = voicechannels[v].members.array();

                for(u = 0; u < activityVoiceUsers.length; u++){
                    checkUser = await userFuncs.userRetrieve(activityVoiceUsers[u].user.id);

                    awardXPForVoice(activityVoiceUsers[u].user, function(){
                        console.log("Finished Checking Voice Channel Member, " + activityVoiceUsers[u].user.username);
                    });
                }
            }
        }
    }
}

function awardXPForVoice(user, _callback){
	data = fs.readFileSync('./json/users.json', 'utf8');
    usersObj = JSON.parse(data); // Take JSON file and make it an OBJ

	currentTime = (new Date()).getTime();

	for(i = 0; i < usersObj.Users.length; i++){
		if(usersObj.Users[i].id == user.id) {
			if((usersObj.Users[i].nextVoiceActivityAward < currentTime) || (typeof usersObj.Users[i].nextVoiceActivityAward === 'undefined')) {
				usersObj.Users[i].xp += voiceXPReward;
				usersObj.Users[i].nextVoiceActivityAward = (currentTime + 900000);

				console.log("User " + user.username + " was awarded XP for voice Activity.");

				json = JSON.stringify(usersObj); // Convert Data back to JSON file
		    fs.writeFileSync('./json/users.json', json, 'utf8'); // Rewrite file
				break;
			}

		}
	}

	_callback();
}

module.exports.checkTextChannelActivity = checkTextChannelActivity;
module.exports.checkVoiceChannelActivity = checkVoiceChannelActivity;