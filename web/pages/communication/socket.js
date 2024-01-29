import io from 'socket.io-client';

export var socket = null;
export const initSocket = () => {
    if (socket)
        return socket;

    socket = io(`http://${window.location.hostname}:5000`, {
        path: "/bridge/",
        transports: ['websocket']
    });
    return socket;
}
