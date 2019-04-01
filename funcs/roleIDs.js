// TIER 1 ROLES
var hunterID = '540445086589386752';
var warriorID = '540445125709398016';
var traderID = '540790596017848321';
var sailorID = '540445273541967882';
var blacksmithID = '540445293955514370';
var tier1Roles = [hunterID, warriorID, traderID, sailorID, blacksmithID];

// TIER 2 ROLES
var huntsmanID = '540790929813143553';
var championID = '540443740133785601';
var merchantID = '540445834467344385';
var captainID = '540443985580130344';
var swordsmithID = '540791365051875338';
var tier2Roles = [huntsmanID, championID, merchantID, captainID, swordsmithID];

// TIER 3 ROLES
var huntMasterID = '540443707627798528';
var legendID = '540790271626051584';
var guildsmasterID = '540443897374048266';
var ravagerID = '540791580244705280';
var mastersmithID = '540444118401417216';
var tier3Roles = [huntMasterID, legendID, guildsmasterID, ravagerID, mastersmithID];

// JARL ROLE
var jarlID = '532066990773501973';

// Check functions
function confirmTier1Role(member){
    return tier1Roles.includes(member.highestRole.id);
}

function confirmTier2Role(member){
    return tier2Roles.includes(member.highestRole.id);
}

function confirmTier3Role(member){
    return tier3Roles.includes(member.highestRole.id);
}

function getNextRole(member, message){
    switch (member.highestRole.id){
        //Tier 1s
        case hunterID:
            message.reply('you are now a Renowned Huntsman!');
            return huntsmanID;
        break;
        case warriorID:
            message.reply('you are now a Champion Fighter!');
            return championID;
        break;
        case traderID:
            message.reply('you are now a Successful Merchant!');
            return merchantID;
        break;
        case sailorID:
            message.reply('you are now a Longship Captain!');
            return captainID;
        break;
        case blacksmithID:
            message.reply('you are now a Intricate Swordsmith!');
            return swordsmithID;
        break;
        //Tier 2s
        case huntsmanID:
            return huntMasterID;
        break;
        case championID:
            return legendID;
        break;
        case merchantID:
            return guildsmasterID;
        break;
        case captainID:
            return ravagerID;
        break;
        case swordsmithID:
            return mastersmithID;
        break;
        // other?
        default:
            console.log('got weird role from user while trying to upgrade')
        break;
    }
}

function getDemotionRole(roleID){
    switch(roleID){
        case huntMasterID:
            return hunterID;
        break;
        case legendID:
            return warriorID;
        break;
        case guildsmasterID:
            return traderID;
        break;
        case ravagerID:
            return sailorID;
        break;
        case mastersmithID:
            return blacksmithID;
        break;
    }
}

// role ids
module.exports.hunterID = hunterID;
module.exports.warriorID = warriorID;
module.exports.traderID = traderID;
module.exports.sailorID = sailorID;
module.exports.blacksmithID = blacksmithID;

module.exports.huntsmanID = huntsmanID;
module.exports.championID = championID;
module.exports.merchantID = merchantID;
module.exports.captainID = captainID;
module.exports.swordsmithID = swordsmithID;

module.exports.huntMasterID = huntMasterID;
module.exports.legendID = legendID;
module.exports.guildsmasterID = guildsmasterID;
module.exports.ravagerID = ravagerID;
module.exports.mastersmithID = mastersmithID;

module.exports.jarlID = jarlID;

// functions
module.exports.confirmTier1Role = confirmTier1Role;
module.exports.confirmTier2Role = confirmTier2Role;
module.exports.confirmTier3Role = confirmTier3Role;
module.exports.getNextRole = getNextRole;
module.exports.getDemotionRole = getDemotionRole;