const Discordjs = require('Discord.js');

const config = require('../config.json');
const roleID = require("./roleIDs.js");
const userRoles = require("./roleChanges.js");
const userFuncs = require("../json/user.js");
const roleFuncs = require("../json/role.js");
const miscFuncs = require("./misc.js");


// Full Commands
function ping(channel, user){
    console.log(user.username + " sent a Ping!");
    channel.send("Pong");
}

function help(channel, user){
    console.log("Sending Help to " + user.username);
    const helpCommand = new Discordjs.RichEmbed()
        .setTitle("Current Commands:") //This is your title, it can hold 256 characters
        .setAuthor("Help Information")
        /*
            * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
            */
        .setColor(0x00AE86)
        .setDescription("") // This is the main body of text, it can hold 2048 characters.
        .setFooter("Help Information") //This is the footer text, it can hold 2048 characters
        .setImage()
        .setThumbnail()
        /*
            * Takes a Date object, defaults to current date.
            */
        .setTimestamp()
        .setURL()
        .addField(">train",
            "Gain XP. Reuseable every hour.")
        .addField(">xp",
            "View your current XP.")
        .addField(">class [role]", //This is a field title, it can hold 256 characters
            "Can be changed to [hunter, warrior, trader, sailor, blacksmith]") //This is a field value, it can hold 1024 characters.
        .addField(">investxp",
            "Invest your xp to level up your role within your class.")
        .addField(">investxp - Continued",
            "It costs 250XP to level up to a Tier 2 role. A Tier 3 role can vary in XP cost. Re-invest your xp to maintain a Tier 3 role by using this command also.")
        .addField(">tier3",
            "View the current XP needed to invest into a tier 3 role.")
        .addField(">jarldom",
            "Claim the throne or reinvest XP to maintain control.")
        .addField(">jarlxp",
            "See the current XP needed to claim the throne!")

    channel.send(helpCommand);
    console.log("Tried Sending Help");
}

function changeUserClass(message, member, args){
    console.log("User Class Change")
    switch(args){
        case "hunter":
            if(userRoles.addRole(roleID.hunterID, member, message))
                message.reply('you are now a hunter.');
        break;
        case "warrior":
            if(userRoles.addRole(roleID.warriorID, member, message))
                message.reply('you are now a warrior.');
        break;
        case "trader":
            if(userRoles.addRole(roleID.traderID, member, message))
                message.reply(' you are now a trader.');
        break;
        case "sailor":
            if(userRoles.addRole(roleID.sailorID, member, message))
                message.reply('you are now a sailor.');
        break;
        case "blacksmith":
            if(userRoles.addRole(roleID.blacksmithID, member, message))
                message.reply('you are now a blacksmith.');
        break;
        default:
            message.reply("that was not a valid class.");
        break;
    }
}

function xpCommand(message, user){
    userObj = userFuncs.userRetrieve(user.id);

    message.reply('you have ' + userObj.xp + ' XP.');
}

function train(message, user){
    currentTime = (new Date()).getTime();
    userObj = userFuncs.userRetrieve(user.id);

    if(userObj.nextTimeToTrain < currentTime ){
        userFuncs.trainUser(userObj.id, 25, currentTime);
        message.reply('you have gained 25 XP. You can train again in 1 hour.');
    }
    else{
        duration =  userObj.nextTimeToTrain - currentTime;
        message.reply('you have already trained. Please try again in, ' + miscFuncs.msToTime(duration) + '.');
    }

}

function investXP(message, user, member){
    userObj = userFuncs.userRetrieve(user.id);

    // levelUp tier 1 role to tier 2
    if(roleID.confirmTier1Role(member) && userObj.xp >= config.tier2roleCost) { // Is tier 1 role and has enough to level up
        userFuncs.subtractXP(user.id, config.tier2roleCost);

        nextRole = roleID.getNextRole(member, message);

        userRoles.addRole(nextRole, member, message);

        console.log(user.username + " has been upgraded to tier 2.")
    }
    else if (roleID.confirmTier1Role(member) && userObj.xp < config.tier2roleCost){ // is Tier 1 but doesnt have enough XP
        message.reply('you do not have enough experience. You need ' + (config.tier2roleCost - userObj.xp) + ' more.');
        console.log(user.username + " did not have enough XP.")
    }

    // levelUp tier 2 role to tier 3
    if(roleID.confirmTier2Role(member)) { // Is tier 2 role and has enough to level up
        roleObj = roleFuncs.getRoleObj(roleID.getNextRole(member, null));
        investmentNeeded = roleObj.investedXP + 1;

        if(userObj.xp >= investmentNeeded && roleObj.userid != userObj.id){
            if(roleObj.userid != null){
                userRoles.demoteUser(roleObj.demotionRole, roleObj.userid);
            }

            userRoles.addRole(roleObj.id, member, message);
            roleFuncs.inputUserToRoleJSON(roleObj.id, user.id, userObj.xp);

            message.reply('you used ' + userObj.xp + 'XP to become the new ' + roleObj.rolename + '!');
            userFuncs.resetUserXP(user.id);
        }
        else if(userObj.xp < investmentNeeded){
            message.reply('you do not have enough XP to level up to tier 3. You need ' + (investmentNeeded - userObj.xp) + ' more XP.');
        }
    }

    if(roleID.confirmTier3Role(member)){
        roleObj = roleFuncs.getRoleObj(member.highestRole.id);
        investmentNeeded = roleObj.investedXP + 1;

        if(userObj.xp >= investmentNeeded && roleObj.userid == userObj.id){
            roleFuncs.inputUserToRoleJSON(roleObj.id, user.id, userObj.xp);

            message.reply('you have reinvested ' + userObj.xp + 'XP to maintain your role.');
            userFuncs.resetUserXP(user.id);
        }
        else if(userObj.xp < investmentNeeded){
            message.reply('you do not have enough XP to reinvest into your role. You need ' + (investmentNeeded - userObj.xp) + ' more XP.');
        }
    }
}

function tier3(channel, user){
    var xpList = roleFuncs.roleXPInvestments();

    var tier3Command = new Discordjs.RichEmbed()
        .setTitle("Current Tier 3 XP Costs:") //This is your title, it can hold 256 characters
        .setAuthor("XP Investment")
        /*
            * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
            */
        .setColor(0x00AE86)
        .setDescription("") // This is the main body of text, it can hold 2048 characters.
        .setFooter("XP Investment") //This is the footer text, it can hold 2048 characters
        .setImage()
        .setThumbnail()
        /*
            * Takes a Date object, defaults to current date.
            */
        .setTimestamp()
        .setURL()
        .addField("Master of the Hunt",
            xpList[0] + " XP needed.")
        .addField("Legendary Hero",
            xpList[1] + " XP needed.")
        .addField("Local Guildsmaster", //This is a field title, it can hold 256 characters
            xpList[2] + " XP needed.") //This is a field value, it can hold 1024 characters.
        .addField("Ravager of the Seas",
            xpList[3] + " XP needed.")
        .addField("Masterworks Smith",
            xpList[4] + " XP needed.")

    channel.send(tier3Command);
    console.log("Tried Sending tier 3 xp list to " + user.username);
}

function jarlxp(channel, user){
    var xpList = roleFuncs.roleXPInvestments();

    channel.send('Currently, ' + (xpList[5]) + "XP is needed to claim the Jarl's throne.");
}

async function jarldom(message, user, member){
    userObj = userFuncs.userRetrieve(user.id);

    if(roleID.confirmTier3Role(member) || member.highestRole.id == roleID.jarlID){
        roleObj = roleFuncs.getRoleObj(roleID.jarlID);
        investmentNeeded = roleObj.investedXP + 1;
        oldRoleID = member.highestRole.id;
        
        if(userObj.xp >= investmentNeeded && roleObj.userid != userObj.id){
            if(roleObj.userid != null){
                userRoles.demoteUser(roleObj.demotionRole, roleObj.userid);
            }

            userRoles.addRole(roleObj.id, member, message);
            newDemotionID = await roleID.getDemotionRole(oldRoleID);

            await roleFuncs.changeJarlRoleJSON(roleID.jarlID, newDemotionID, user.id, userObj.xp, oldRoleID);

            message.reply('you used ' + userObj.xp + "XP to claim the Jarl's throne!");
            userFuncs.resetUserXP(user.id);
        }
        else if(userObj.xp >= investmentNeeded && roleObj.userid == userObj.id){
            input = userObj.xp - investmentNeeded;
            output = Math.floor(input * 0.75);
            xpAdded = investmentNeeded + output;

            roleFuncs.inputUserToRoleJSON(member.highestRole.id, userObj.id, xpAdded)
            message.reply('along with the initial cost, ' + investmentNeeded + 'XP, 3/4ths of your extra xp, ' + input + 'XP, was reinvested to maintain control of the throne! To control the throne it now costs, ' + xpAdded + 'XP.');
            userFuncs.resetUserXP(user.id);
        }
        else if(userObj.xp < investmentNeeded) {
            message.reply('you do not have enough XP. You need ' + (investmentNeeded - userObj.xp) + ' more XP.');
        }
    }
    else {
        message.reply("you must have a tier 3 role in order to claim the Jarl's throne.");
    }
}

// export functions
module.exports.ping = ping;
module.exports.help = help;
module.exports.changeUserClass = changeUserClass;
module.exports.xpCommand = xpCommand;
module.exports.train = train;
module.exports.investXP = investXP;
module.exports.tier3 = tier3;
module.exports.jarlxp = jarlxp;
module.exports.jarldom = jarldom;