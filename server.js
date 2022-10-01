const path = require("path");
const nbaData = require("./modules/nbaData.js");

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();

const Sequelize = require("sequelize");

// set up sequelize to point to our postgres database
var sequelize = new Sequelize(
  "gpthxygv",
  "gpthxygv",
  "s-y1L1iSdxYod2ohe5smaQkrnvObRwrR",
  {
    host: "jelani.db.elephantsql.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false },
    },
    query: { raw: true },
  }
);

sequelize
  .authenticate()
  .then(function () {
    console.log("Connection has been established successfully.");
  })
  .catch(function (err) {
    console.log("Unable to connect to the database:", err);
  });

var NbaTeams = sequelize.define(
  "NBA-Teams",
  {
    teamId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    teamName: Sequelize.STRING,
    simpleName: Sequelize.STRING,
    location: Sequelize.STRING,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

var NbaPlayers = sequelize.define(
  "NBA-Players",
  {
    playerId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    teamId: Sequelize.INTEGER,
  },
  {
    createdAt: false, // disable createdAt
    updatedAt: false, // disable updatedAt
  }
);

sequelize.sync().then(function () {
  nbaData
    .getAllTeams()
    .then(function (data) {
      let teams = data;
      for (team of teams) {
        NbaTeams.create({
          teamId: team.teamId,
          teamName: team.teamName,
          simpleName: team.simpleName,
          location: team.location,
        })
          .then(function (project) {
            // console.log("successfully added in Teams!");
          })
          .catch(function (error) {
            // console.log("something went wrong adding in Teams!");
          });
      }
    })
    .catch((err) => {
      // res.json({ message: "No teams found" });
      console.log(err);
    });

  nbaData
    .getAllPlayers()
    .then(function (data) {
      let players = data;
      for (player of players) {
        NbaPlayers.create({
          playerId: player.playerId,
          firstName: player.firstName,
          lastName: player.lastName,
          teamId: player.teamId,
        })
          .then(function (project) {
            // console.log("successfully added in Players!");
          })
          .catch(function (error) {
            console.log("something went wrong adding in Players!");
          });
      }
    })
    .catch((err) => {
      // res.json({ message: "No teams found" });
      console.log(err);
    });
});

nbaData
  .initialize()
  .then(function (msg) {
    console.log(msg);
    app.listen(HTTP_PORT, () => {
      console.log("server listening on port: " + HTTP_PORT);
    });
  })
  .catch(function (err) {
    console.log(err);
  });
