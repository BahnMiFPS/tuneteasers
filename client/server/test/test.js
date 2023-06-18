const { faker } = require("@faker-js/faker");

module.exports = {
  generateRoomAndUser,
  joinRoom,
};
const rooms = [];
function generateRoomAndUser(userContext, events, done) {
  const roomId = faker.number.int();
  const userName = faker.person.firstName();
  userContext.vars.createRoomData = {
    name: userName,
    roomId: roomId,
  };
  rooms.push(roomId);
  return done();
}
function joinRoom(userContext, events, done) {
  if (rooms.length > 0) {
    const roomId = rooms[Math.floor(Math.random() * rooms.length)]; // choose a random room from the array
    const userName = faker.person.firstName();
    userContext.vars.joinRoomData = {
      name: userName,
      roomId: roomId,
    };
  } else {
    return done(new Error("No rooms to join!"));
  }

  return done();
}
function getExistingRoomId(userContext, events, done) {
  if (rooms.length > 0) {
    const roomId = rooms[Math.floor(Math.random() * rooms.length)]; // choose a random room from the array
    const userName = faker.person.firstName();
    userContext.vars.joinRoomData = {
      name: userName,
      roomId: roomId,
    };
  } else {
    return done(new Error("No rooms to join!"));
  }

  return done();
}
