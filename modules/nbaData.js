// const { rejects } = require("assert");

const { rejects } = require("assert");

class Nba {
  constructor(players, teams) {
    this.players = players;
    this.teams = teams;
  }
}

//read players and teams data from json files
var dataCollection = null;
module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    var playersData, teamsData;
    fs.readFile("./data/players.json", "utf8", (err, data) => {
      if (err) {
        rejects("Unable to read players.json");
      } else {
        playersData = JSON.parse(data);
        // console.log(playersData);

        fs.readFile("./data/teams.json", "utf8", (err, data) => {
          if (err) {
            rejects("Unable to read teams.json");
          } else {
            teamsData = JSON.parse(data);
            // console.group(teamsData);
            dataCollection = new Nba(playersData, teamsData);
            resolve();
          }
        });
      }
    });
  });
};

module.exports.getAllPlayers = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.players.length === 0) {
      reject("No results returned!");
    } else {
      resolve(dataCollection.players);
    }
  });
};

module.exports.getAllTeams = function () {
  return new Promise((resolve, reject) => {
    if (dataCollection.teams.length === 0) {
      reject("No results returned!");
    } else {
      resolve(dataCollection.teams);
    }
  });
};

module.exports.getTeamByName = function (teamName) {
  return new Promise((resolve, reject) => {
    // console.log(teamName);
    players = [];
    let id = -1;
    // let len = dataCollection.players.length;
    for (team of dataCollection.teams) {
      if (team.teamName.toLowerCase() === teamName.toLowerCase()) {
        id = team.teamId;
      }
    }
    if (id === -1) {
      reject("No team found with this name");
    } else {
      for (player of dataCollection.players) {
        if (player.teamId === id) {
          players.push(player);
        }
      }
      if (players.length === 0) {
        reject("No team found with this name");
      } else {
        resolve(players);
      }
    }
  });
};

module.exports.getTeamsByLocation = function (location) {
  return new Promise((resolve, reject) => {
    teams = [];
    if (location == null) {
      reject("No location provided");
    } else {
      for (team of dataCollection.teams) {
        if (team.location.toLowerCase() === location.toLowerCase()) {
          teams.push(team);
        }
      }
      if (teams.length === 0) {
        reject("No team found in this location!");
      } else {
        resolve(teams);
      }
    }
  });
};

module.exports.getPlayersByLastName = function (surname) {
  return new Promise((resolve, reject) => {
    players = [];
    for (player of dataCollection.players) {
      if (surname.toLowerCase() === player.lastName.toLowerCase()) {
        players.push(player);
      }
    }
    if (players.length === 0) {
      reject("No player found with this surname");
    } else {
      resolve(players);
    }
  });
};
