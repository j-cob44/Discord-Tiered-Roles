const fs = require("fs");

function getRoleObj(roleID){
    data = fs.readFileSync('./json/roles.json', 'utf8');
	rolesObj = JSON.parse(data); // Take JSON file and make it an OBJ

	for(i = 0; i < rolesObj.Roles.length; i++){
		if(rolesObj.Roles[i].id == roleID) {
            return rolesObj.Roles[i];
		}
	}
}

function inputUserToRoleJSON(roleID, userID, xp){
    data = fs.readFileSync('./json/roles.json', 'utf8');
    rolesObj = JSON.parse(data); // Take JSON file and make it an OBJ

	for(i = 0; i < rolesObj.Roles.length; i++){
		if(rolesObj.Roles[i].id == roleID) {
			// Check if a User currently owns the Role, if so remove and demote
			rolesObj.Roles[i].userid = userID;
			rolesObj.Roles[i].investedXP = xp;

			json = JSON.stringify(rolesObj); // Convert Data back to JSON file
			fs.writeFile('./json/roles.json', json, 'utf8', function(){
				console.log("Replaced Role Leader.");
			}); // Rewrite file
			break;
		}
	}
}

function roleXPInvestments(){
    data = fs.readFileSync('./json/roles.json', 'utf8');
    rolesObj = JSON.parse(data); // Take JSON file and make it an OBJ
    var xpList = [];

    for(i = 0; i < rolesObj.Roles.length; i++){
        xpList[i] = rolesObj.Roles[i].investedXP + 1;
    }
  
    return xpList;
}

function changeJarlRoleJSON(jarlID, roleID, userID, xp, oldRoleID){
	data = fs.readFileSync('./json/roles.json', 'utf8');
    rolesObj = JSON.parse(data); // Take JSON file and make it an OBJ

	for(i = 0; i < rolesObj.Roles.length; i++){
		if(rolesObj.Roles[i].id == jarlID) {
			// Check if a User currently owns the Role, if so remove and demote
			rolesObj.Roles[i].userid = userID;
			rolesObj.Roles[i].investedXP = xp;
			rolesObj.Roles[i].demotionId = roleID;
		}
		else if(rolesObj.Roles[i].id == oldRoleID){
			rolesObj.Roles[i].userid = null;
			rolesObj.Roles[i].investedXP = 499;
		}
	}

	json = JSON.stringify(rolesObj); // Convert Data back to JSON file
	fs.writeFile('./json/roles.json', json, 'utf8', function(){
		console.log("Replaced Jarl Role Info.");
	}); // Rewrite file
}

/*
function resetTier3Role(roleID){
	data = fs.readFileSync('./json/roles.json', 'utf8');
    rolesObj = JSON.parse(data); // Take JSON file and make it an OBJ

	for(i = 0; i < rolesObj.Roles.length; i++){
		if(rolesObj.Roles[i].id == roleID) {
			// Check if a User currently owns the Role, if so remove and demote
			rolesObj.Roles[i].userid = '';
			rolesObj.Roles[i].investedXP = 499;

			json = JSON.stringify(rolesObj); // Convert Data back to JSON file
			fs.writeFile('./json/roles.json', json, 'utf8', function(){
				console.log("Replaced Role Leader.");
			}); // Rewrite file
			break;
		}
	}
}
*/

module.exports.getRoleObj = getRoleObj;
module.exports.inputUserToRoleJSON = inputUserToRoleJSON;
module.exports.roleXPInvestments = roleXPInvestments;
module.exports.changeJarlRoleJSON = changeJarlRoleJSON;