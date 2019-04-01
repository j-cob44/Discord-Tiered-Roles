const fs = require("fs");

function userRetrieve(userID){
    var unknownUser = true;
    var currentUser = {};
	

	var usersJSON = fs.readFileSync('./json/users.json');
	var users = JSON.parse(usersJSON);
	//console.log(users.Users);

	for(var i = 0; i < users.Users.length; i++) {
		if(users.Users[i].id == userID){
			unknownUser = false;
			currentUser = users.Users[i];
		}
	}

	if(unknownUser){
		addUserToJSON(userID);
	}

    return currentUser;
}

function addUserToJSON(userID){
	fs.readFile('./json/users.json', 'utf8', function readFileCallback(err, data){
		if (err){
			console.log(err);
		} else {
		obj = JSON.parse(data); // Take JSON file and make it an OBJ
	
			var newUser = {
				"id": userID,
				"xp": 0,
				"nextTimeToTrain": 0,
				"nextXPAward": 0
			};
	
		obj.Users.push(newUser); // Add new Data
		json = JSON.stringify(obj); // Convert Data back to JSON file
		fs.writeFile('./json/users.json', json, 'utf8', function(){
				console.log("Writing to File");
			}); // Rewrite file
		}
	});
}

function trainUser(userID, xpChange, trainingTime){
	fs.readFile('./json/users.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    usersObj = JSON.parse(data); // Take JSON file and make it an OBJ

		for(i = 0; i < usersObj.Users.length; i++){
			if(usersObj.Users[i].id == userID){
				usersObj.Users[i].xp += xpChange;
				usersObj.Users[i].nextTimeToTrain = (trainingTime + 3600000);
			}
		}

    json = JSON.stringify(usersObj); // Convert Data back to JSON file
    fs.writeFile('./json/users.json', json, 'utf8', function(){
			console.log("Writing to File");
		}); // Rewrite file
	}});
}

function subtractXP(userID, xpChange){
	fs.readFile('./json/users.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    usersObj = JSON.parse(data); // Take JSON file and make it an OBJ

		for(i = 0; i < usersObj.Users.length; i++){
			if(usersObj.Users[i].id == userID){
				usersObj.Users[i].xp -= xpChange;
			}
		}

    json = JSON.stringify(usersObj); // Convert Data back to JSON file
    fs.writeFile('./json/users.json', json, 'utf8', function(){
			console.log("Writing to File");
		}); // Rewrite file
	}});
}

function resetUserXP(userID){
	fs.readFile('./json/users.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    usersObj = JSON.parse(data); // Take JSON file and make it an OBJ

		for(i = 0; i < usersObj.Users.length; i++){
			if(usersObj.Users[i].id == userID){
				usersObj.Users[i].xp = 0;
			}
		}

    json = JSON.stringify(usersObj); // Convert Data back to JSON file
    fs.writeFile('./json/users.json', json, 'utf8', function(){
			console.log("Writing to File");
		}); // Rewrite file
	}});
}

module.exports.userRetrieve = userRetrieve;
module.exports.trainUser = trainUser;
module.exports.subtractXP = subtractXP;
module.exports.resetUserXP = resetUserXP;