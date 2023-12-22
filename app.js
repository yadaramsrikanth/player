const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;
app.use(express.json());
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("successfully");
    });
  } catch (e) {
    console.log("ERROR");
    process.exit(1);
  }
};
initializeDBAndServer();
module.exports = app;

// PLAYERS API
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT * FROM cricket_team ORDER BY player_id;`;
  const booksArray = await db.all(getPlayersQuery);
  response.send(booksArray);
});

// POST API
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
  INSERT INTO cricket_team
  (player_name,jersey_number,role)
  VALUES
  (${playerName},
   ${jerseyNumber},
  ${role});`;

  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});
// PLayers API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
  SELECT * FROM cricket_team
  WHERE
 player_id=${playerId}`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});
//UPDATE
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayer = `
  UPDATE cricket_team
  SET
  player_name=${playerName},
  jersey_number=${jerseyNumber},
  role=${role}
  WHERE
  player_id= ${playerId};`;
  await db.run(updatePlayer);
  response.send("Player Details Updated");
});

//DELETE
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
  DELETE  FROM cricket_team
  WHERE
  player_id=${playerId}`;
  await db.run(getPlayerQuery);
  response.send("Player Removed");
});
