const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
const { getQuestion, generateRoomQuestions } = require("./utils/getQuestion")
const { getPlayListByCountry } = require("./utils/fetchPlaylist")
const { getAccessToken } = require("./utils/spotify")
const app = express()
const { faker } = require("@faker-js/faker")

app.use(cors())

const server = http.createServer(app)
const port = process.env.PORT || 3001
const clientAppOrigin =
  process.env.NODE_ENV === "production"
    ? "https://tune-teasers.vercel.app"
    : "http://localhost:3000"
const io = new Server(server, {
  cors: {
    origin: clientAppOrigin,
    methods: ["GET", "POST"],
  },
})

// Access token variable to store the token
let accessToken = null

// Get access token during server startup or when needed for the first time
;(async () => {
  try {
    accessToken = await getAccessToken()
  } catch (error) {
    console.error("Failed to obtain access token:", error)
    process.exit(1)
  }
})()

app.get("/", (req, res) => {
  res.send("Hello, this is Tune Teasers!")
})

app.get("/api/playlists", async (req, res) => {
  const { country, locale } = req.query
  try {
    const playlists = await getPlayListByCountry(country, locale, accessToken)
    const playlistData = playlists.playlists.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      image: playlist.images[0].url,
    }))
    res.json({ data: playlistData })
  } catch (error) {
    console.error("Error fetching playlists:", error)
    res.status(500).json({ error: "Failed to fetch playlists" })
  }
})

const rooms = new Map() // Map to store rooms and players

io.on("connection", (socket) => {
  function findRoomIdBySocketId(socketId) {
    for (const [roomId, room] of rooms.entries()) {
      const playerIndex = room.players.findIndex(
        (player) => player.id === socketId
      )
      if (playerIndex !== -1) {
        return roomId
      }
    }
    return null // Socket ID not found in any room
  }

  socket.on("create_room", (data) => {
    const { name, roomId } = data
    socket.join(parseInt(roomId))
    const randomImage = faker.image.urlLoremFlickr({ category: "cat" })
    const player = {
      id: socket.id,
      name,
      score: 0,
      image: randomImage,
      owner: true,
    }
    // Create a room object with players array, gameStarted flag, and currentQuestionIndex

    const room = {
      players: [player],
      gameStarted: false,
      songNumbers: null,
      gameMode: null,
      // currentQuestionIndex: 2, // running 2 just for stress test
      currentQuestionIndex: -1,
      currentAnswers: 0,
      currentCorrectAnswers: 0,
      messages: [],
      questions: [],
    }
    rooms.set(roomId, room)
    console.log("create_room", roomId)
    io.in(roomId).emit("new_player_joined", { players: room.players })
  })

  socket.on("join_room", (data) => {
    const { name, roomId } = data
    const room = rooms.get(roomId)
    if (!room || room.gameStarted) {
      socket.emit("join_room_error", { message: "Room not found" })
      return
    } else {
      // Create a new player object with a unique ID and score
      const randomImage = faker.image.urlLoremFlickr({ category: "cat" })

      const player = {
        id: socket.id,
        name,
        score: 0,
        image: randomImage,
        owner: false,
      }

      // Get the room object from the rooms map
      if (!room) {
        socket.emit("no_room_found", { player, roomId })
      }
      socket.emit("join_room_success", { name: player.name, roomId })

      socket.join(roomId)
      const playerExists = room.players.some((p) => p.id === player.id)
      // Check if the player already exists in the room
      if (!playerExists) {
        room.players.push(player)
      }
      io.in(roomId).emit("new_player_joined", {
        players: room.players,
        isLoading: false,
      })
    }
  })
  socket.on("send_message", (data) => {
    const { roomId, message } = data
    const room = rooms.get(roomId)
    if (!room) {
      socket.emit("no_room_found")
      return
    }

    if (room.gameStarted) {
      socket.emit("no_room_found")
    }
    const senderIndex = room.players.findIndex(
      (player) => player.id === socket.id
    )
    const sender = room.players[senderIndex]

    const newMessage = {
      sender: socket.id,
      message,
      displayName: sender.name,
      photoURL: sender.image,
    }
    room.messages.push(newMessage)
    io.in(roomId).emit("message_sent", newMessage)
  })

  socket.on("picked_music_starting_game", async ({ roomId, playlistId }) => {
    console.log("picked_music_starting_game")
    const room = rooms.get(roomId)
    if (!room) {
      socket.emit("no_room_found")
      return
    }
    if (room) {
      room.gameStarted = true
      try {
        // Emit "generating_questions" event to inform the room that questions are being generated
        io.in(roomId).emit("generating_questions", roomId)

        const roomQuestions = await generateRoomQuestions(
          playlistId,
          room.songNumbers
        )
        room.questions = roomQuestions

        // Proceed with answering questions or emitting events to users
        io.in(roomId).emit("countdown_start", roomId)
      } catch (error) {
        console.error(
          `Questions not found for index: ${roomId}. Error: ${error}`
        )
        socket.emit("questions_error", error.message)
      }
    }
  })

  socket.on("start_game", ({ roomId }) => {
    io.in(roomId).emit("game_started", roomId)
  })

  socket.on("room_game_init", (roomId) => {
    const room = rooms.get(roomId)
    if (!room) {
      socket.emit("no_room_found")
      return
    }
    const players = room.players
    io.in(roomId).emit("leaderboard_updated", players)
    io.in(roomId).emit("question_init", room.gameMode)
  })

  socket.on("update_game_mode", ({ newGameMode, roomId }) => {
    io.in(parseInt(roomId)).emit("new_game_mode", { newGameMode })
  })
  socket.on("update_song_numbers", ({ newSongNumbers, roomId }) => {
    io.in(parseInt(roomId)).emit("new_song_numbers", { newSongNumbers })
  })
  socket.on("pick_music", ({ roomId, gameMode, songNumbers }) => {
    const room = rooms.get(roomId)
    if (!room) {
      socket.emit("no_room_found")
      return
    }
    console.log("pick music")
    room.songNumbers = songNumbers
    room.gameMode = gameMode
    io.in(roomId).emit("start_choosing_music", {
      roomId,
      playerList: room.players,
    })
  })
  socket.on("leave_room", (roomId) => {
    const room = rooms.get(roomId)
    if (!room) {
      socket.emit("no_room_found")
      return
    }
    const playerIndex = room.players.findIndex(
      (player) => player.id === socket.id
    )
    room.players.splice(playerIndex, 1)
    io.in(roomId).emit("leaderboard_updated", room.players)
    socket.leave(roomId)
  })

  socket.on("disconnect", () => {
    // Handle disconnection
    const roomId = findRoomIdBySocketId(socket.id)
    if (roomId) {
      const room = rooms.get(roomId)
      if (!room) {
        socket.emit("no_room_found")
        return
      }
      const playerIndex = room.players.findIndex(
        (player) => player.id === socket.id
      )
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1)
        io.in(roomId).emit("leaderboard_updated", room.players)
      }
    }
  })

  socket.on("disconnect", function () {
    console.log("disconnected event")
  })

  socket.on("chosen_answer", async ({ answerIndex, roomId }) => {
    const room = rooms.get(roomId)
    if (!room) {
      socket.emit("no_room_found")
      return
    }

    const question = getQuestion(room.currentQuestionIndex, room.questions)

    if (!question) {
      console.log(
        `Question not found for index: Room currentQuestionIndex: ${room.currentQuestionIndex}, room questions: ${room.questions}`
      )
      return
    }
    const isCorrect = question.options[answerIndex] === question.correctAnswer
    const playerIndex = room.players.findIndex(
      (player) => player.id === socket.id
    )
    room.currentAnswers += 1

    // returning answer to players
    if (isCorrect) {
      room.currentCorrectAnswers += 1
      if (room.currentCorrectAnswers === 1) {
        room.players[playerIndex].score += 2
      } else {
        room.players[playerIndex].score += 1
      }
      socket.emit("correct_answer", answerIndex)
      console.log("correct_answer", question.correctAnswer)
      io.in(roomId).emit("leaderboard_updated", room.players)
    } else {
      socket.emit("wrong_answer")
      console.log(`wrong_answer`)
    }

    if (room.currentAnswers === room.players.length) {
      io.in(roomId).emit("all_players_answered")
    }
  })

  let roundCountdown

  socket.on("next_question", (roomId) => {
    const room = rooms.get(roomId)
    if (!room) {
      socket.emit("no_room_found")
      return
    }

    var time
    switch (room.gameMode) {
      case "Slow":
        time = 20
        break
      case "Fast":
        time = 3
        break
      default:
        time = 5
        break
    }

    // Clear the previous countdown interval
    clearInterval(roundCountdown)
    if (room.currentQuestionIndex === room.songNumbers) {
      clearInterval(roundCountdown)
      io.in(roomId).emit("countdown_to_next_question", 0)
      setTimeout(() => {
        io.in(roomId).emit("game_ended", roomId)
      }, time)
      return
    }

    if (room.currentQuestionIndex == -1) {
      time = 0
    }

    // Start the countdown
    let countdown = time
    let delayInterval = null
    roundCountdown = setInterval(() => {
      if (countdown === 0 || room.currentAnswers === room.players.length) {
        // Stop the countdown

        clearInterval(roundCountdown)

        let delayCountdown = 3
        delayInterval = setInterval(() => {
          if (delayCountdown === 0) {
            clearInterval(delayInterval)
            room.currentQuestionIndex += 1

            // Check if game ended
            if (room.currentQuestionIndex === room.songNumbers) {
              io.in(roomId).emit("game_ended", roomId)
              return
            }

            const currentQuestion = getQuestion(
              room.currentQuestionIndex,
              room.questions
            )
            room.currentAnswers = 0
            room.currentCorrectAnswers = 0
            io.in(roomId).emit("new_question", currentQuestion)
          } else {
            io.in(roomId).emit("going_to_next_question", delayCountdown)
          }

          delayCountdown -= 1
        }, 1000)
      }
      io.in(roomId).emit("countdown_to_next_question", countdown)
      countdown -= 1
    }, 1000)
  })
})
server.listen(port, () => {
  console.log(`SERVER IS RUNNING on port: ${port}`)
})
