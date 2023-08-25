import socketIOClient from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const socketInstance = socketIOClient(ENDPOINT);

const SocketService = {
  on: (event, fn) => socketInstance.on(event, fn),
  emit: (event, data) => socketInstance.emit(event, data),
  off: () => socketInstance.disconnect(),
};

Object.freeze(SocketService);

export default SocketService;
