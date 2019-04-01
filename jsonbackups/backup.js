const fs = require("fs");

async function backup(){
    var date = new Date();
    time = date.getHours() + 'h' + date.getMinutes() + 'm' + date.getMonth() + '-' + date.getDate() + '-' + date.getFullYear();

    // USERS BACKUP
    fs.readFile('./json/users.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    usersObj = JSON.parse(data); // Take JSON file and make it an OBJ
    usersfilename = './jsonbackups/users-' + time + '.json';
    userjson = JSON.stringify(usersObj); // Convert Data back to JSON file
    fs.writeFile(usersfilename, userjson, 'utf8', function(){
            console.log("Writing User Backup");
        }); // Rewrite file
    }});


    // ROLES BACKUP
    fs.readFile('./json/roles.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    rolesObj = JSON.parse(data); // Take JSON file and make it an OBJ
    rolesfilename = './jsonbackups/roles-' + time + '.json';
    rolejson = JSON.stringify(rolesObj); // Convert Data back to JSON file
    fs.writeFile(rolesfilename, rolejson, 'utf8', function(){
            console.log("Writing Roles Backup");
        }); // Rewrite file
    }});

}

module.exports.backup = backup;