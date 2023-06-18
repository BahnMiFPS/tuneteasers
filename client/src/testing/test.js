const { io } = require("socket.io-client");

const URL = process.env.URL || "http://localhost:3001";
const MAX_CLIENTS = 100;
const POLLING_PERCENTAGE = 0.05;
const CLIENT_CREATION_INTERVAL_IN_MS = 100;
const EMIT_INTERVAL_IN_MS = 2000;

let clientCount = 0;
let lastReport = new Date().getTime();
let packetsSinceLastReport = 0;

// Store all created rooms in a Set to avoid duplicates
let roomsCreated = new Set();

const createClient = () => {
  let roomId;
  let isRoomOwner = false;

  const transports =
    Math.random() < POLLING_PERCENTAGE ? ["polling"] : ["polling", "websocket"];
  const socket = io(URL, { transports });

  socket.on("custom_connect", () => {
    // Generate a unique room id
    roomId = Date.now() + "-" + Math.floor(Math.random() * 1000);

    if (!roomsCreated.has(roomId)) {
      roomsCreated.add(roomId);
      socket.emit("create_room", { name: "vu", roomId: roomId });
      isRoomOwner = true;
    } else {
      // Choose a random room to join
      const roomIds = Array.from(roomsCreated);
      const joinRoomId = roomIds[Math.floor(Math.random() * roomIds.length)];
      socket.emit("join_room", { name: "TestPlayer", roomId: joinRoomId });
    }

    socket.emit("pick_music", {
      roomId: 12,
      gameMode: "Normal",
      songNumbers: 5,
    });

    socket.on("start_choosing_music", () => {
      socket.emit("picked_music_starting_game", {
        roomId: 12,
        playlistId: "37i9dQZF1DWXti3N4Wp5xy",
      });
    });

    // Send real data and emit real events
    socket.emit("start_game", { roomId: 12 });
    socket.emit("room_game_init", { roomId: 12 });

    if (isRoomOwner) {
      socket.emit("next_question", { roomId: 12 });
    }

    socket.emit("chosen_answer", {
      roomId: 12,
      answerIndex: Math.floor(Math.random() * 4),
    });

    if (isRoomOwner) {
      socket.emit("next_question", { roomId: 12 });
    }

    socket.emit("chosen_answer", {
      roomId: 12,
      answerIndex: Math.floor(Math.random() * 4),
    });
  });

  socket.on("disconnect", (reason) => {
    console.log(`disconnect due to ${reason}`);
  });

  if (++clientCount < MAX_CLIENTS) {
    setTimeout(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
  }
};

createClient();

const printReport = () => {
  const now = new Date().getTime();
  const durationSinceLastReport = (now - lastReport) / 1000;
  const packetsPerSecond = (
    packetsSinceLastReport / durationSinceLastReport
  ).toFixed(2);

  console.log(
    `Client count: ${clientCount} ; Average packets received per second: ${packetsPerSecond}`
  );

  packetsSinceLastReport = 0;
  lastReport = now;
};

setInterval(printReport, 5000);
