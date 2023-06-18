import React from "react";
import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import { amber, grey, brown } from "@mui/material/colors";
import socket from "../../app/socket";

function LobbyLeaderboard({ leaderboard }) {
  function compareScores(a, b) {
    return b.score - a.score; // Sort in descending order based on score
  }

  const sortedLeaderboard = leaderboard?.sort(compareScores);

  return (
    <Box maxHeight="400px" sx={{ overflowY: "scroll", paddingRight: "16px" }}>
      <Container maxWidth="sm">
        <Typography variant="h5" color="white" align="left">
          Leaderboard
        </Typography>
        {sortedLeaderboard?.map((player, index) => (
          <Paper
            elevation={3}
            sx={{
              backgroundColor:
                index === 0
                  ? amber[500] // Yellow for the first place
                  : index === 1
                  ? grey[500] // Silver for the second place
                  : index === 2
                  ? brown[500] // Bronze for the third place
                  : "white", // Default background color
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 1,
              marginBottom: 2,
              width: "100%",
            }}
            key={index}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Avatar src={player.image} />
              <Typography variant="h5" color="black">
                {player.id === socket.id ? "YOU" : player.name}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" color="black">
                {player.score} pts
              </Typography>
            </Box>
          </Paper>
        ))}
      </Container>
    </Box>
  );
}

export default LobbyLeaderboard;
