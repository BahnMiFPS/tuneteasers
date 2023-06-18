import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { LinearProgress } from "@mui/material";

export default function LinearWithValueLabel({ progress, setProgress }) {
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 10 : prevProgress + 10
      );
    }, 800);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            color="error"
          />
        </Box>
        {/* <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            progress
          )}%`}</Typography>
        </Box> */}
      </Box>
    </Box>
  );
}
