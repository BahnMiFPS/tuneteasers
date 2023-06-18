import React, { useEffect } from "react";
import { Container, Grid, Stack, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import socket from "../app/socket";
import SignInForm from "../components/Forms/SignInForm";

function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const handleCreateRoomInstead = () => {
      // setOpenSnackbar(true);
      navigate(`/`, { replace: true });
    };
    socket.on("no_room_found", handleCreateRoomInstead);

    return () => {
      socket.off("no_room_found", handleCreateRoomInstead);
    };
  }, []);
  return (
    <Container fixed maxWidth="sm">
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        gap={2}
      >
        <img src="/logo.svg" alt="Logo" style={{ maxWidth: "120px" }} />
        <Typography variant="h5" align="center" color="white">
          Ready to test your music knowledge?
        </Typography>
        <Outlet />
      </Stack>
    </Container>
  );
}

export default HomePage;
