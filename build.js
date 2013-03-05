
var fs = require('fs')

var regionsSrcFile = __dirname + "/data/regions.json";
var regionsJSON = fs.readFileSync(regionsSrcFile, "utf8");

var regionsDestFile = __dirname + "/www/regions.js";

fs.writeFileSync(regionsDestFile, "BRACKET.regions="+regionsJSON);


var teamsSrcFile = __dirname + "/data/teams.json";
var teamsJSON = fs.readFileSync(teamsSrcFile, "utf8");

var teamsDestFile = __dirname + "/www/teams.js";

fs.writeFileSync(teamsDestFile, "BRACKET.teams="+teamsJSON);

