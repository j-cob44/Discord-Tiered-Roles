const miscFuncs = require("./misc.js");

function removeHighestRole(member, _callback){
    member.removeRole(member.highestRole);
    _callback();
}

function addRole(roleID, member, message){
    if(checkCurrentRole(roleID, member)){
        message.reply('you already have this role.');
        return false;
    }
    else{
        if(member.highestRole != null){
            removeHighestRole(member, function(){
                console.log("Old role removed from " + member.user.username);
            });
        }

        member.addRole(roleID);
        return true;
    }
}

function demoteUser(demotionRole, userIDtoDemote){
    member = miscFuncs.findGuildMemberByID(userIDtoDemote);
    removeHighestRole(member, function(){
        console.log('Old Tier 3 Leader, demoted.');
    });

    addRole(demotionRole, member, null);
}

function checkCurrentRole(roleID, member){
    if(roleID == member.highestRole)
        return true;
    else
        return false;
}

module.exports.addRole = addRole;
module.exports.demoteUser = demoteUser;