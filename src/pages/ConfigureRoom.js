import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { requests } from "../api/requests";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PlaylistsRow from "../components/Rows/PlaylistsRow";
import socket from "../app/socket";
import { Stack } from "@mui/material";
import CountDownComponent from "../components/WaitingLobby/CountDownComponent";

function ConfigureRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [chosenCard, setChosenCard] = useState("");
  const [startGameCountdown, setStartGameCountdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const { state } = useLocation();
  const [isWaitingForQuestions, setIsWaitingForQuestions] = useState(false);

  const handleCardClick = (id) => {
    setChosenCard(id);
  };

  const handleStartCountdown = () => {
    setIsWaitingForQuestions(false);
    setStartGameCountdown(true);
    let countdownValue = 3;
    setCountdown(countdownValue);

    const countdownInterval = setInterval(() => {
      countdownValue--;
      setCountdown(countdownValue);

      if (countdownValue === 0) {
        clearInterval(countdownInterval);
        setStartGameCountdown(false);
        socket.emit("start_game", {
          roomId: parseInt(roomId),
        });
      }
    }, 1000);
  };

  const handleStartGame = () => {
    socket.emit("picked_music_starting_game", {
      roomId: parseInt(roomId),
      playlistId: chosenCard,
    });
  };

  const handleGeneratingQuestions = () => {
    setIsWaitingForQuestions(true);
  };

  useEffect(() => {
    const handleNavigateToPlay = (data) => {
      navigate(`/play/${data}`, {
        replace: true,
      });
    };

    socket.on("countdown_start", handleStartCountdown);
    socket.on("game_started", handleNavigateToPlay);
    socket.on("generating_questions", handleGeneratingQuestions);

    return () => {
      socket.off("game_started", handleNavigateToPlay);
      socket.off("generating_questions", handleGeneratingQuestions);
    };
  }, [roomId]);

  return (
    <Container style={{ height: "100vh" }}>
      <Stack
        direction="column"
        style={{
          height: "100%",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" color="white" textAlign="center" mt={3}>
          Waiting for Host to pick a playlist...
        </Typography>
        <Stack>
          {requests.map((category, index) => (
            <PlaylistsRow
              title={category.name}
              url={category.url}
              key={index}
              handleCardClick={handleCardClick}
              chosenCard={chosenCard}
            />
          ))}
        </Stack>
        <Box alignSelf={"center"} mb={3}>
          <Button
            onClick={handleStartGame}
            type="submit"
            disabled={chosenCard !== "" && state ? false : true}
            variant="contained"
            color="warning"
          >
            Start Game
          </Button>
        </Box>
      </Stack>

      {isWaitingForQuestions ? (
        <CountDownComponent isWaitingForQuestions={isWaitingForQuestions} />
      ) : (
        startGameCountdown && <CountDownComponent countdown={countdown} />
      )}
    </Container>
  );
}

export default ConfigureRoom;
