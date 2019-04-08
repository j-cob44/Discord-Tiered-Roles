var guildID = '503706496740229152';

function msToTime(duration) {
    var seconds = parseInt((duration / 1000) % 60);
    var minutes = parseInt((duration / (1000 * 60)) % 60);

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

function findGuildMemberByID(botClient, userID){
	guildMember = null;
	guilds = botClient.guilds.array();

	for(g = 0; g < guilds.length; g++){
		if(guilds[g].id == guildID){
			guildMembers = guilds[g].members.array();
			for(m = 0; m < guildMembers.length; m++){
				if(guildMembers[m].id == userID){
					guildMember = guildMembers[m];
					return guildMember;
				}
			}
		}
	}
}

module.exports.msToTime = msToTime;
module.exports.findGuildMemberByID = findGuildMemberByID;

  
