const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const PROTO_PATH = "chat.proto";
const SERVER_URI = "127.0.0.1:50051";

const usersInChat = [];
const observers = [];

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

// we'll implement the handlers here
const join = (call, callback) => {
  console.log('CALL', call)
  const user = call.request;

  // check username already exists.
  const userExiist = usersInChat.find((_user) => _user.name == user.name);
  if (!userExiist) {
    usersInChat.push(user);
    callback(null, {
      error: 0,
      msg: "Success",
    });
  } else {
    callback(null, { error: 1, msg: "user already exist." });
  }
};

const sendMsg = (call, callback) => {
  const chatObj = call.request;
  observers.forEach((observer) => {
    observer.call.write(chatObj);
  });
  // chats.push(chatObj);

  callback(null, {});
};

const getAllUsers = (call, callback) => {
  callback(null, { users: usersInChat });
};

const receiveMsg = (call, callback) => {
  observers.push({
    call,
  });
};

const server = new grpc.Server();

server.addService(protoDescriptor.ChatService.service, {
  join,
  sendMsg,
  getAllUsers,
  receiveMsg,
});

server.bindAsync(
  SERVER_URI,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log(`Server running at http://${SERVER_URI}`);
    server.start();
  }
);
