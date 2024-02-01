import io from 'socket.io-client';

export var socket = null;
export const initSocket = () => {
    if (socket)
        return socket;

    socket = io(`https://meeting-socket-0b45b1849ed7.herokuapp.com`, {
        path: "/bridge/",
        transports: ['websocket']
    });
    return socket;
}
