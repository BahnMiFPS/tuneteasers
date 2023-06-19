import React, { useEffect, useState } from "react"
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import PlaylistsRow from "../components/Rows/PlaylistsRow"
import socket from "../app/socket"
import { Stack } from "@mui/material"
import CountDownComponent from "../components/WaitingLobby/CountDownComponent"

import GenreChipsSwiper from "../components/Rows/GenreChipsSwiper"
import { allowedCountries } from "../api/requests"

function ConfigureRoom() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [chosenCard, setChosenCard] = useState("")
  const [startGameCountdown, setStartGameCountdown] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const { state } = useLocation()
  const [isWaitingForQuestions, setIsWaitingForQuestions] = useState(false)
  const [country, setCountry] = useState("VN")
  const [locale, setLocale] = useState("vi_VN")
  const [genreList, setGenreList] = useState([])
  const [currentGenre, setCurrentGenre] = useState("toplists")

  const handleCardClick = (id) => {
    setChosenCard(id)
  }

  const handleDropDownChange = (event) => {
    const { code, locale } = event.target.value
    setCountry(code)
    setLocale(locale)
  }
  const handleStartCountdown = () => {
    setIsWaitingForQuestions(false)
    setStartGameCountdown(true)
    let countdownValue = 3
    setCountdown(countdownValue)

    const countdownInterval = setInterval(() => {
      countdownValue--
      setCountdown(countdownValue)

      if (countdownValue === 0) {
        clearInterval(countdownInterval)
        setStartGameCountdown(false)
        socket.emit("start_game", {
          roomId: parseInt(roomId),
        })
      }
    }, 1000)
  }

  const handleStartGame = () => {
    socket.emit("picked_music_starting_game", {
      roomId: parseInt(roomId),
      playlistId: chosenCard,
    })
  }

  const handleGeneratingQuestions = () => {
    setIsWaitingForQuestions(true)
  }

  useEffect(() => {
    const handleNavigateToPlay = (data) => {
      navigate(`/play/${data}`, {
        replace: true,
      })
    }

    socket.on("countdown_start", handleStartCountdown)
    socket.on("game_started", handleNavigateToPlay)
    socket.on("generating_questions", handleGeneratingQuestions)

    return () => {
      socket.off("game_started", handleNavigateToPlay)
      socket.off("generating_questions", handleGeneratingQuestions)
    }
  }, [roomId])

  return (
    <Container style={{ height: "100vh", padding: "2rem" }}>
      <Stack
        direction="column"
        spacing={2}
        style={{
          height: "100%",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={2}>
          <Stack alignItems={"center"} justifyContent={"center"}>
            <Typography variant="h4" color="white">
              Waiting for Host to pick a playlist...
            </Typography>
          </Stack>
          <Grid
            container
            alignItems={"baseline"}
            justifyContent={"space-between"}
          >
            <Grid item xs={12} sm={2}>
              <FormControl fullWidth>
                <InputLabel color="text" id="demo-simple-select-label">
                  Country
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={country.code}
                  label="Country"
                  onChange={handleDropDownChange}
                  variant="outlined"
                  color="warning"
                  style={{ color: "white" }}
                >
                  {allowedCountries.map((country) => (
                    <MenuItem value={country}>
                      <Typography variant="body1">{country.name}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={9} flexGrow={1}>
              <GenreChipsSwiper
                genreList={genreList}
                setCurrentGenre={setCurrentGenre}
                currentGenre={currentGenre}
                setGenreList={setGenreList}
                country={country}
                locale={locale}
              />
            </Grid>
          </Grid>
        </Stack>
        <Stack flex={1} justifyContent={"center"}>
          <PlaylistsRow
            currentGenre={currentGenre}
            country={country}
            handleCardClick={handleCardClick}
            chosenCard={chosenCard}
          />
        </Stack>
        <Box alignSelf={"center"}>
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
  )
}

export default ConfigureRoom
