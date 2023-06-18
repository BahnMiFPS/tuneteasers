import { Button, Grid, TextField, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../../app/socket";
function JoinRoomForm() {
  const theme = useTheme();
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();
  const { roomId } = useParams();
  useEffect(() => {
    const generatedName = faker.person.firstName();
    setPlayerName(generatedName);
    formik.setFieldValue("name", generatedName);
  }, []);

  const formik = useFormik({
    initialValues: {
      name: playerName,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Username is invalid"),
    }),
    onSubmit: (values) => {
      const data = { name: values.name, roomId: parseInt(roomId) };
      socket.emit("join_room", data);
      window.localStorage.setItem(
        "userInfo",
        JSON.stringify({
          roomId,
          isOwner: false,
        })
      );
      navigate(`/lobby/${roomId}`, {
        replace: true,
        state: data,
      });
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      width={"100%"}
      component={"form"}
      onSubmit={formik.handleSubmit}
    >
      <Grid item xs={12}>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.name}
          helperText={formik.touched.name && formik.errors.name}
          variant="filled"
          margin="normal"
          fullWidth
          id="name"
          hiddenLabel
          name="name"
          autoComplete="off"
          color="info"
          sx={{
            backgroundColor: theme.palette.background.paper,
            "& .MuiInputBase-input": {
              textAlign: "center",
              color: "white",
            },
          }}
        />
      </Grid>

      <Button type="submit" fullWidth variant="contained" color="warning">
        Join Room
      </Button>
    </Grid>
  );
}

export default JoinRoomForm;
