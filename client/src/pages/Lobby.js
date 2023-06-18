import React, { useEffect, useState } from "react";
import {
  Typography,
  Snackbar,
  CircularProgress,
  Stack,
  Container,
  Grid,
  Hidden,
} from "@mui/material";
import ChatBox from "../components/ChatBox/ChatBox";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import socket from "../app/socket";
import LobbyContent from "../components/WaitingLobby/LobbyContent";

const SOCKET_EVENTS = {
  START_CHOOSING_MUSIC: "start_choosing_music",
  NEW_PLAYER_JOINED: "new_player_joined",
  MESSAGE_SENT: "message_sent",
  NEW_GAME_MODE: "new_game_mode",
};

function Lobby() {
  const { state } = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messageReceived, setMessageReceived] = useState("");
  const [playerList, setPlayerList] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [songNumbers, setSongNumbers] = useState(5);
  const [gameMode, setGameMode] = useState("Normal");

  const checkIsOwner = (playerList, socketId) => {
    if (playerList.length > 0) {
      const thisPlayer = playerList.find((player) => player.id === socketId);
      return thisPlayer.owner;
    } else return false;
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.origin + `/invite/${roomId}`);
    setOpenSnackbar(true);
  };

  const handleStartPickingMusic = () => {
    socket.emit("pick_music", {
      roomId: parseInt(roomId),
      gameMode,
      songNumbers,
    });
  };

  const handleNavigateToConfigureRoom = ({ roomId, playerList }) => {
    const isThisOwner = checkIsOwner(playerList, socket.id);
    navigate(`/configure/${roomId}`, {
      replace: true,
      state: isThisOwner,
    });
  };

  const handleNewPlayer = (data) => {
    setPlayerList(data.players);
    setIsLoading(data.isLoading);
  };

  const handleChangeGameMode = (event, newGameMode) => {
    setGameMode(newGameMode);
    socket.emit("update_game_mode", { newGameMode, roomId });
  };
  const handleUpdateGameMode = ({ newGameMode }) => {
    setGameMode(newGameMode);
  };

  const handleChangeSongNumbers = (event, newSongNumbers) => {
    setSongNumbers(newSongNumbers);
    socket.emit("update_song_numbers", { newSongNumbers, roomId });
  };

  const handleUpdateSongNumbers = ({ newSongNumbers }) => {
    setSongNumbers(newSongNumbers);
  };

  useEffect(() => {
    socket.emit("join_room", { name: state.name, roomId: parseInt(roomId) });

    const handleMessage = (data) => {
      setMessageReceived(data);
    };
    socket.on("new_game_mode", handleUpdateGameMode);
    socket.on("new_song_numbers", handleUpdateSongNumbers);

    socket.on(
      SOCKET_EVENTS.START_CHOOSING_MUSIC,
      handleNavigateToConfigureRoom
    );
    socket.on(SOCKET_EVENTS.NEW_PLAYER_JOINED, handleNewPlayer);
    socket.on(SOCKET_EVENTS.MESSAGE_SENT, handleMessage);

    return () => {
      socket.off(
        SOCKET_EVENTS.START_CHOOSING_MUSIC,
        handleNavigateToConfigureRoom
      );
      socket.off(SOCKET_EVENTS.MESSAGE_SENT, handleMessage);
    };
  }, [state.name, roomId, navigate]);

  return (
    <Container fixed>
      <Stack
        spacing={2}
        sx={{ height: "100vh" }}
        justifyContent="center"
        alignItems="center"
      >
        {isLoading ? (
          <Stack
            spacing={2}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress color="info" size="3rem" />
            <Typography variant="h5" color="white">
              Initial Handshake
            </Typography>
          </Stack>
        ) : (
          <Grid container spacing={4}>
            <Grid item sm={6} xs={12}>
              <LobbyContent
                playerList={playerList}
                roomId={roomId}
                songNumbers={songNumbers}
                setSongNumbers={setSongNumbers}
                gameMode={gameMode}
                checkIsOwner={checkIsOwner}
                handleStartPickingMusic={handleStartPickingMusic}
                handleChangeGameMode={handleChangeGameMode}
                handleShareClick={handleShareClick}
                handleChangeSongNumbers={handleChangeSongNumbers}
              />
            </Grid>
            <Hidden smDown>
              <Grid
                item
                sm={6}
                container
                justifyContent="center"
                alignItems="stretch"
              >
                <ChatBox />
              </Grid>
            </Hidden>
          </Grid>
        )}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Copied to clipboard
          </Alert>
        </Snackbar>
      </Stack>
    </Container>
  );
}

export default Lobby;
