import React from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";

export const TextInput = ({ handleInputChange, handleFormSubmit, message }) => {
  return (
    <Box sx={{ padding: 1, width: "100%" }}>
      <form
        onSubmit={handleFormSubmit}
        noValidate
        autoComplete="off"
        sx={{ width: "100%" }}
      >
        <Grid
          container
          noValidate
          autoComplete="off"
          direction="row"
          spacing={1}
          justifyContent="space-between"
          sx={{ width: "100%", padding: 1 }}
        >
          <Grid item xs={12} sm={8}>
            <TextField
              placeholder="Say Something"
              variant="standard"
              fullWidth
              id="standard-text"
              value={message}
              onChange={handleInputChange}
              inputProps={{ style: { color: "white" } }}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: "right" }}>
            <Button
              type="submit"
              size="small"
              variant="contained"
              startIcon={<Send />}
            >
              SEND
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
