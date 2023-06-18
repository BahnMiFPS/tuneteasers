import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

function CountDownComponent({ countdown, isWaitingForQuestions }) {
  const [count, setCount] = useState(countdown);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setCount(countdown);
  }, [countdown]);

  return (
    <Box
      sx={{
        zIndex: 9999,
        textAlign: "center",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      {isWaitingForQuestions ? (
        <Box>
          <CircularProgress />
          <Typography
            variant="subtitle2"
            style={{ color: "white", marginTop: "1rem" }}
          >
            Generating Questions...
          </Typography>
        </Box>
      ) : (
        <Typography variant="h1" style={{ marginTop: "1rem" }}>
          {count}
        </Typography>
      )}
    </Box>
  );
}

export default CountDownComponent;
